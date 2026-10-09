// Jumlah soal per halaman.
export const PAGE_SIZE = 10;

// String -> angka 32-bit (FNV-1a). Teks yang sama selalu menghasilkan angka yang sama.
const hashString = (text) => {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

// Pengacak angka 0..1 yang bisa diulang (mulberry32): seed sama, urutan angka sama.
const createRandom = (seed) => {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// Fisher-Yates dengan pengacak ber-seed.
const shuffleWithSeed = (items, seedText) => {
  const random = createRandom(hashString(seedText));
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// Perbandingan kode karakter (bukan localeCompare), supaya hasilnya sama di semua browser.
const byReviewId = (a, b) =>
  a.reviewid < b.reviewid ? -1 : a.reviewid > b.reviewid ? 1 : 0;

// Urutkan dulu agar tidak bergantung pada urutan dari server, lalu acak dengan seed.
export const orderQuestions = (questions, seedText) =>
  shuffleWithSeed([...questions].sort(byReviewId), seedText);

export const getTotalPages = (count) => Math.ceil(count / PAGE_SIZE);

// Soal untuk satu halaman (nomor halaman dimulai dari 1).
export const getPageQuestions = (questions, page) =>
  questions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

// Nomor halaman (mulai dari 1) tempat soal dengan indeks tertentu berada.
export const getPageNumber = (index) => Math.floor(index / PAGE_SIZE) + 1;

// Mencari soal yang belum selesai. isDone(soal) harus mengembalikan true/false.
// Hasil: jumlah soal yang belum selesai + nomor halamannya (urut naik, tanpa duplikat).
export const findIncomplete = (questions, isDone) => {
  const pages = new Set();
  let count = 0;

  questions.forEach((question, index) => {
    if (!isDone(question)) {
      count += 1;
      pages.add(getPageNumber(index));
    }
  });

  return { count, pages: [...pages].sort((a, b) => a - b) };
};