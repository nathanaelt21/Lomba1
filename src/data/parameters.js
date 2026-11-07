/**
 * Parameter catalogue for SEAIR.
 *
 * `reference` values are indicative thresholds from Indonesian regulations,
 * included to help users read the charts. They must be re-checked against
 * the official text (PP 22/2021 Annex VII & VIII, PermenLHK P.14/2020)
 * before SEAIR shows real measurements.
 *
 * `simple` is a one-line, everyday-language explanation for non-experts and
 * `better` says which direction is healthier ('low' | 'high' | 'range').
 *
 * `demo` describes how the in-browser DEMO generator shapes each series.
 * It has no scientific meaning and is replaced by API data later.
 */

export const AIR_PARAMETERS = [
  {
    key: 'ispu',
    domain: 'air',
    name: 'ISPU / AQI',
    full: 'Indeks Standar Pencemar Udara',
    unit: 'indeks',
    decimals: 0,
    icon: 'gauge',
    better: 'low',
    simple: 'Rapor kualitas udara dalam satu angka. Makin kecil makin bersih.',
    what: 'Indeks kualitas udara resmi Indonesia. Kadar beberapa polutan diubah menjadi satu angka 0–500 dengan lima kategori berwarna.',
    source: 'Dihitung dari polutan yang diukur. Sub-indeks yang paling tinggi menjadi nilai ISPU.',
    why: 'Memberi jawaban cepat yang mudah dipahami semua orang untuk pertanyaan "udaranya aman nggak hari ini?".',
    reference: { type: 'max', value: 100, label: 'Batas atas kategori "Sedang"', citation: 'PermenLHK P.14/2020' },
  },
  {
    key: 'pm25',
    domain: 'air',
    name: 'PM2.5',
    full: 'Partikel debu halus (≤2,5 mikrometer)',
    unit: 'µg/m³',
    decimals: 1,
    icon: 'dust',
    better: 'low',
    simple: 'Debu super halus yang bisa masuk ke paru-paru. Makin kecil makin baik.',
    what: 'Partikel sangat kecil, kira-kira 30 kali lebih tipis dari rambut. Saking kecilnya, partikel ini bisa masuk jauh ke paru-paru bahkan ke aliran darah.',
    source: 'Asap kendaraan, industri, pembangkit listrik, pembakaran sampah terbuka, dan reaksi gas-gas di udara.',
    why: 'Polutan ini erat kaitannya dengan penyakit pernapasan dan jantung. Partikelnya juga bisa jatuh dan mengendap di permukaan laut.',
    reference: { type: 'max', value: 55, label: 'Baku mutu udara ambien 24 jam', citation: 'PP 22/2021 Lampiran VII' },
    demo: { base: 38, min: 4, max: 190, season: -0.32, weekly: 0.08, noise: 0.28 },
  },
  {
    key: 'pm10',
    domain: 'air',
    name: 'PM10',
    full: 'Partikel debu kasar (≤10 mikrometer)',
    unit: 'µg/m³',
    decimals: 1,
    icon: 'dust',
    better: 'low',
    simple: 'Debu kasar seperti debu jalan dan jelaga. Makin kecil makin baik.',
    what: 'Partikel yang lebih besar di udara, seperti debu jalan, jelaga, dan butiran garam laut.',
    source: 'Debu jalan, proyek konstruksi, industri, pembakaran, dan percikan air laut.',
    why: 'Mengiritasi saluran napas dan bisa membawa logam serta zat lain yang kemudian mengendap di darat dan air.',
    reference: { type: 'max', value: 75, label: 'Baku mutu udara ambien 24 jam', citation: 'PP 22/2021 Lampiran VII' },
    demo: { base: 62, min: 8, max: 260, season: -0.28, weekly: 0.1, noise: 0.25 },
  },
  {
    key: 'so2',
    domain: 'air',
    name: 'SO₂',
    full: 'Sulfur dioksida',
    unit: 'µg/m³',
    decimals: 1,
    icon: 'factory',
    better: 'low',
    simple: 'Gas dari pembakaran batu bara dan solar. Makin kecil makin baik.',
    what: 'Gas berbau tajam yang muncul saat bahan bakar yang mengandung belerang dibakar.',
    source: 'Pembakaran batu bara dan minyak, bahan bakar kapal, serta proses industri.',
    why: 'Membentuk partikel sulfat dan hujan asam, yang bisa menurunkan pH air hujan yang jatuh ke perairan pesisir.',
    reference: { type: 'max', value: 75, label: 'Baku mutu udara ambien 24 jam', citation: 'PP 22/2021 Lampiran VII' },
    demo: { base: 28, min: 2, max: 140, season: -0.12, weekly: 0.12, noise: 0.3 },
  },
  {
    key: 'co',
    domain: 'air',
    name: 'CO',
    full: 'Karbon monoksida',
    unit: 'µg/m³',
    decimals: 0,
    icon: 'car',
    better: 'low',
    simple: 'Gas tak berbau dari knalpot kendaraan. Makin kecil makin baik.',
    what: 'Gas tanpa warna dan tanpa bau yang berasal dari pembakaran yang tidak sempurna.',
    source: 'Terutama dari lalu lintas kendaraan, ditambah genset dan pembakaran.',
    why: 'Mengurangi kemampuan darah membawa oksigen. Gas ini juga menjadi penanda yang baik untuk polusi dari kendaraan.',
    reference: { type: 'max', value: 4000, label: 'Baku mutu udara ambien 8 jam', citation: 'PP 22/2021 Lampiran VII' },
    demo: { base: 950, min: 150, max: 4200, season: -0.1, weekly: 0.18, noise: 0.25 },
  },
  {
    key: 'o3',
    domain: 'air',
    name: 'O₃',
    full: 'Ozon permukaan (di dekat tanah)',
    unit: 'µg/m³',
    decimals: 1,
    icon: 'sun',
    better: 'low',
    simple: 'Polutan yang terbentuk saat siang terik. Makin kecil makin baik.',
    what: 'Polutan yang tidak dibuang langsung, melainkan terbentuk saat sinar matahari bereaksi dengan NOx dan uap senyawa organik.',
    source: 'Reaksi kimia oleh sinar matahari pada emisi kendaraan dan industri, terutama saat cuaca cerah.',
    why: 'Mengiritasi paru-paru dan merusak tanaman. Kadarnya biasanya paling tinggi sekitar tengah hari.',
    reference: { type: 'max', value: 100, label: 'Baku mutu udara ambien 8 jam', citation: 'PP 22/2021 Lampiran VII' },
    demo: { base: 58, min: 5, max: 190, season: -0.15, weekly: -0.05, noise: 0.3 },
  },
  {
    key: 'no2',
    domain: 'air',
    name: 'NO₂',
    full: 'Nitrogen dioksida',
    unit: 'µg/m³',
    decimals: 1,
    icon: 'car',
    better: 'low',
    simple: 'Gas dari mesin kendaraan dan kapal. Makin kecil makin baik.',
    what: 'Gas berwarna cokelat kemerahan yang terbentuk dari pembakaran bersuhu tinggi.',
    source: 'Kendaraan, kapal, pembangkit listrik, dan industri.',
    why: 'Ikut membentuk ozon dan partikel. Nitrogen yang jatuh dari udara bisa menambah "pupuk" berlebih di perairan pesisir.',
    reference: { type: 'max', value: 65, label: 'Baku mutu udara ambien 24 jam', citation: 'PP 22/2021 Lampiran VII' },
    demo: { base: 34, min: 4, max: 160, season: -0.1, weekly: 0.2, noise: 0.28 },
  },
];

