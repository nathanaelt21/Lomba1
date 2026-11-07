import { useRef } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/layout/PageHero.jsx';
import Icon from '../components/ui/Icon.jsx';
import DemoBadge from '../components/ui/DemoBadge.jsx';
import { SectionHeading } from '../components/ui/Basics.jsx';
import { DATA_SOURCES, SOURCE_STATUS } from '../data/sources.js';
import { useReveal } from '../animations/reveal.js';
import { dataMode } from '../services/dataProvider.js';
import './pages.css';

const GOALS = [
  { icon: 'info', t: 'Memberi informasi', d: 'Mengenalkan kondisi udara dan laut kepada masyarakat dengan bahasa yang mudah dipahami.' },
  { icon: 'gauge', t: 'Menampilkan', d: 'Menyajikan data kualitas udara dan laut berdampingan, lengkap dengan sumber, satuan, waktu, dan lokasinya.' },
  { icon: 'wave', t: 'Memantau perubahan', d: 'Membantu orang melihat perubahan kondisi dari hari ke hari, antarmusim, hingga antartahun.' },
  { icon: 'river', t: 'Menghubungkan', d: 'Menjelaskan hubungan yang sudah diketahui antara atmosfer dan ekosistem laut.' },
  { icon: 'leaf', t: 'Memvisualkan', d: 'Mengubah data yang rumit menjadi gambar dan grafik yang mudah dibaca.' },
  { icon: 'people', t: 'Melibatkan', d: 'Mendorong kepedulian dan partisipasi masyarakat dalam menjaga pesisir.' },
];

const USERS = ['Masyarakat umum', 'Pelajar & mahasiswa', 'Komunitas lingkungan', 'Peneliti', 'Masyarakat pesisir', 'Pengambil kebijakan'];

const PIPELINE = [
  { t: 'Kumpulkan', d: 'Mengambil data dari sumber resmi (BMKG, KLH, ISPU Jakarta, Unpad PODC) melalui API atau dataset yang dipublikasikan.' },
  { t: 'Periksa', d: 'Mengecek satuan, waktu, dan rentang nilai, lalu menandai data yang kosong atau janggal alih-alih diam-diam mengisinya.' },
  { t: 'Seragamkan', d: 'Mengubah semua data ke satu format: sumber, waktu pengambilan, lokasi, satuan, dan nilai.' },
  { t: 'Bandingkan', d: 'Membaca nilai terhadap acuan nasional (PP 22/2021, PermenLHK P.14/2020) sebagai panduan indikatif.' },
  { t: 'Tampilkan', d: 'Menyajikan tren, peta, dan perbandingan berdampingan, selalu disertai sumber dan waktunya.' },
];

const PRINCIPLES = [
  'Data asli harus selalu menampilkan sumber, waktu pengambilan, satuan, dan lokasinya.',
  'Data demo selalu diberi label DATA DEMO dan tidak pernah disajikan sebagai data waktu nyata.',
  'Batas acuan bersifat indikatif dan disertai rujukannya, serta wajib dicek dengan teks resmi.',
  'Korelasi ditampilkan sebagai pola, bukan sebagai bukti sebab-akibat.',
  'Lokasi yang hanya perkiraan selalu ditandai sebagai perkiraan.',
];

export default function AboutPage() {
  const scope = useRef(null);
  useReveal(scope);
  return (
    <div ref={scope}>
      <PageHero variant="surface" eyebrow="About SEAIR" title="Sea + Air, one ecosystem">
        Memahami hubungan antara udara yang kita hirup dan laut yang kita jaga bersama.
      </PageHero>

      <section className="section section--tight">
        <div className="container about-intro">
          <div data-reveal>
            <span className="eyebrow">Mission</span>
            <h2 className="title-lg">An environmental platform that feels like exploring, not reading a spreadsheet</h2>
          </div>
          <div data-reveal>
            <p className="lede">
              SEAIR menyatukan kualitas udara dan kualitas laut dalam satu ekosistem digital, agar orang bisa melihat keterkaitan
              keduanya. Prototipe ini berfokus pada <b>Teluk Jakarta</b> dan pesisirnya, tempat kota metropolitan, pelabuhan besar,
              dan teluk yang dangkal bertemu.
            </p>
            <div className="chip-row">
              {USERS.map((u) => (
                <span key={u} className="chip">
                  {u}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight band band--sky">
        <div className="container">
          <SectionHeading eyebrow="Goals" title="What SEAIR sets out to do" />
          <div className="goal-grid">
            {GOALS.map((g, i) => (
              <article key={g.t} className="card goal-card" data-reveal data-reveal-delay={(i % 3) * 0.06}>
                <span className="icon-bubble">
                  <Icon name={g.icon} />
                </span>
                <h3>{g.t}</h3>
                <p className="small muted">{g.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="methodology" className="section section--tight">
        <div className="container">
          <SectionHeading eyebrow="Methodology" title="From source to screen" />
          <ol className="steps steps--5">
            {PIPELINE.map((s, i) => (
              <li key={s.t} data-reveal>
                <span className="steps__n">{i + 1}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="sources" className="section section--tight band band--foam">
        <div className="container">
          <SectionHeading eyebrow="Data sources" title="Where the data will come from">
            Mode saat ini: <b>{dataMode === 'demo' ? 'Data demo' : 'API langsung'}</b>. Belum ada sumber di bawah ini yang terhubung.
          </SectionHeading>
          <div className="table-wrap" data-reveal>
            <table className="ref-table">
              <thead>
                <tr>
                  <th>Sumber</th>
                  <th>Lembaga</th>
                  <th>Cakupan data</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {DATA_SOURCES.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <b>{s.url ? <a href={s.url} target="_blank" rel="noreferrer">{s.name}</a> : s.name}</b>
                    </td>
                    <td>{s.full}</td>
                    <td>{s.covers.join(', ')}</td>
                    <td>
                      <span className="status-tag">
                        <i style={{ background: 'var(--status-watch)' }} />
                        {SOURCE_STATUS[s.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="integrity" className="section section--tight">
        <div className="container integrity">
          <div data-reveal>
            <span className="eyebrow">Data integrity</span>
            <h2 className="title-lg">Honest about every number</h2>
            <p className="muted">
              Sampai sumber asli terhubung, semua nilai di SEAIR dibuat di browser Anda dan diberi label seperti ini:
            </p>
            <DemoBadge />
          </div>
          <ul className="principles" data-reveal>
            {PRINCIPLES.map((p) => (
              <li key={p}>
                <Icon name="check" size={18} strokeWidth={3} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--tight band band--deep on-dark">
        <div className="container about-contact">
          <div>
            <h2 className="title-lg">Want to contribute data or ideas?</h2>
            <p>Kami senang mendengar masukan dari peneliti, instansi, dan masyarakat pesisir.</p>
          </div>
          <div className="about-contact__actions">
            <a href="mailto:hello@seair.example" className="btn btn--coral">
              hello@seair.example
            </a>
            <Link to="/explore" className="btn btn--ghost">
              Jelajahi peta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
