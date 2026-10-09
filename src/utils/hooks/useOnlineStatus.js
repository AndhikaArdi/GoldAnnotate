import { useSyncExternalStore } from "react";

const subscribe = (callback) => {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
};

// true bila browser menganggap perangkat sedang online.
// Catatan: ini hanya mendeteksi "tidak ada jaringan sama sekali" (mode pesawat, Wi-Fi mati),
// bukan server yang tidak bisa dijangkau. Untuk itu sudah ada pesan gagal + Coba Lagi.
const useOnlineStatus = () =>
  useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );

export default useOnlineStatus;