export const OCEAN_PARAMETERS = [
  {
    key: 'ph',
    domain: 'ocean',
    name: 'pH',
    full: 'Tingkat keasaman / kebasaan',
    unit: 'pH',
    decimals: 2,
    icon: 'drop',
    anchor: 'coral',
    better: 'range',
    simple: 'Seberapa asam air laut. Idealnya sedikit basa, sekitar 8.',
    what: 'Menunjukkan seberapa asam atau basa air laut. Air laut yang sehat sedikit basa, sekitar 8,0–8,2.',
    source: 'Dipengaruhi oleh CO₂ yang diserap dari udara, aliran sungai, aktivitas makhluk hidup, dan pencemaran.',
    why: 'pH yang lebih rendah (lebih asam) menyulitkan karang dan kerang membangun kerangka serta cangkangnya.',
    reference: { type: 'range', min: 7, max: 8.5, label: 'Rentang untuk biota laut', citation: 'PP 22/2021 Lampiran VIII' },
    demo: { base: 8.1, spread: -0.35, min: 7.2, max: 8.4, season: -0.02, noise: 0.005, absolute: true },
  },
  {
    key: 'do',
    domain: 'ocean',
    name: 'Oksigen Terlarut',
    short: 'DO',
    full: 'Dissolved oxygen (DO)',
    unit: 'mg/L',
    decimals: 1,
    icon: 'bubble',
    anchor: 'fish',
    better: 'high',
    simple: 'Oksigen di dalam air untuk napas ikan. Makin tinggi makin baik.',
    what: 'Oksigen yang larut di dalam air laut, yang dihirup ikan dan makhluk laut lainnya.',
    source: 'Masuk dari udara di permukaan laut dan dari fotosintesis. Pembusukan bahan organik justru menghabiskannya.',
    why: 'Oksigen yang rendah (hipoksia) membuat ikan stres atau mati, bahkan bisa memicu kematian ikan massal.',
    reference: { type: 'min', value: 5, label: 'Batas minimum untuk biota laut', citation: 'PP 22/2021 Lampiran VIII' },
    demo: { base: 5.9, spread: -2.1, min: 1.5, max: 8.5, season: -0.06, noise: 0.08 },
  },
  {
    key: 'tss',
    domain: 'ocean',
    name: 'Padatan Tersuspensi',
    short: 'TSS',
    full: 'Total suspended solids (TSS) — tingkat kekeruhan',
    unit: 'mg/L',
    decimals: 1,
    icon: 'murk',
    anchor: 'seabed',
    better: 'low',
    simple: 'Seberapa keruh air laut. Makin kecil makin jernih.',
    what: 'Partikel halus lumpur, sisa bahan organik, dan plankton yang melayang di air. Singkatnya, tingkat kekeruhan air.',
    source: 'Lumpur bawaan sungai, abrasi pantai, pengerukan, endapan dasar yang teraduk, dan partikel yang jatuh dari udara.',
    why: 'Air keruh menghalangi sinar matahari yang dibutuhkan lamun dan karang, dan partikelnya bisa menutupi terumbu.',
    reference: { type: 'max', value: 20, label: 'Untuk karang & lamun (mangrove: 80)', citation: 'PP 22/2021 Lampiran VIII' },
    demo: { base: 6, spread: 36, min: 2, max: 140, season: 0.38, noise: 0.25 },
  },
  {
    key: 'salinity',
    domain: 'ocean',
    name: 'Salinitas',
    full: 'Kadar garam air laut',
    unit: '‰',
    decimals: 1,
    icon: 'salt',
    anchor: 'water',
    better: 'range',
    simple: 'Seberapa asin air laut. Turun drastis di dekat muara sungai.',
    what: 'Seberapa banyak garam yang larut di air, diukur dalam per seribu (‰ ≈ PSU).',
    source: 'Air tawar dari sungai dan hujan menurunkannya, sedangkan penguapan menaikkannya.',
    why: 'Penurunan mendadak di dekat muara membuat karang dan lamun stres, sekaligus menunjukkan sampai mana air dari daratan masuk ke laut.',
    reference: { type: 'range', min: 33, max: 34, label: 'Rentang alami untuk karang & lamun', citation: 'PP 22/2021 Lampiran VIII' },
    demo: { base: 33.2, spread: -5, min: 18, max: 35, season: -0.05, noise: 0.01, absolute: true },
  },
  {
    key: 'chla',
    domain: 'ocean',
    name: 'Klorofil-a',
    short: 'Chl-a',
    full: 'Zat hijau pada fitoplankton',
    unit: 'µg/L',
    decimals: 1,
    icon: 'plankton',
    anchor: 'plankton',
    better: 'low',
    simple: 'Banyaknya alga mikro di air. Terlalu tinggi tandanya air "kebanyakan pupuk".',
    what: 'Pigmen hijau pada fitoplankton, yaitu alga mikroskopis yang menjadi dasar rantai makanan di laut.',
    source: 'Pertumbuhan fitoplankton yang dipicu nutrien ("pupuk") dari sungai, limbah, dan endapan dari udara.',
    why: 'Nilai yang sangat tinggi menandakan eutrofikasi dan kemungkinan ledakan alga, yang nantinya bisa menghabiskan oksigen.',
    reference: { type: 'note', label: 'Belum ada baku mutu nasional; baca sesuai konteks setempat', citation: '—' },
    demo: { base: 0.6, spread: 18, min: 0.2, max: 60, season: 0.3, noise: 0.3 },
  },
  {
    key: 'temp',
    domain: 'ocean',
    name: 'Suhu Air',
    short: 'Suhu',
    full: 'Suhu permukaan laut',
    unit: '°C',
    decimals: 1,
    icon: 'thermo',
    anchor: 'sun',
    better: 'range',
    simple: 'Seberapa hangat permukaan laut. Terlalu panas bisa membuat karang memutih.',
    what: 'Suhu lapisan atas air laut.',
    source: 'Panas matahari, angin muson, arus laut, dan perubahan iklim jangka panjang.',
    why: 'Panas di atas normal yang berlangsung lama bisa membuat karang memutih (bleaching) dan ikan berpindah tempat.',
    reference: { type: 'range', min: 28, max: 30, label: 'Rentang alami untuk karang', citation: 'PP 22/2021 Lampiran VIII' },
    demo: { base: 29.3, spread: 0.6, min: 26.5, max: 32.5, season: 0.015, noise: 0.006, absolute: true },
  },
];

