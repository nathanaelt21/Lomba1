import PageHero from '../components/layout/PageHero.jsx';
import EnvMap from '../components/map/EnvMap.jsx';
import Icon from '../components/ui/Icon.jsx';
import './pages.css';

const TIPS = [
  { icon: 'wind', t: 'Lapisan udara', d: 'Stasiun di darat. Warna penanda mengikuti kategori ISPU.' },
  { icon: 'wave', t: 'Lapisan laut', d: 'Titik sampel di teluk. Warnanya menunjukkan parameter yang kondisinya paling buruk dibanding acuannya.' },
  { icon: 'pin', t: 'Gabungan', d: 'Keduanya sekaligus, untuk melihat udara pesisir dan perairan terdekat yang mungkin saling memengaruhi.' },
];

export default function ExplorePage() {
  return (
    <div>
      <PageHero variant="surface" eyebrow="Explore" title="Explore our environment">
        Geser, perbesar, dan ganti lapisan peta untuk menjelajahi kondisi udara dan laut di sekitar Teluk Jakarta. Di halaman
        ini, peta bisa diperbesar dengan roda mouse.
      </PageHero>
      <section className="section section--tight explore-page">
        <div className="container">
          <EnvMap initialLayer="combined" height={680} fullPage />
          <ul className="tips">
            {TIPS.map((t) => (
              <li key={t.t}>
                <span className="icon-bubble">
                  <Icon name={t.icon} />
                </span>
                <div>
                  <h3>{t.t}</h3>
                  <p>{t.d}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="tiny muted">
            Lokasi bersifat perkiraan dan semua nilai adalah data demo. Data peta © kontributor OpenStreetMap.
          </p>
        </div>
      </section>
    </div>
  );
}
