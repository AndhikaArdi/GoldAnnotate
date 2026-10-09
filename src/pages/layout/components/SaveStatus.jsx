import Button from "./Button";

// Status simpan otomatis.
// pending = jumlah soal yang sedang/menunggu disimpan, failed = jumlah yang gagal.
const SaveStatus = ({ pending, failed, onRetry }) => {
  if (failed > 0) {
    return (
      <div
        role="alert"
        className="flex items-center justify-end gap-2 text-xs text-danger"
      >
        <span>{failed} jawaban belum tersimpan.</span>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Coba Simpan Lagi
        </Button>
      </div>
    );
  }

  return (
    <p role="status" className="text-right text-xs text-gray-500">
      {pending > 0 ? "Menyimpan…" : "Jawaban Anda tersimpan otomatis"}
    </p>
  );
};

export default SaveStatus;