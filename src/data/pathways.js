/**
 * Air → ocean pathways shown in the "Where Air Meets the Ocean" diagram.
 * Text describes mechanisms documented in environmental science, without
 * claiming how large each one is in Teluk Jakarta. That needs measurement.
 */
export const PATHWAYS = [
  {
    key: 'emission',
    title: 'Emission',
    icon: 'factory',
    summary: 'Kendaraan, pelabuhan, pembangkit listrik, dan industri di sepanjang pesisir melepaskan gas dan partikel ke udara.',
    detail:
      'Pembakaran menghasilkan NO₂, SO₂, CO, dan debu partikel (PM2.5, PM10). Sebagian gas kemudian berubah menjadi partikel baru di udara, misalnya sulfat dan nitrat.',
    air: ['pm25', 'pm10', 'so2', 'no2', 'co'],
    ocean: [],
    evidence: 'Sudah terbukti kuat: inventaris emisi dan data pemantauan menghubungkan polutan ini dengan sumber pembakaran.',
  },
  {
    key: 'transport',
    title: 'Carried by wind',
    icon: 'wind',
    summary: 'Angin membawa polutan menjauh dari sumbernya, kadang sampai ke atas laut.',
    detail:
      'Angin darat dan angin laut berganti arah setiap hari, dan angin muson berubah tiap musim. Ke mana polusi akhirnya pergi tergantung kecepatan dan arah angin, yang bisa dilacak dengan data cuaca BMKG.',
    air: ['pm25', 'o3'],
    ocean: [],
    evidence: 'Secara prinsip sudah terbukti. Jalur lokalnya perlu data angin dan pemodelan sebaran polusi.',
  },
  {
    key: 'deposition',
    title: 'Deposition',
    icon: 'rain',
    summary: 'Partikel jatuh sendiri (pengendapan kering) atau terbawa hujan (pengendapan basah) ke permukaan air.',
    detail:
      'Pengendapan dari udara bisa membawa nitrogen, belerang, logam, dan zat lain ke perairan pesisir. Hujan yang menjadi asam karena SO₂ dan NOx adalah salah satu bentuk pengendapan basah.',
    air: ['pm25', 'pm10', 'so2', 'no2'],
    ocean: ['tss', 'ph', 'chla'],
    evidence: 'Tercatat di seluruh dunia sebagai sumber nutrien dan polutan. Seberapa besar porsinya di Teluk Jakarta belum dihitung di sini.',
  },
  {
    key: 'exchange',
    title: 'Air–sea gas exchange',
    icon: 'bubble',
    summary: 'CO₂ dan oksigen berpindah melewati permukaan laut. Laut menyerap CO₂, yang perlahan menurunkan pH.',
    detail:
      'Ombak dan angin mendorong pertukaran gas di permukaan. Oksigen dari udara menambah oksigen terlarut, sedangkan CO₂ yang terserap membentuk asam karbonat sehingga laut perlahan menjadi lebih asam selama puluhan tahun.',
    air: [],
    ocean: ['ph', 'do', 'temp'],
    evidence: 'Sudah terbukti kuat dalam skala global (pengasaman laut). pH setempat juga sangat dipengaruhi sungai dan makhluk hidup.',
  },
  {
    key: 'runoff',
    title: 'Runoff',
    icon: 'river',
    summary: 'Hujan membilas polutan yang mengendap di darat ke sungai, lalu sungai mengalirkannya ke teluk.',
    detail:
      'Teluk Jakarta menerima air dari banyak sungai. Sungai-sungai itu membawa lumpur, nutrien, dan limbah, dan sebagian muatannya awalnya jatuh dari udara ke atap, jalan, dan tanah.',
    air: ['pm10'],
    ocean: ['tss', 'salinity', 'chla'],
    evidence: 'Sungai adalah sumber masukan utama ke teluk. Memisahkan muatan yang berasal dari udara dan dari darat membutuhkan penelitian khusus.',
  },
  {
    key: 'response',
    title: 'Marine impact',
    icon: 'fish',
    summary: 'Nutrien berlebih bisa memicu ledakan alga. Saat alga membusuk, oksigen turun dan karang serta ikan menjadi stres.',
    detail:
      'Klorofil-a yang tinggi menandakan ledakan plankton. Ketika plankton mati dan membusuk, oksigen terlarut berkurang. Air yang keruh (TSS tinggi) menghalangi cahaya untuk lamun dan karang.',
    air: [],
    ocean: ['chla', 'do', 'tss', 'ph'],
    evidence: 'Mekanisme ini sudah banyak dibuktikan. SEAIR menampilkan pola yang terjadi bersamaan, tetapi tidak membuktikan sebab-akibat.',
  },
];
