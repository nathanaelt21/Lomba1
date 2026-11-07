import { useMemo, useRef, useState } from 'react';
import PageHero from '../components/layout/PageHero.jsx';
import { DualLineChart, ScatterPlot, BarChart } from '../components/charts/Charts.jsx';
import { SERIES_COLORS } from '../components/charts/chartSetup.js';
import DemoBadge from '../components/ui/DemoBadge.jsx';
import Icon from '../components/ui/Icon.jsx';
import { SectionHeading } from '../components/ui/Basics.jsx';
import { CausationNote } from '../sections/home/ConnectionSection.jsx';
import { AIR_PARAMETERS, OCEAN_PARAMETERS, getParameter } from '../data/parameters.js';
import { stationsFor, getStation } from '../data/stations.js';
import { getSeries, getLatestAll } from '../services/dataProvider.js';
import { useAsync } from '../hooks/useAsync.js';
import { useReveal } from '../animations/reveal.js';
import { pearson, describeCorrelation, explainCorrelation, linearFit, mean } from '../utils/stats.js';
import { wetness, seasonOf } from '../utils/season.js';
import { formatValue, formatSigned } from '../utils/format.js';
import './pages.css';

const monthFmt = new Intl.DateTimeFormat('id-ID', { month: 'short', timeZone: 'Asia/Jakarta' });

function useKeyInsights() {
  return useAsync(async () => {
    const [pm, latestOcean] = await Promise.all([
      getSeries({ stationId: 'priok-air', parameter: 'pm25', period: '1y' }),
      getLatestAll('ocean'),
    ]);
    const dry = mean(pm.points.filter((p) => seasonOf(p.t) === 'dry').map((p) => p.v));
    const wet = mean(pm.points.filter((p) => seasonOf(p.t) === 'wet').map((p) => p.v));
    const chl = Object.fromEntries(latestOcean.map((l) => [l.station.id, l.values.chla.value]));
    const lowestDo = latestOcean.reduce((a, b) => (b.values.do.value < a.values.do.value ? b : a));
    return [
      {
        icon: 'sun',
        title: 'Kemarau, udara lebih berdebu',
        value: `${formatSigned(((dry - wet) / wet) * 100, 0)}%`,
        text: `Rata-rata PM2.5 di Tanjung Priok ${formatValue(dry)} µg/m³ saat kemarau, dibandingkan ${formatValue(wet)} µg/m³ saat musim hujan. Hujan membilas debu dari udara.`,
      },
      {
        icon: 'plankton',
        title: 'Air lebih hijau di dekat pantai',
        value: `${formatValue(chl['angke-sea'] / chl['pari-sea'], 0)}×`,
        text: 'Perbandingan klorofil-a di muara Muara Angke dengan Pulau Pari. Teluk bagian dalam yang kaya nutrien menumbuhkan jauh lebih banyak plankton.',
      },
      {
        icon: 'bubble',
        title: 'Oksigen terendah',
        value: `${formatValue(lowestDo.values.do.value)} mg/L`,
        text: `Saat ini di ${lowestDo.station.name}, dibandingkan batas minimum 5 mg/L untuk biota laut.`,
      },
    ];
  }, []);
}