export const ALL_PARAMETERS = [...AIR_PARAMETERS, ...OCEAN_PARAMETERS];
export const getParameter = (key) => ALL_PARAMETERS.find((p) => p.key === key);
export const parametersFor = (domain) => (domain === 'air' ? AIR_PARAMETERS : OCEAN_PARAMETERS);

/** Evaluate a value against its reference: 'good' | 'watch' | 'poor' | 'none'. */
export function assessValue(param, value) {
  const ref = param?.reference;
  if (!ref || value == null || !Number.isFinite(value)) return 'none';
  if (param.key === 'ispu') return value <= 50 ? 'good' : value <= 100 ? 'watch' : 'poor';
  if (ref.type === 'max') return value <= ref.value * 0.8 ? 'good' : value <= ref.value ? 'watch' : 'poor';
  if (ref.type === 'min') return value >= ref.value * 1.15 ? 'good' : value >= ref.value ? 'watch' : 'poor';
  if (ref.type === 'range') {
    if (value >= ref.min && value <= ref.max) return 'good';
    const span = ref.max - ref.min || 1;
    const dist = value < ref.min ? ref.min - value : value - ref.max;
    return dist <= span * 0.5 ? 'watch' : 'poor';
  }
  return 'none';
}

export const STATUS_LABEL = { good: 'Sesuai acuan', watch: 'Mendekati batas', poor: 'Melewati acuan', none: 'Tanpa acuan' };

