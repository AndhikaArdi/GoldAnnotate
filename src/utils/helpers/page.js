// Mengubah parameter URL (string) menjadi nomor halaman yang valid.
// Mengembalikan null jika bukan angka bulat atau di luar rentang 1..total.
export const parsePageParam = (value, total) => {
  if (!/^\d+$/.test(value ?? "")) return null;
  const page = Number(value);
  return page >= 1 && page <= total ? page : null;
};
