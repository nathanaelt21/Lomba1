import { Link } from 'react-router-dom';
import { SectionHeading, WaveDivider } from '../../components/ui/Basics.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { BranchCoral, BrainCoral, FanCoral, Seaweed, Bubbles, Fish } from '../../components/illustrations/Underwater.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';

const ACTIONS = [
  {
    key: 'awareness',
    icon: 'info',
    title: 'Stay aware',
    text: 'Cek kualitas udara sebelum beraktivitas di luar, dan pahami arti angka-angkanya untuk keluarga Anda.',
    pledge: 'Saya akan cek ISPU sebelum lama beraktivitas di luar',
  },
  {
    key: 'habits',
    icon: 'leaf',
    title: 'Greener habits',
    text: 'Jalan kaki, bersepeda, atau naik transportasi umum untuk jarak dekat. Makin sedikit mesin menyala, makin sedikit NO₂ dan PM2.5 yang melayang ke teluk.',
    pledge: 'Saya akan mengganti satu perjalanan mobil/motor tiap minggu',
  },
  {
    key: 'coast',
    icon: 'shield',
    title: 'Protect the coast',
    text: 'Mangrove dan lamun menahan lumpur, menjadi rumah bagi anak ikan, dan meredam ombak. Dukung pemulihan pesisir di sekitar Anda.',
    pledge: 'Saya akan ikut atau mendukung penanaman mangrove',
  },
  {
    key: 'pollution',
    icon: 'recycle',
    title: 'Cut the pollution',
    text: 'Jangan membakar sampah, pilah sampah Anda, dan jauhkan plastik serta minyak dari selokan, karena selokan bermuara ke sungai dan sungai bermuara ke laut.',
    pledge: 'Saya tidak akan membakar sampah di tempat terbuka',
  },
  {
    key: 'community',
    icon: 'people',
    title: 'Join the community',
    text: 'Ikut aksi bersih pantai dan sains warga, lalu bagikan apa yang Anda pelajari kepada tetangga dan sekolah.',
    pledge: 'Saya akan ikut bersih-bersih pantai atau membagikan SEAIR',
  },
];

const CORALS = [
  { C: BranchCoral, props: { color: '#FF927E', tip: '#FFC2B4' }, left: '6%', w: 120 },
  { C: BrainCoral, props: {}, left: '24%', w: 130 },
  { C: FanCoral, props: { color: '#70D6CE' }, left: '46%', w: 140 },
  { C: BranchCoral, props: { color: '#F4D6A0', tip: '#FCEBCB' }, left: '66%', w: 110 },
  { C: FanCoral, props: { color: '#FF927E' }, left: '82%', w: 120 },
];

export default function ActionSection() {
  const [stored, setPledges] = useLocalStorage('seair:pledges', []);
  // Guard against old or hand-edited storage values that are not a list.
  const pledges = Array.isArray(stored) ? stored.filter((k) => ACTIONS.some((a) => a.key === k)) : [];
  const toggle = (k) => setPledges(() => (pledges.includes(k) ? pledges.filter((x) => x !== k) : [...pledges, k]));
  const n = pledges.length;

  return (
    <section id="action" className="section action-section on-dark">
      <WaveDivider position="top" fill="var(--cloud)" flip />
      <Bubbles count={16} seed={21} />
      <div className="container">
        <SectionHeading eyebrow="Take action" title="Small actions, rising together" align="center">
          Setiap janji yang Anda pilih akan menumbuhkan satu karang di terumbu di bawah. Pilihan Anda hanya disimpan di browser ini.
        </SectionHeading>

        <div className="action-grid">
          {ACTIONS.map((a, i) => {
            const on = pledges.includes(a.key);
            return (
              <article key={a.key} className={`action-card ${on ? 'is-on' : ''}`} data-reveal data-reveal-delay={i * 0.06}>
                <span className="icon-bubble">
                  <Icon name={a.icon} />
                </span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
                <button className="action-card__pledge" aria-pressed={on} onClick={() => toggle(a.key)}>
                  <span className="action-card__check">{on && <Icon name="check" size={14} strokeWidth={3} />}</span>
                  {a.pledge}
                </button>
              </article>
            );
          })}
        </div>

        <p className="action-count" aria-live="polite">
          {n === 0
            ? 'Pilih satu janji untuk mulai menumbuhkan terumbu Anda.'
            : n === ACTIONS.length
              ? 'Terumbu Anda tumbuh subur — terima kasih!'
              : `${n} dari ${ACTIONS.length} karang sudah tumbuh.`}
        </p>

        <div className="action-cta">
          <Link to="/map" target="_blank" rel="noopener noreferrer" className="btn btn--coral">
            Open map <Icon name="arrow" size={18} />
          </Link>
          <Link to="/about" className="btn btn--ghost">
            About SEAIR
          </Link>
        </div>
      </div>
      {/* The one seabed at the bottom of the page: it overlays into the footer. */}
      <div className="action-reef" aria-hidden="true">
        {CORALS.map(({ C, props, left, w }, i) => (
          <div key={i} className={`action-reef__coral ${i < n ? 'is-grown' : ''}`} style={{ left, width: w }}>
            <C {...props} />
          </div>
        ))}
        <Seaweed className="action-reef__weed" color="#087E8B" height={140} />
        <div className="swim" style={{ top: '10%', '--dur': '22s' }}>
          <Fish color="sand" style={{ width: 56 }} />
        </div>
        {n === ACTIONS.length && (
          <div className="swim swim--left" style={{ top: '30%', '--dur': '16s' }}>
            <Fish color="coral" style={{ width: 70 }} />
          </div>
        )}
      </div>
    </section>
  );
}
