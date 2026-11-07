import { Cloud, Sun, Bird } from '../../components/illustrations/Sky.jsx';
import { Fish, BranchCoral, Seaweed, Bubbles } from '../../components/illustrations/Underwater.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { WaveDivider } from '../../components/ui/Basics.jsx';

const LINKS = [
  { icon: 'bubble', title: 'Pertukaran gas', text: 'Oksigen dan CO₂ berpindah bolak-balik melewati permukaan laut.' },
  { icon: 'dust', title: 'Pengendapan', text: 'Partikel, nitrogen, dan logam di udara jatuh sendiri atau terbawa hujan ke permukaan air.' },
  { icon: 'sun', title: 'Panas & uap air', text: 'Udara dan laut saling bertukar panas dan uap air, yang menggerakkan angin muson dan cuaca.' },
];

export default function TwoWorlds() {
  return (
    <section id="two-worlds" className="section two-worlds on-dark">
      <div className="container">
        <header className="section-heading section-heading--center" data-reveal>
          <span className="eyebrow">One planet, two ecosystems</span>
          <h2 className="title-xl">Two Worlds. One Living System.</h2>
          <p className="lede">
            Atmosfer dan lautan biasanya dipelajari terpisah, padahal keduanya bertemu di sepanjang jutaan kilometer permukaan laut.
            Apa yang terjadi di salah satunya akan segera terasa di yang lain.
          </p>
        </header>

        <div className="split">
          <article className="split__panel split__panel--air" data-reveal="left">
            <div className="split__scene" aria-hidden="true">
              <Sun className="split__sun" />
              <div className="drift" style={{ top: '18%', '--dur': '40s', '--delay': '-10s' }}>
                <Cloud shape="a" style={{ width: 160 }} />
              </div>
              <div className="drift" style={{ top: '46%', '--dur': '55s', '--delay': '-30s' }}>
                <Cloud shape="c" style={{ width: 110 }} />
              </div>
              <Bird className="split__bird" />
              <svg className="split__wind" viewBox="0 0 300 80">
                <path d="M10 30 H200 a20 20 0 1 0 -20 -20" />
                <path d="M40 60 H250 a16 16 0 1 1 -16 16" />
              </svg>
            </div>
            <div className="split__body">
              <span className="split__tag">
                <Icon name="wind" size={18} /> Atmosfer
              </span>
              <h3>Udara yang kita hirup</h3>
              <ul>
                <li>Lapisan tipis gas yang membawa panas, uap air, dan polutan melintasi wilayah yang luas.</li>
                <li>Angin bisa membawa emisi dari kota, pelabuhan, dan industri jauh sampai ke atas laut.</li>
                <li>
                  Diukur dengan <b>ISPU</b> serta polutan seperti <b>PM2.5</b>, <b>SO₂</b>, dan <b>NO₂</b>.
                </li>
              </ul>
            </div>
          </article>

          <div className="split__bridge" data-reveal="scale" aria-hidden="true">
            <span className="split__arrow split__arrow--down">↓</span>
            <span className="split__core">
              <Icon name="wave" size={30} />
            </span>
            <span className="split__arrow split__arrow--up">↑</span>
          </div>

          <article className="split__panel split__panel--ocean" data-reveal="right">
            <div className="split__scene" aria-hidden="true">
              <Bubbles count={10} seed={5} />
              <div className="swim" style={{ top: '22%', '--dur': '18s' }}>
                <Fish color="coral" style={{ width: 70 }} />
              </div>
              <div className="swim swim--left" style={{ top: '50%', '--dur': '24s', '--delay': '-9s' }}>
                <Fish color="sand" style={{ width: 52 }} />
              </div>
              <BranchCoral className="split__coral" />
              <Seaweed className="split__weed" color="#70D6CE" height={120} />
            </div>
            <div className="split__body">
              <span className="split__tag">
                <Icon name="wave" size={18} /> Lautan
              </span>
              <h3>Laut yang kita jaga bersama</h3>
              <ul>
                <li>Laut telah menyerap lebih dari 90% kelebihan panas yang terperangkap oleh gas rumah kaca.</li>
                <li>Laut menyerap sebagian besar emisi CO₂ manusia, yang perlahan menurunkan pH air laut.</li>
                <li>
                  Diukur melalui <b>pH</b>, <b>oksigen terlarut</b>, <b>salinitas</b>, <b>klorofil-a</b>, dan lainnya.
                </li>
              </ul>
            </div>
          </article>
        </div>

        <ul className="links">
          {LINKS.map((l, i) => (
            <li key={l.title} data-reveal data-reveal-delay={i * 0.1}>
              <span className="icon-bubble">
                <Icon name={l.icon} />
              </span>
              <div>
                <h4>{l.title}</h4>
                <p>{l.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <WaveDivider position="bottom" fill="var(--sky)" back="rgba(168,223,240,.35)" />
    </section>
  );
}
