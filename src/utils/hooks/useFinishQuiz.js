import { useState } from "react";
import { useNavigate } from "react-router";
import { useFinishSubmission } from "@hooks/useGoldsetMutations";
import { alertDialog, confirmDialog, toastError } from "@helpers/notify";
import { isAnswerDone } from "@helpers/answer";
import { findIncomplete } from "@helpers/questions";

// [2] -> "2", [2, 5] -> "2 dan 5", [1, 2, 3] -> "1, 2 dan 3"
const joinPages = (pages) =>
  pages.length === 1
    ? String(pages[0])
    : `${pages.slice(0, -1).join(", ")} dan ${pages[pages.length - 1]}`;

// Logika tombol Selesai: periksa, konfirmasi, kirim, lalu pindah ke halaman terima kasih.
// Mengembalikan { finish, isFinishing }.
const useFinishQuiz = ({ session, questions, annotation }) => {
  const navigate = useNavigate();
  const finishSubmission = useFinishSubmission();
  const [isChecking, setIsChecking] = useState(false);

  // Dialog soal belum lengkap, dengan jalan pintas ke halaman pertama yang bermasalah.
  // Isi html hanya angka buatan sendiri (aman).
  const showIncomplete = async ({ count, pages }) => {
    const goToPage = await confirmDialog({
      title: "Masih ada soal yang belum lengkap",
      html: `Ada <b>${count} soal</b> yang belum dijawab atau punya aspek tanpa sentimen, di halaman <b>${joinPages(pages)}</b>.`,
      confirmText: `Ke halaman ${pages[0]}`,
      cancelText: "Tutup",
      icon: "warning",
    });
    if (goToPage) navigate(`/kuis/${pages[0]}`);
  };

  const submit = () => {
    finishSubmission.mutate(session.submissionId, {
      onSuccess: () => {
        // Sesi diakhiri oleh halaman terima kasih, bukan di sini.
        navigate("/selesai", {
          replace: true,
          state: { nama: session.nama, groupLabel: session.groupLabel },
        });
      },
      onError: async (error) => {
        // Server menolak karena ada soal belum lengkap: terjemahkan reviewid ke nomor halaman.
        if (error.code === "INCOMPLETE_ANSWERS") {
          const missing = new Set(error.details?.missing ?? []);
          const incomplete = findIncomplete(
            questions,
            (q) => !missing.has(q.reviewid),
          );
          if (incomplete.count > 0) {
            await showIncomplete(incomplete);
            return;
          }
        }
        toastError(`Gagal menyelesaikan: ${error.message}`, {
          id: "finish-error",
        });
      },
    });
  };

  const check = async () => {
    // 1. Semua jawaban harus sudah sampai di server.
    const { pending, failed } = annotation.save;
    if (pending > 0 || failed > 0) {
      await alertDialog({
        title: "Jawaban belum selesai tersimpan",
        text:
          failed > 0
            ? `${failed} jawaban belum tersimpan. Klik "Coba Simpan Lagi" di bawah daftar halaman, lalu tekan Selesai lagi.`
            : "Jawaban Anda masih disimpan. Tunggu sebentar, lalu tekan Selesai lagi.",
        icon: "info",
      });
      return;
    }

    // 2. Tidak boleh ada soal kosong atau aspek tanpa sentimen.
    const incomplete = findIncomplete(questions, (q) =>
      isAnswerDone(annotation.get(q.reviewid)),
    );
    if (incomplete.count > 0) {
      await showIncomplete(incomplete);
      return;
    }

    // 3. Konfirmasi, lalu kirim.
    const confirmed = await confirmDialog({
      title: "Selesaikan anotasi?",
      text: "Setelah diselesaikan, jawaban tidak bisa diubah lagi.",
      confirmText: "Ya, selesaikan",
      cancelText: "Kembali",
      icon: "question",
    });
    if (confirmed) submit();
  };

  const finish = async () => {
    setIsChecking(true);
    try {
      await check();
    } finally {
      setIsChecking(false);
    }
  };

  return { finish, isFinishing: isChecking || finishSubmission.isPending };
};

export default useFinishQuiz;