export default function InsightsPage() {
  const scope = useRef(null);
  const [airSt, setAirSt] = useState('priok-air');
  const [airP, setAirP] = useState('pm25');
  const [seaSt, setSeaSt] = useState('angke-sea');
  const [seaP, setSeaP] = useState('chla');
  const insights = useKeyInsights();
  const { data } = useAsync(
    () =>
      Promise.all([
        getSeries({ stationId: airSt, parameter: airP, period: '1y' }),
        getSeries({ stationId: seaSt, parameter: seaP, period: '1y' }),
      ]),
    [airSt, airP, seaSt, seaP]
  );
  useReveal(scope);

  const a = getParameter(airP);
  const o = getParameter(seaP);

  const analysis = useMemo(() => {
    if (!data) return null;
    const [air, sea] = data;
    const xs = air.points.map((p) => p.v);
    const ys = sea.points.map((p) => p.v);
    const season = air.points.map((p) => wetness(p.t));
    const r = pearson(xs, ys);
    const bySeason = (pts) => ({
      wet: mean(pts.filter((p) => seasonOf(p.t) === 'wet').map((p) => p.v)),
      dry: mean(pts.filter((p) => seasonOf(p.t) === 'dry').map((p) => p.v)),
    });
    return {
      labels: air.points.map((p) => monthFmt.format(new Date(p.t))),
      xs,
      ys,
      r,
      rAirSeason: pearson(xs, season),
      rSeaSeason: pearson(ys, season),
      fit: linearFit(xs, ys),
      airSeason: bySeason(air.points),
      seaSeason: bySeason(sea.points),
    };
  }, [data]);

  return (
    <div ref={scope}>
      <PageHero variant="surface" eyebrow="Insights" title="How the air and the sea move together">
        Lihat data udara dan laut selama setahun secara berdampingan. Coba juga: seret permukaan air untuk membuat ombak.
      </PageHero>

      <section className="section section--tight">
        <div className="container">
          <SectionHeading eyebrow="Highlights" title="What the demo year shows">
            Sorotan ini dihitung langsung dari data demo. Tujuannya menunjukkan cara SEAIR merangkum data asli nanti, jadi ini
            bukan temuan tentang kondisi Teluk Jakarta.
          </SectionHeading>
          <div className="insight-grid">
            {insights.data?.map((i, k) => (
              <article key={i.title} className="insight-card card" data-reveal data-reveal-delay={k * 0.08}>
                <span className="icon-bubble">
                  <Icon name={i.icon} />
                </span>
                <span className="insight-card__value">{i.value}</span>
                <h3>{i.title}</h3>
                <p className="small muted">{i.text}</p>
                <DemoBadge compact />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight band band--foam">
        <div className="container">
          <SectionHeading eyebrow="Side by side" title="A year of air and ocean">
            Pilih satu data udara dan satu data laut. Grafik memakai dua skala (kiri untuk udara, kanan untuk laut), jadi bandingkan
            bentuk naik-turunnya, bukan tinggi garisnya.
          </SectionHeading>

          <div className="pair-controls">
            <fieldset className="pair-controls__group pair-controls__group--air">
              <legend>
                <Icon name="wind" size={16} /> Udara
              </legend>
              <label className="field">
                Stasiun
                <select value={airSt} onChange={(e) => setAirSt(e.target.value)}>
                  {stationsFor('air').map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Parameter
                <select value={airP} onChange={(e) => setAirP(e.target.value)}>
                  {AIR_PARAMETERS.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
            </fieldset>
            <fieldset className="pair-controls__group pair-controls__group--ocean">
              <legend>
                <Icon name="wave" size={16} /> Laut
              </legend>
              <label className="field">
                Lokasi
                <select value={seaSt} onChange={(e) => setSeaSt(e.target.value)}>
                  {stationsFor('ocean').map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Parameter
                <select value={seaP} onChange={(e) => setSeaP(e.target.value)}>
                  {OCEAN_PARAMETERS.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
            </fieldset>
          </div>

          {analysis && (
            <div className="card">
              <div className="gradient-card__head">
                <h3>
                  {a.name} di {getStation(airSt).name} · {o.name} di {getStation(seaSt).name}
                </h3>
                <DemoBadge />
              </div>
              <DualLineChart
                labels={analysis.labels}
                left={{ label: a.name, unit: a.unit, values: analysis.xs, color: SERIES_COLORS.air }}
                right={{ label: o.short || o.name, unit: o.unit, values: analysis.ys, color: SERIES_COLORS.ocean }}
                ariaLabel="Nilai mingguan udara dan laut selama satu tahun, data demo"
              />
              <p className="tiny muted">Rata-rata mingguan selama 12 bulan terakhir · data demo yang dibuat di browser Anda.</p>
            </div>
          )}
        </div>
      </section>

      {analysis && (
        <section className="section section--tight">
          <div className="container">
            <SectionHeading eyebrow="Correlation" title="Do they rise and fall together?" />
            <div className="corr-grid">
              <div className="card">
                <ScatterPlot
                  points={analysis.xs.map((x, i) => ({ x, y: analysis.ys[i] }))}
                  fit={analysis.fit}
                  xLabel={`${a.name} (${a.unit})`}
                  yLabel={`${o.short || o.name} (${o.unit})`}
                  ariaLabel="Diagram sebar nilai mingguan udara terhadap laut"
                />
              </div>
              <div className="corr-read">
                <div className="corr-r card">
                  <span className="tiny muted">Korelasi Pearson (r)</span>
                  <span className="corr-r__value">{formatValue(analysis.r, 2)}</span>
                  <b>{describeCorrelation(analysis.r)}</b>
                  <p className="small muted corr-r__explain">{explainCorrelation(analysis.r)}</p>
                  <div className="corr-r__bar" aria-hidden="true">
                    {Number.isFinite(analysis.r) && <span style={{ left: `${((analysis.r + 1) / 2) * 100}%` }} />}
                  </div>
                  <div className="corr-r__scale tiny muted">
                    <span>−1</span>
                    <span>0</span>
                    <span>+1</span>
                  </div>
                </div>
                <div className="card confounder">
                  <h3>
                    <Icon name="rain" size={20} /> Cek penyebab bersama: musim
                  </h3>
                  <p className="small">
                    Kedua data sama-sama mengikuti musim. Korelasi dengan indeks kalender musim hujan: {a.name}{' '}
                    <b>r = {formatValue(analysis.rAirSeason, 2)}</b>, {o.short || o.name} <b>r = {formatValue(analysis.rSeaSeason, 2)}</b>.
                    {Math.abs(analysis.rAirSeason) > 0.4 && Math.abs(analysis.rSeaSeason) > 0.4
                      ? ' Keduanya sangat mengikuti musim, jadi musim itu sendiri mungkin menjelaskan sebagian besar hubungan keduanya.'
                      : ' Setidaknya salah satunya tidak terlalu mengikuti musim, jadi ada faktor lain yang berperan.'}
                  </p>
                  <BarChart
                    height={180}
                    unit=""
                    items={[
                      { label: `${a.name} hujan`, value: analysis.airSeason.wet / analysis.airSeason.dry, color: '#2B8FB8' },
                      { label: `${a.name} kemarau`, value: 1, color: '#A8DFF0' },
                      { label: `${o.short || o.name} hujan`, value: analysis.seaSeason.wet / analysis.seaSeason.dry, color: '#087E8B' },
                      { label: `${o.short || o.name} kemarau`, value: 1, color: '#70D6CE' },
                    ]}
                    decimals={2}
                    ariaLabel="Rata-rata musim hujan dibandingkan musim kemarau"
                  />
                  <p className="tiny muted">
                    Batang menunjukkan rata-rata musim hujan dibanding kemarau (kemarau = 1). Di atas 1 berarti lebih tinggi saat musim
                    hujan.
                  </p>
                </div>
              </div>
            </div>
            <CausationNote />
          </div>
        </section>
      )}
    </div>
  );
}
