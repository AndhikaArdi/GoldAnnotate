import { useQueryClient } from "@tanstack/react-query";
import { getAnswers, deleteSubmission } from "@apis";
import { queryKeys } from "@hooks/queryKeys";
import { confirmDialog, toastError } from "@helpers/notify";

// Dipakai saat annotator yang sama memilih group berbeda dari sesi yang sedang berjalan.
// Hasil fungsi yang dikembalikan:
//   "ok"     : submission lama sudah dibereskan, boleh membuat submission baru
//   "cancel" : pengguna membatalkan, tidak ada yang diubah
//   "error"  : gagal menghapus submission lama, tidak ada yang diubah
const useSwitchGroup = (annotation) => {
  const queryClient = useQueryClient();

  return async (session, newGroupLabel) => {
    const { submissionId, groupLabel } = session;

    // 1. Hitung jawaban yang sudah tersimpan di server. null = tidak bisa diketahui.
    let savedCount = null;
    try {
      const answers = await queryClient.fetchQuery({
        queryKey: queryKeys.answers(submissionId),
        queryFn: ({ signal }) => getAnswers(submissionId, { signal }),
        staleTime: 0,
        retry: false,
      });
      savedCount = answers.length;
    } catch (error) {
      if (error.status === 404) savedCount = 0; // submission lama sudah tidak ada
    }

    // Jawaban yang masih menunggu atau gagal disimpan juga akan hilang.
    const hasUnsaved = annotation.save.pending + annotation.save.failed > 0;
    const hasAnswers = savedCount === null || savedCount > 0 || hasUnsaved;

    // 2. Minta konfirmasi bila ada yang akan hilang.
    if (hasAnswers) {
      const filled =
        savedCount > 0
          ? `Anda sudah mengisi ${savedCount} soal di ${groupLabel}.`
          : `Anda memiliki jawaban di ${groupLabel}.`;

      const confirmed = await confirmDialog({
        title: `Pindah ke ${newGroupLabel}?`,
        text: `${filled} Jika pindah, semua jawaban itu akan dihapus dan tidak bisa dikembalikan.`,
        confirmText: "Ya, pindah dan hapus",
        cancelText: "Tetap di group lama",
        variant: "danger",
        icon: "warning",
      });
      if (!confirmed) return "cancel";
    }

    // 3. Hapus submission lama. 404 (sudah tidak ada) dan 409 (sudah selesai) tidak menghalangi.
    try {
      await deleteSubmission(submissionId);
    } catch (error) {
      if (error.status !== 404 && error.status !== 409) {
        toastError(`Gagal menghapus jawaban lama: ${error.message}`, {
          id: "switch-error",
        });
        return "error";
      }
    }

    // 4. Buang sisa milik submission lama: antrean simpan dan cache jawaban.
    annotation.save.discard(submissionId);
    queryClient.removeQueries({ queryKey: queryKeys.answers(submissionId) });
    return "ok";
  };
};

export default useSwitchGroup;