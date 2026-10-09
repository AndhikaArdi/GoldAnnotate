import Button from "@components/Button";
import { HelperText } from "@components/Typography";

// Kotak abu-abu berdenyut sebagai pengganti konten yang sedang dimuat.
export const SkeletonBlock = ({ className = "" }) => {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
};

// Pesan gagal memuat + tombol coba lagi. Bungkus dengan <Card> bila dipakai berdiri sendiri.
export const QueryError = ({ message, onRetry }) => {
  return (
    <div className="px-5 py-4 text-center">
      <p className="font-semibold">Gagal memuat data</p>
      <HelperText tone="danger" role="alert" className="mt-1">
        {message || "Terjadi kesalahan. Silakan coba lagi."}
      </HelperText>
      {onRetry && (
        <div className="mt-3">
          <Button variant="outline" size="sm" onClick={onRetry}>
            Coba Lagi
          </Button>
        </div>
      )}
    </div>
  );
};
