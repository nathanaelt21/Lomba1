/**
 * Reference data sources for SEAIR. None is connected yet. `status` makes
 * that explicit in the UI, and `url` stays null until an official endpoint
 * or data-sharing agreement is confirmed.
 */
export const DATA_SOURCES = [
  {
    id: 'bmkg',
    name: 'BMKG',
    full: 'Badan Meteorologi, Klimatologi, dan Geofisika',
    covers: ['Cuaca & angin', 'Curah hujan', 'Kualitas udara (pemantauan PM2.5)', 'Meteorologi maritim'],
    domain: 'air',
    status: 'planned',
    url: 'https://www.bmkg.go.id',
  },
  {
    id: 'klh',
    name: 'KLH',
    full: 'Kementerian Lingkungan Hidup',
    covers: ['ISPU nasional', 'Baku mutu udara ambien & air laut', 'Pemantauan lingkungan'],
    domain: 'both',
    status: 'planned',
    url: null,
  },
  {
    id: 'ispu-jakarta',
    name: 'ISPU Jakarta',
    full: 'Indeks kualitas udara — Dinas Lingkungan Hidup Provinsi DKI Jakarta',
    covers: ['Stasiun SPKU DKI1–DKI5', 'PM10, PM2.5, SO₂, CO, O₃, NO₂'],
    domain: 'air',
    status: 'planned',
    url: null,
  },
  {
    id: 'unpad-podc',
    name: 'Unpad PODC',
    full: 'Universitas Padjadjaran — pusat data oseanografi',
    covers: ['Suhu permukaan laut', 'Klorofil-a', 'Warna laut & kualitas air'],
    domain: 'ocean',
    status: 'planned',
    url: null,
  },
];

export const SOURCE_STATUS = {
  planned: 'Rencana integrasi',
  connected: 'Terhubung',
  demo: 'Data demo',
};
