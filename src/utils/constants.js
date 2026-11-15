export const COLORS = {
  night: '#232F5B',
  nightDark: '#171F40',
  gold: '#E0A93B',
  bg: '#F1F2F7',
  ink: '#1A1F36',
  muted: '#6B7090',
  line: '#D9DCE9',
  white: '#FFFFFF',
  done: '#E3F1EA',
  green: '#2E7D5B',
  soft: '#E6E9F5',
};

// Daftar ibadah harian Ramadhan, dikelompokkan
export const GROUPS = [
  {
    title: 'Puasa',
    items: [
      { id: 'sahur', label: 'Sahur', detail: 'Makan sahur sebelum imsak' },
      { id: 'puasa', label: 'Puasa hari ini', detail: 'Menahan diri sampai Maghrib' },
    ],
  },
  {
    title: 'Sholat',
    items: [
      { id: 'subuh', label: 'Subuh' },
      { id: 'dzuhur', label: 'Dzuhur' },
      { id: 'ashar', label: 'Ashar' },
      { id: 'maghrib', label: 'Maghrib' },
      { id: 'isya', label: 'Isya' },
      { id: 'tarawih', label: 'Tarawih & witir', detail: 'Setelah Isya' },
    ],
  },
  {
    title: 'Amalan',
    items: [
      { id: 'dzikir', label: 'Dzikir & doa' },
      { id: 'sedekah', label: 'Sedekah / infak' },
    ],
  },
];

export const ALL_ITEMS = GROUPS.flatMap((g) => g.items);

// anchor: 'imsak' | 'maghrib' = mengikuti jadwal API (+ offset menit); 'fixed' = jam tetap
export const DEFAULT_REMINDERS = [
  { id: 'r1', label: 'Waktunya sahur', message: 'Bangun dan makan sahur, jangan lupa niat puasa.', anchor: 'imsak', offset: -60, time: '03:30', enabled: true },
  { id: 'r2', label: 'Imsak hampir tiba', message: 'Segera akhiri sahur dan bersiap sholat Subuh.', anchor: 'imsak', offset: -5, time: '04:25', enabled: true },
  { id: 'r3', label: 'Waktu berbuka', message: 'Berbuka dengan yang manis, lalu sholat Maghrib.', anchor: 'maghrib', offset: 0, time: '18:10', enabled: true },
  { id: 'r4', label: 'Sholat tarawih', message: 'Yuk berangkat tarawih berjamaah.', anchor: 'maghrib', offset: 70, time: '19:20', enabled: true },
  { id: 'r5', label: 'Tilawah harian', message: "Sudahkah membaca Al-Qur'an hari ini?", anchor: 'fixed', offset: 0, time: '20:30', enabled: false },
];

export const CITIES = [
  'Sukabumi', 'Jakarta', 'Bandung', 'Bogor', 'Cianjur', 'Semarang',
  'Yogyakarta', 'Surabaya', 'Medan', 'Makassar',
];

export const MOTIVASI = [
  'Mulai hari ini dengan niat yang lurus, sisanya Allah mudahkan.',
  'Satu halaman Al-Qur\'an hari ini lebih baik daripada rencana khatam yang belum dimulai.',
  'Sabar menahan lapar melatih sabar menahan emosi.',
  'Sedekah kecil yang rutin lebih berarti daripada besar tapi sekali.',
  'Tidak perlu sempurna, yang penting terus bergerak.',
  'Manfaatkan waktu menjelang berbuka untuk berdoa.',
  'Tiga puluh hari adalah latihan, bukan lomba.',
  'Tidur yang teratur membuat sahur dan tahajud terasa ringan.',
  'Ajak keluarga atau teman berbuka bersama, berbagi membuat Ramadhan lebih hangat.',
  'Evaluasi sebentar tiap malam: satu amalan apa yang bisa ditingkatkan besok?',
];

// Perkiraan 1 Ramadhan 1448 H. Bisa diubah di halaman Rekap sesuai keputusan Kemenag.
export const DEFAULT_START = '2027-02-08';
export const KHATAM_PAGES = 604;
export const DAILY_TARGET = 20;

// ---------- helper tanggal ----------
const pad = (n) => String(n).padStart(2, '0');
export const dateKey = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseKey = (k) => {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
};
export const addDays = (k, n) => {
  const d = parseKey(k);
  d.setDate(d.getDate() + n);
  return dateKey(d);
};
export const diffDays = (a, b) => Math.round((parseKey(a) - parseKey(b)) / 86400000);
export const formatLong = (k) =>
  parseKey(k).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

// ---------- helper waktu ----------
export const shiftTime = (time, minutes) => {
  const [h, m] = time.split(':').map(Number);
  const total = (((h * 60 + m + minutes) % 1440) + 1440) % 1440;
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
};

// Jam efektif pengingat: mengikuti jadwal API bila tersedia, kalau tidak pakai jam cadangan
export const effectiveTime = (r, times) => {
  if (times && r.anchor === 'imsak') return shiftTime(times.Imsak, r.offset);
  if (times && r.anchor === 'maghrib') return shiftTime(times.Maghrib, r.offset);
  return r.time;
};

// ---------- konten default (bisa diubah admin) ----------
export const DEFAULT_DOA = [
  {
    key: 'niat',
    title: 'Niat puasa',
    arab: 'نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى',
    arti: "Aku berniat puasa esok hari untuk menunaikan fardhu bulan Ramadhan tahun ini karena Allah Ta'ala.",
  },
  {
    key: 'buka',
    title: 'Doa berbuka',
    arab: 'اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
    arti: 'Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka.',
  },
  {
    key: 'qadar',
    title: 'Lailatul Qadar',
    arab: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    arti: 'Ya Allah, sesungguhnya Engkau Maha Pemaaf dan menyukai maaf, maka maafkanlah aku.',
  },
];

export const DEFAULT_CONTENT = {
  startDate: DEFAULT_START,
  announcement: '',
  motivasi: MOTIVASI,
  doa: DEFAULT_DOA,
};

export const formatDateTime = (ts) =>
  ts
    ? new Date(ts).toLocaleString('id-ID', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
      })
    : 'Belum pernah';
