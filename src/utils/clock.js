/**
 * SEAIR demo clock.
 *
 * Semua data demo memakai "hari ini" dari sini, bukan langsung dari
 * Date.now(). Tanggalnya dikunci ke DEMO_DATE (WIB), sedangkan jam-nya tetap
 * mengikuti jam asli supaya tampilan waktu masih terasa hidup.
 *
 * Ubah DEMO_DATE untuk mengganti tanggal, atau isi null untuk kembali
 * memakai tanggal asli.
 */
export const DEMO_DATE = '2026-11-11';

const DAY = 864e5;
const WIB = 7 * 3600e3;

export function now() {
  const real = Date.now();
  if (!DEMO_DATE) return real;
  const midnight = new Date(`${DEMO_DATE}T00:00:00+07:00`).getTime();
  if (!Number.isFinite(midnight)) return real;
  const timeOfDay = (((real + WIB) % DAY) + DAY) % DAY; // ms sejak 00.00 WIB
  return midnight + timeOfDay;
}
