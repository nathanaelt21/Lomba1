import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { AIR_PARAMETERS, OCEAN_PARAMETERS, referenceText } from '../../data/parameters.js';
import { ISPU_CATEGORIES } from '../../utils/ispu.js';

/** Everyday explanations of the words and units used across SEAIR. */
const TERMS = [
  { t: 'ISPU', g: 'Istilah umum', d: 'Indeks Standar Pencemar Udara: "rapor" kualitas udara dalam satu angka 0–500. Makin kecil makin bersih.' },
  { t: 'Baku mutu / acuan', g: 'Istilah umum', d: 'Batas yang ditetapkan pemerintah agar udara atau air dianggap aman. Di SEAIR ditampilkan sebagai garis putus-putus atau pita berwarna di grafik.' },
  { t: 'DATA DEMO', g: 'Istilah umum', d: 'Angka contoh yang dibuat otomatis di browser Anda untuk memperlihatkan cara kerja SEAIR. Belum berasal dari alat ukur sungguhan.' },
  { t: 'Stasiun / titik sampel', g: 'Istilah umum', d: 'Tempat alat ukur dipasang (di darat untuk udara) atau tempat air laut diambil untuk diperiksa.' },
  { t: 'Rata-rata harian / mingguan', g: 'Istilah umum', d: 'Semua nilai dalam satu hari (atau satu minggu) dijumlahkan lalu dibagi, sehingga naik-turun kecil tidak terlalu terlihat.' },
  { t: 'Korelasi (r)', g: 'Istilah umum', d: 'Angka −1 sampai +1 yang menunjukkan seberapa kompak dua data naik-turun bersama. Mendekati 0 berarti hampir tidak berhubungan. Korelasi bukan bukti sebab-akibat.' },
  { t: 'Musim hujan & kemarau', g: 'Istilah umum', d: 'Di Jakarta, puncak musim hujan sekitar Desember–Maret dan kemarau sekitar Juni–September. Musim sangat memengaruhi polusi udara dan kondisi laut.' },
  { t: 'µg/m³', g: 'Satuan', d: 'Mikrogram per meter kubik: berapa banyak polutan (dalam sepersejuta gram) di dalam satu kotak udara berukuran 1×1×1 meter.' },
  { t: 'mg/L', g: 'Satuan', d: 'Miligram per liter: berapa banyak zat (dalam seperseribu gram) di dalam satu liter air.' },
  { t: 'µg/L', g: 'Satuan', d: 'Mikrogram per liter: seperseribu dari mg/L. Dipakai untuk zat yang jumlahnya sangat sedikit, seperti klorofil-a.' },
  { t: '‰ (per mil)', g: 'Satuan', d: 'Per seribu. Salinitas 33‰ berarti ada sekitar 33 gram garam dalam 1 kilogram air laut.' },
  { t: 'pH', g: 'Satuan', d: 'Skala keasaman 0–14. Angka 7 netral, di bawah 7 asam, di atas 7 basa. Air laut sehat sekitar 8.' },
  { t: 'Eutrofikasi', g: 'Istilah laut', d: 'Air "kebanyakan pupuk" (nutrien) sehingga alga tumbuh berlebihan. Saat alga mati dan membusuk, oksigen di air habis.' },
  { t: 'Hipoksia', g: 'Istilah laut', d: 'Kondisi air yang kekurangan oksigen. Ikan bisa stres, pergi, atau mati.' },
  { t: 'Coral bleaching (pemutihan karang)', g: 'Istilah laut', d: 'Karang menjadi putih karena stres panas atau polusi. Jika berlangsung lama, karang bisa mati.' },
  { t: 'Estuari / muara', g: 'Istilah laut', d: 'Tempat sungai bertemu laut. Airnya campuran tawar dan asin, dan biasanya paling banyak menerima limbah dari daratan.' },
  { t: 'Pengendapan (deposisi)', g: 'Istilah udara', d: 'Proses jatuhnya partikel atau gas dari udara ke tanah atau laut, baik sendiri (kering) maupun terbawa hujan (basah).' },
  { t: 'Emisi', g: 'Istilah udara', d: 'Gas atau partikel yang dilepaskan ke udara, misalnya dari knalpot, cerobong pabrik, atau pembakaran sampah.' },
];

const PARAM_TERMS = [...AIR_PARAMETERS, ...OCEAN_PARAMETERS].map((p) => ({
  t: p.short && p.short !== p.name ? `${p.name} (${p.short})` : p.name,
  g: p.domain === 'air' ? 'Parameter udara' : 'Parameter laut',
  d: `${p.simple} ${p.what}`,
  ref: p.reference.type !== 'note' ? `Acuan: ${referenceText(p)} · ${p.reference.citation}` : p.reference.label,
}));

const ISPU_TERMS = ISPU_CATEGORIES.map((c) => ({
  t: `ISPU ${c.id} (${c.max === 500 ? `${c.min}+` : `${c.min}–${c.max}`})`,
  g: 'Kategori ISPU',
  d: c.advice,
  color: c.hex,
}));

const ALL = [...TERMS, ...PARAM_TERMS, ...ISPU_TERMS];
const GROUPS = ['Semua', 'Istilah umum', 'Satuan', 'Parameter udara', 'Parameter laut', 'Kategori ISPU', 'Istilah laut', 'Istilah udara'];

const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

/** Floating help button + searchable glossary panel. */
export default function Glossary() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('Semua');
  const input = useRef(null);
  const trigger = useRef(null);
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => input.current?.focus(), 60);
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
      // Keep keyboard focus inside the dialog.
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll('button, input, [tabindex="0"]');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  const list = useMemo(() => {
    const n = norm(q.trim());
    return ALL.filter((x) => (group === 'Semua' || x.g === group) && (!n || norm(`${x.t} ${x.d}`).includes(n)));
  }, [q, group]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={`glossary-fab ${open ? 'is-hidden' : ''}`}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Icon name="book" size={20} />
        <span>Glossary</span>
      </button>

      <div className={`glossary ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="glossary__backdrop" onClick={close} />
        <div
          className="glossary__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="glossary-title"
          ref={panel}
          inert={open ? undefined : ''}
        >
          <div className="glossary__head">
            <div>
              <h2 id="glossary-title">Glossary</h2>
              <p className="small muted">Penjelasan sederhana untuk istilah, satuan, dan angka di SEAIR.</p>
            </div>
            <button type="button" className="glossary__close" onClick={close} aria-label="Tutup kamus">
              <Icon name="close" size={20} />
            </button>
          </div>
          <label className="glossary__search">
            <Icon name="search" size={18} />
            <input
              ref={input}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari, misalnya: PM2.5, pH, mg/L…"
              aria-label="Cari istilah"
            />
          </label>
          <div className="chip-row glossary__groups" role="group" aria-label="Kelompok istilah">
            {GROUPS.map((g) => (
              <button key={g} type="button" className="chip" aria-pressed={group === g} onClick={() => setGroup(g)}>
                {g}
              </button>
            ))}
          </div>
          <ul className="glossary__list" aria-live="polite">
            {list.map((x) => (
              <li key={`${x.g}-${x.t}`}>
                <div className="glossary__term">
                  {x.color && <i style={{ background: x.color }} />}
                  <b>{x.t}</b>
                  <small>{x.g}</small>
                </div>
                <p>{x.d}</p>
                {x.ref && <p className="tiny muted">{x.ref}</p>}
              </li>
            ))}
            {list.length === 0 && <li className="glossary__empty">Istilah tidak ditemukan. Coba kata lain.</li>}
          </ul>
        </div>
      </div>
    </>
  );
}
