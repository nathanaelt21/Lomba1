/**
 * Monitoring locations for the Teluk Jakarta prototype.
 *
 * Coordinates are APPROXIMATE and used for demonstration only. The air
 * station names follow the publicly known SPKU (DKI1–DKI5) sites, but
 * every value SEAIR shows for them is DEMO data, not their measurements.
 * `pressure` (0–1) only shapes the demo generator (how urban/inner-bay
 * the site is). It is not a measured quantity.
 */
export const STATIONS = [
  // --- Air ------------------------------------------------------------
  { id: 'dki1', domain: 'air', name: 'Bundaran HI', area: 'Jakarta Pusat', lat: -6.195, lng: 106.823,
    kind: 'Tepi jalan perkotaan', pressure: 0.75, reference: 'Nama lokasi SPKU DKI1 (nilai demo)' },
  { id: 'dki2', domain: 'air', name: 'Kelapa Gading', area: 'Jakarta Utara', lat: -6.154, lng: 106.91,
    kind: 'Permukiman perkotaan', pressure: 0.65, reference: 'Nama lokasi SPKU DKI2 (nilai demo)' },
  { id: 'dki3', domain: 'air', name: 'Jagakarsa', area: 'Jakarta Selatan', lat: -6.357, lng: 106.803,
    kind: 'Pinggiran kota yang hijau', pressure: 0.4, reference: 'Nama lokasi SPKU DKI3 (nilai demo)' },
  { id: 'dki4', domain: 'air', name: 'Lubang Buaya', area: 'Jakarta Timur', lat: -6.289, lng: 106.902,
    kind: 'Permukiman perkotaan', pressure: 0.6, reference: 'Nama lokasi SPKU DKI4 (nilai demo)' },
  { id: 'dki5', domain: 'air', name: 'Kebon Jeruk', area: 'Jakarta Barat', lat: -6.207, lng: 106.753,
    kind: 'Permukiman perkotaan', pressure: 0.55, reference: 'Nama lokasi SPKU DKI5 (nilai demo)' },
  { id: 'priok-air', domain: 'air', name: 'Tanjung Priok', area: 'Kawasan pelabuhan, Jakarta Utara', lat: -6.11, lng: 106.88,
    kind: 'Pesisir / pelabuhan', pressure: 0.9, reference: 'Lokasi pesisir ilustrasi (demo)' },
  { id: 'muara-air', domain: 'air', name: 'Muara Angke', area: 'Pesisir, Jakarta Utara', lat: -6.108, lng: 106.772,
    kind: 'Pesisir / pelabuhan ikan', pressure: 0.7, reference: 'Lokasi pesisir ilustrasi (demo)' },

  // --- Ocean ----------------------------------------------------------
  { id: 'angke-sea', domain: 'ocean', name: 'Muara Angke (estuari)', short: 'Muara Angke', area: 'Teluk Jakarta bagian dalam', lat: -6.088, lng: 106.765,
    kind: 'Muara sungai', pressure: 0.95, reference: 'Titik sampel ilustrasi (demo)' },
  { id: 'ancol-sea', domain: 'ocean', name: 'Pantai Ancol', short: 'Ancol', area: 'Teluk Jakarta bagian dalam', lat: -6.103, lng: 106.842,
    kind: 'Pantai wisata', pressure: 0.8, reference: 'Titik sampel ilustrasi (demo)' },
  { id: 'priok-sea', domain: 'ocean', name: 'Perairan Luar Tanjung Priok', short: 'Tanjung Priok', area: 'Teluk Jakarta bagian dalam', lat: -6.082, lng: 106.889,
    kind: 'Perairan pelabuhan', pressure: 0.85, reference: 'Titik sampel ilustrasi (demo)' },
  { id: 'marunda-sea', domain: 'ocean', name: 'Marunda – Cilincing', short: 'Marunda', area: 'Teluk Jakarta bagian timur', lat: -6.078, lng: 106.955,
    kind: 'Pesisir industri', pressure: 0.8, reference: 'Titik sampel ilustrasi (demo)' },
  { id: 'midbay-sea', domain: 'ocean', name: 'Tengah Teluk', short: 'Tengah Teluk', area: 'Teluk Jakarta bagian tengah', lat: -6.0, lng: 106.85,
    kind: 'Teluk terbuka', pressure: 0.5, reference: 'Titik sampel ilustrasi (demo)' },
  { id: 'untung-sea', domain: 'ocean', name: 'Pulau Untung Jawa', area: 'Kepulauan Seribu (selatan)', lat: -5.977, lng: 106.705,
    kind: 'Terumbu pulau', pressure: 0.35, reference: 'Titik sampel ilustrasi (demo)' },
  { id: 'pari-sea', domain: 'ocean', name: 'Pulau Pari', area: 'Kepulauan Seribu', lat: -5.86, lng: 106.615,
    kind: 'Terumbu pulau', pressure: 0.12, reference: 'Titik sampel ilustrasi (demo)' },
];

export const stationsFor = (domain) => STATIONS.filter((s) => s.domain === domain);
export const getStation = (id) => STATIONS.find((s) => s.id === id);

export const MAP_VIEWS = {
  bay: { center: [-6.05, 106.83], zoom: 11, label: 'Teluk Jakarta' },
  region: { center: [-6.05, 106.78], zoom: 10, label: 'Jakarta & Kepulauan Seribu' },
  indonesia: { center: [-2.4, 118], zoom: 5, label: 'Indonesia' },
};
