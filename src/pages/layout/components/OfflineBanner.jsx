import useOnlineStatus from "@hooks/useOnlineStatus";

// Tampil menempel di atas halaman saat perangkat offline.
const OfflineBanner = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      role="alert"
      className="sticky top-0 z-40 bg-danger px-3 py-2 text-center text-xs text-white"
    >
      Tidak ada koneksi internet. Perubahan akan disimpan otomatis saat
      tersambung kembali.
    </div>
  );
};

export default OfflineBanner;