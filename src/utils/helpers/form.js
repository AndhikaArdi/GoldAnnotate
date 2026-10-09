// Aturan input form landing. Dipakai di LandingPage (dan bisa dipakai ulang di langkah lain).

export const normalizeEmail = (value) => value.trim().toLowerCase();

// teks@teks.teks, tanpa spasi di mana pun dan hanya satu "@".
export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// "  muhamad   bastanta " -> "Muhamad Bastanta". Kapital di awal kata dan setelah "-".
// Tanda petik tidak memicu kapital, jadi "ma'ruf" tetap "Ma'ruf".
export const formatName = (value) =>
  value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(
      /(^|[\s-])(\p{L})/gu,
      (_, separator, letter) => separator + letter.toUpperCase(),
    );

// Urutan sesuai posisi di halaman: dipakai untuk menentukan field pertama yang bermasalah.
export const FIELD_ORDER = ["email", "nama", "group"];

// Mengembalikan objek pesan error, misalnya { email: "...", group: "..." }.
// Objek kosong berarti semua valid.
export const validateLanding = (form) => {
  const errors = {};

  const email = normalizeEmail(form.email);
  if (!email) errors.email = "Email wajib diisi";
  else if (!isValidEmail(email)) errors.email = "Format email tidak valid";

  if (!formatName(form.nama)) errors.nama = "Nama wajib diisi";
  if (!form.group) errors.group = "Group wajib diisi";

  return errors;
};
