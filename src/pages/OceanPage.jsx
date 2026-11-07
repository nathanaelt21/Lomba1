import { useRef, useState } from 'react';
import PageHero from '../components/layout/PageHero.jsx';
import DataExplorer from '../components/data/DataExplorer.jsx';
import OceanScene from '../components/data/OceanScene.jsx';
import StationCard from '../components/data/StationCard.jsx';
import EnvMap from '../components/map/EnvMap.jsx';
import DemoBadge from '../components/ui/DemoBadge.jsx';
import Icon from '../components/ui/Icon.jsx';
import { BarChart } from '../components/charts/Charts.jsx';
import { SectionHeading, StatusTag } from '../components/ui/Basics.jsx';
import { OCEAN_PARAMETERS, getParameter, assessValue, referenceText, STATUS_LABEL } from '../data/parameters.js';
import PlainReading from '../components/data/PlainReading.jsx';
import { formatValue } from '../utils/format.js';
import { getLatestAll } from '../services/dataProvider.js';
import { useAsync } from '../hooks/useAsync.js';
import { useReveal } from '../animations/reveal.js';
import { STATUS_HEX } from '../utils/status.js';
import './pages.css';

const refText = (p) => referenceText(p, false);

export default function OceanPage() {
  const scope = useRef(null);
  const { data } = useAsync(() => getLatestAll('ocean'), []);
  const [param, setParam] = useState('do');
  const [station, setStation] = useState('ancol-sea');
  const p = getParameter(param);
  useReveal(scope);

  // Stations ordered from the inner bay outward: the coast is to the south,
  // so a lower (more negative) latitude is closer to the city. The chart
  // used to reverse this list, contradicting the text above it.
  const ordered = data ? [...data].sort((a, b) => a.station.lat - b.station.lat) : [];
  const bars = ordered.map((l) => {
    const v = l.values[param].value;
    return { label: l.station.short || l.station.name, value: v, color: STATUS_HEX[assessValue(p, v)] };
  });
  const selected = data?.find((l) => l.station.id === station);

  return (
    <div ref={scope}>
      <PageHero variant="deep" eyebrow="Ocean quality · Teluk Jakarta" title="The ocean we share">
        Teluk Jakarta adalah teluk dangkal yang menerima air dari banyak sungai, pelabuhan yang sibuk, dan kota berpenduduk jutaan
        orang. Kondisi airnya sangat berbeda antara muara sungai dan terumbu pulau di Kepulauan Seribu.
      </PageHero>

      <section className="section section--tight">
        <div className="container">
          <SectionHeading eyebrow="Water conditions" title="From river mouth to island reef">
            Pilih parameter untuk membandingkan semua titik sampel, diurutkan dari teluk bagian dalam ke arah laut lepas. Warna batang
            menunjukkan apakah nilainya masih sesuai acuan: hijau aman, kuning mendekati batas, merah melewati acuan.
          </SectionHeading>
          <div className="chip-row" role="group" aria-label="Parameter" style={{ marginBottom: 'var(--s-4)' }}>
            {OCEAN_PARAMETERS.map((q) => (
              <button key={q.key} className="chip" aria-pressed={param === q.key} onClick={() => setParam(q.key)}>
                {q.short || q.name}
              </button>
            ))}
          </div>
          <div className="card gradient-card" data-reveal>
            <div className="gradient-card__head">
              <h3>
                {p.name} <span className="muted">({p.unit})</span>
              </h3>
              <DemoBadge />
            </div>
            {bars.length > 0 && (
              <BarChart
                items={bars}
                unit={p.unit}
                decimals={p.decimals}
                reference={p.reference}
                height={320}
                ariaLabel={`${p.name} di setiap titik sampel, data demo`}
              />
            )}
            <p className="tiny muted">
              Acuan: {p.reference.label} {p.reference.type !== 'note' && refText(p)}{' '}
              {p.reference.citation !== '—' && `(${p.reference.citation})`}
            </p>
            {selected && (
              <PlainReading
                param={p}
                value={selected.values[param].value}
                extra={`(Contoh untuk ${selected.station.name}: ${formatValue(selected.values[param].value, p.decimals)} ${p.unit}.)`}
              />
            )}
          </div>
          <div className="station-grid" style={{ marginTop: 'var(--s-6)' }}>
            {ordered.map((l) => (
              <StationCard
                key={l.station.id}
                latest={l}
                keys={['do', 'tss', 'chla']}
                active={l.station.id === station}
                onSelect={() => setStation(l.station.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight band band--deep on-dark">
        <div className="container">
          <SectionHeading eyebrow="Inside the water column" title="Where each measurement lives" />
          <div className="ocean-page__scene">
            <OceanScene selected={param} onSelect={setParam} />
            <div className="card ocean-page__param" key={param}>
              <span className="icon-bubble">
                <Icon name={p.icon} />
              </span>
              <h3>{p.name}</h3>
              <p className="param-card__simple">{p.simple}</p>
              <p>{p.what}</p>
              <p className="small">
                <b>Mengapa penting:</b> {p.why}
              </p>
              <p className="small">
                <b>Apa yang memengaruhinya:</b> {p.source}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <SectionHeading eyebrow="Reference" title="Parameters at a glance" />
          <div className="table-wrap" data-reveal>
            <table className="ref-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Satuan</th>
                  <th>Acuan (indikatif)</th>
                  <th>Dasar acuan</th>
                  <th>{selected?.station.name || 'Lokasi terpilih'} (demo)</th>
                </tr>
              </thead>
              <tbody>
                {OCEAN_PARAMETERS.map((q) => {
                  const v = selected?.values[q.key].value;
                  return (
                    <tr key={q.key}>
                      <td>
                        <b>{q.name}</b>
                      </td>
                      <td>{q.unit}</td>
                      <td>
                        {refText(q)} <span className="muted small">{q.reference.label}</span>
                      </td>
                      <td>{q.reference.citation}</td>
                      <td>
                        {v != null && (
                          <span title={STATUS_LABEL[assessValue(q, v)]}>
                            <StatusTag status={assessValue(q, v)} label={formatValue(v, q.decimals)} />
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="tiny muted">
            Nilai acuan bersifat indikatif dan harus dicek ulang dengan teks peraturan resmi sebelum data pengukuran asli
            dipublikasikan. Pilih kartu lokasi di atas untuk mengganti kolom terakhir.
          </p>
        </div>
      </section>

      <section className="section section--tight band band--foam">
        <div className="container">
          <SectionHeading eyebrow="History" title="Trends and comparisons" />
          <DataExplorer fixedDomain="ocean" key={station + param} initialStation={station} initialParam={param} />
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <SectionHeading eyebrow="Sampling points" title="Where the water is measured" />
          <EnvMap initialLayer="ocean" height={480} />
        </div>
      </section>
    </div>
  );
}
