import { useRef, useState } from 'react';
import PageHero from '../components/layout/PageHero.jsx';
import DataExplorer from '../components/data/DataExplorer.jsx';
import ParamCard from '../components/data/ParamCard.jsx';
import IspuScale from '../components/data/IspuScale.jsx';
import StationCard from '../components/data/StationCard.jsx';
import DemoBadge from '../components/ui/DemoBadge.jsx';
import { SectionHeading } from '../components/ui/Basics.jsx';
import { AIR_PARAMETERS } from '../data/parameters.js';
import { getLatestAll } from '../services/dataProvider.js';
import { useAsync } from '../hooks/useAsync.js';
import { useReveal } from '../animations/reveal.js';
import { formatDateTime } from '../utils/format.js';
import { ispuCategory } from '../utils/ispu.js';
import Icon from '../components/ui/Icon.jsx';
import './pages.css';

const STEPS = [
  { n: 1, t: 'Ukur', d: 'Stasiun pemantau mencatat kadar polutan di udara, biasanya setiap jam.' },
  { n: 2, t: 'Rata-ratakan', d: 'Setiap polutan dirata-ratakan sesuai periode bakunya, misalnya 24 jam untuk partikel debu.' },
  { n: 3, t: 'Hitung sub-indeks', d: 'Setiap kadar polutan diubah menjadi sub-indeks 0–500 memakai batas-batas resmi.' },
  { n: 4, t: 'Laporkan', d: 'Sub-indeks tertinggi menjadi nilai ISPU, dan polutannya dilaporkan sebagai polutan dominan.' },
];

export default function AirPage() {
  const scope = useRef(null);
  const { data } = useAsync(() => getLatestAll('air'), []);
  const [sel, setSel] = useState('priok-air');
  const current = data?.find((l) => l.station.id === sel);
  useReveal(scope);

  return (
    <div ref={scope}>
      <PageHero
        variant="sky"
        eyebrow="Air quality · Jakarta coast"
        title="The air we breathe"
        aside={
          current && (
            <div className="card card--glass hero-reading">
              <div className="hero-reading__head">
                <span className="tiny muted">{current.station.name}</span>
                <DemoBadge compact />
              </div>
              <span className="hero-reading__value">{current.values.ispu.value}</span>
              <span className="small muted">
                ISPU · <b style={{ color: ispuCategory(current.values.ispu.value).hex }}>{ispuCategory(current.values.ispu.value).id}</b> ·{' '}
                {formatDateTime(current.t)}
              </span>
              <IspuScale value={current.values.ispu.value} />
              <p className="small hero-reading__advice">
                <b>Saran hari ini:</b>
              </p>
              <ul className="health-tips">
                {ispuCategory(current.values.ispu.value).tips.map((t) => (
                  <li key={t}>
                    <Icon name="check" size={14} strokeWidth={3} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )
        }
      >
        Di atas Teluk Jakarta, emisi dari kendaraan, pelabuhan, dan industri bercampur dengan angin laut. Klik langit untuk
        hembusan angin dan gerakkan kursor untuk mengaduk udara.
      </PageHero>

      <section className="section section--tight">
        <div className="container">
          <SectionHeading eyebrow="Stations" title="Today across Jakarta">
            Pilih salah satu stasiun untuk memperbarui angka di atas. Stasiun pesisir ikut ditampilkan untuk mengikuti udara yang
            bergerak ke arah teluk.
          </SectionHeading>
          <div className="station-grid">
            {data?.map((l) => (
              <StationCard key={l.station.id} latest={l} keys={['pm25', 'no2']} active={l.station.id === sel} onSelect={() => setSel(l.station.id)} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight band band--sky">
        <div className="container">
          <SectionHeading eyebrow="How ISPU works" title="From a sensor reading to a single number" />
          <ol className="steps">
            {STEPS.map((s) => (
              <li key={s.n} data-reveal>
                <span className="steps__n">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="card ispu-advice" data-reveal>
            <h3>What each category means</h3>
            <IspuScale value={current?.values.ispu.value} showAdvice />
            <p className="tiny muted">
              Kategori mengikuti PermenLHK P.14/2020. SEAIR menghitung ISPU ilustrasi hanya dari nilai demo PM2.5 dan PM10.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <SectionHeading eyebrow="Parameters" title="Seven numbers, one sky">
            Arahkan kursor atau ketuk kartu untuk melihat asal setiap polutan dan mengapa penting bagi manusia dan laut. Nilai yang
            tampil adalah untuk {current?.station.name || 'stasiun yang dipilih'}.
          </SectionHeading>
          <div className="param-grid">
            {AIR_PARAMETERS.map((p, i) => (
              <ParamCard key={p.key} param={p} value={current?.values[p.key].value} revealDelay={(i % 3) * 0.06} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight band band--foam">
        <div className="container">
          <SectionHeading eyebrow="History" title="Trends and comparisons" />
          <DataExplorer fixedDomain="air" key={sel} initialStation={sel} />
        </div>
      </section>
    </div>
  );
}
