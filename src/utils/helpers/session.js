const KEY = "goldset-session";
const listeners = new Set();

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : null;
    // Abaikan data rusak atau tidak lengkap.
    return data && data.email && data.nama && data.groupId ? data : null;
  } catch {
    return null;
  }
};

// Salinan di memori. Harus objek yang sama selama sesi tidak berubah,
// karena useSyncExternalStore membandingkannya dengan ===.
let current = read();

const emit = () => listeners.forEach((listener) => listener());

export const getSession = () => current;

export const setSession = (session) => {
  current = session;
  try {
    if (session) localStorage.setItem(KEY, JSON.stringify(session));
    else localStorage.removeItem(KEY);
  } catch {
    // Penyimpanan penuh atau dimatikan: sesi tetap hidup di memori sampai refresh.
  }
  emit();
};

export const subscribeSession = (listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

// Sinkron antar tab: bila tab lain mengubah atau menghapus sesi.
window.addEventListener("storage", (event) => {
  if (event.key === KEY || event.key === null) {
    current = read();
    emit();
  }
});
