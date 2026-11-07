/**
 * ISPU (Indeks Standar Pencemar Udara) helpers.
 * Category bands follow PermenLHK No. P.14/2020. The sub-index breakpoints
 * below are used ONLY to derive an illustrative ISPU from demo concentrations;
 * verify them against the regulation before using real data.
 */
export const ISPU_CATEGORIES = [
  { key: 'good', id: 'Baik', en: 'Good', min: 0, max: 50, color: 'var(--ispu-good)', hex: '#3fae6a',
    advice: 'Udara bersih dan sehat untuk manusia maupun lingkungan.',
    tips: ['Aman untuk olahraga dan beraktivitas di luar ruangan.', 'Waktu yang baik untuk membuka jendela agar udara segar masuk.'] },
  { key: 'moderate', id: 'Sedang', en: 'Moderate', min: 51, max: 100, color: 'var(--ispu-moderate)', hex: '#3b8fd9',
    advice: 'Masih bisa diterima oleh kebanyakan orang. Kelompok sensitif sebaiknya tidak terlalu lama beraktivitas berat di luar.',
    tips: ['Aktivitas luar ruangan umumnya tetap aman.', 'Anak-anak, lansia, dan penderita asma sebaiknya mengurangi olahraga berat di luar.'] },
  { key: 'unhealthy', id: 'Tidak Sehat', en: 'Unhealthy', min: 101, max: 200, color: 'var(--ispu-unhealthy)', hex: '#f2c230',
    advice: 'Bisa mengganggu kesehatan kelompok sensitif serta merugikan tumbuhan dan hewan. Kurangi aktivitas di luar ruangan.',
    tips: ['Gunakan masker saat di luar, terutama di jalan raya.', 'Kurangi olahraga di luar ruangan; pilih di dalam ruangan.', 'Tutup jendela saat polusi tinggi.'] },
  { key: 'very', id: 'Sangat Tidak Sehat', en: 'Very unhealthy', min: 201, max: 300, color: 'var(--ispu-very)', hex: '#e5533d',
    advice: 'Risiko kesehatan meningkat untuk semua orang. Hindari aktivitas di luar ruangan.',
    tips: ['Hindari aktivitas di luar ruangan sebisa mungkin.', 'Pakai masker yang rapat (misalnya KN95) bila harus keluar.', 'Segera periksa ke dokter jika sesak napas atau batuk terus-menerus.'] },
  { key: 'hazard', id: 'Berbahaya', en: 'Hazardous', min: 301, max: 500, color: 'var(--ispu-hazard)', hex: '#2d2d2d',
    advice: 'Berbahaya bagi kesehatan. Tetap di dalam ruangan dan ikuti arahan resmi pemerintah.',
    tips: ['Tetap di dalam ruangan dengan jendela dan pintu tertutup.', 'Gunakan penyaring udara bila ada.', 'Ikuti informasi dan arahan resmi dari pemerintah.'] },
];

export function ispuCategory(value) {
  const v = Math.round(value);
  return ISPU_CATEGORIES.find((c) => v <= c.max) || ISPU_CATEGORIES[ISPU_CATEGORIES.length - 1];
}

// Concentration breakpoints (µg/m³, 24-h) mapped to ISPU 0/50/100/200/300/500.
const BREAKPOINTS = {
  pm25: [0, 15.5, 55.4, 150.4, 250.4, 500],
  pm10: [0, 50, 150, 350, 420, 500],
};
const INDEX = [0, 50, 100, 200, 300, 500];

export function subIndex(param, conc) {
  const bp = BREAKPOINTS[param];
  if (!bp) return null;
  for (let i = 1; i < bp.length; i++) {
    if (conc <= bp[i]) {
      return INDEX[i - 1] + ((INDEX[i] - INDEX[i - 1]) * (conc - bp[i - 1])) / (bp[i] - bp[i - 1]);
    }
  }
  return 500;
}

/** Illustrative ISPU = highest sub-index of the particulate parameters. */
export const illustrativeISPU = (pm25, pm10) => Math.round(Math.max(subIndex('pm25', pm25), subIndex('pm10', pm10)));