/** Short human-readable reference text, e.g. "≤ 55 µg/m³" or "7–8,5 pH". */
export function referenceText(param, withUnit = true) {
  const r = param.reference;
  const u = withUnit ? ` ${param.unit}` : '';
  const n = (v) => Number(v).toLocaleString('id-ID');
  if (r.type === 'max') return `≤ ${n(r.value)}${u}`;
  if (r.type === 'min') return `≥ ${n(r.value)}${u}`;
  if (r.type === 'range') return `${n(r.min)}–${n(r.max)}${u}`;
  return '—';
}

/**
 * Plain-language reading of one value, for people who don't know the
 * thresholds: { tone, headline, text }.
 */
export function explainValue(param, value) {
  if (!param || value == null || !Number.isFinite(value)) return null;
  const status = assessValue(param, value);
  const ref = param.reference;
  const unit = param.unit === 'indeks' ? '' : ` ${param.unit}`;
  const refStr =
    ref.type === 'max' || ref.type === 'min' ? `${Number(ref.value).toLocaleString('id-ID')}${unit}` : ref.type === 'range' ? referenceText(param) : null;
  if (status === 'none') {
    return {
      tone: 'none',
      headline: 'Belum ada batas resmi',
      text: `${param.name} belum punya baku mutu nasional, jadi bandingkan dengan lokasi lain dan perhatikan perubahannya dari waktu ke waktu. ${param.simple}`,
    };
  }
  const headline = { good: 'Kondisi aman', watch: 'Perlu diwaspadai', poor: 'Kurang baik' }[status];
  let text;
  if (ref.type === 'max') {
    text =
      status === 'poor'
        ? `Nilainya melewati batas acuan (${refStr}). Semakin tinggi angkanya, semakin buruk kondisinya.`
        : status === 'watch'
          ? `Masih di bawah batas acuan (${refStr}), tetapi sudah cukup dekat. Semakin tinggi angkanya, semakin buruk.`
          : `Jauh di bawah batas acuan (${refStr}). Semakin rendah angkanya, semakin baik.`;
  } else if (ref.type === 'min') {
    text =
      status === 'poor'
        ? `Di bawah batas minimum (${refStr}). Untuk parameter ini, angka yang lebih tinggi justru lebih baik.`
        : status === 'watch'
          ? `Sedikit di atas batas minimum (${refStr}). Angka yang lebih tinggi lebih baik.`
          : `Di atas batas minimum (${refStr}) dengan selisih yang aman.`;
  } else {
    text =
      status === 'good'
        ? `Berada di dalam rentang normal (${refStr}).`
        : `Berada di luar rentang normal (${refStr}), ${value < ref.min ? 'lebih rendah' : 'lebih tinggi'} dari seharusnya.`;
  }
  return { tone: status, headline, text };
}

/** "naik / turun / stabil" description of a % change between two values. */
export function describeTrend(param, change) {
  if (!Number.isFinite(change)) return null;
  const a = Math.abs(change);
  if (a < 5) return { dir: 'flat', text: 'relatif stabil' };
  const up = change > 0;
  let good = null;
  if (param.better === 'low') good = !up;
  else if (param.better === 'high') good = up;
  const word = up ? 'naik' : 'turun';
  const size = a < 15 ? 'sedikit ' : a > 40 ? 'cukup tajam ' : '';
  return {
    dir: up ? 'up' : 'down',
    good,
    text: `${size}${word} ${Math.round(a)}%${good === true ? ' (membaik)' : good === false ? ' (memburuk)' : ''}`,
  };
}
