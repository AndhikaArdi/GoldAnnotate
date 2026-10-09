import { useEffect, useMemo, useRef, useState } from "react";
import { useAnswers } from "@hooks/useGoldsetData";
import { useSaveAnswer } from "@hooks/useGoldsetMutations";
import { toastError } from "@helpers/notify"; // <- sesuaikan dengan helper toast Langkah 12 Anda
import { createSaveQueue } from "@helpers/saveQueue";
import { fromApiAnswer, toApiAnswer } from "@helpers/answerAdapter";

const EMPTY = { none: false, aspects: [] };

// Jawaban annotator untuk satu submission.
// - Tampilan berubah seketika; simpan ke server berjalan di belakang (autosave).
// - Saat dibuka/di-refresh, jawaban dipulihkan dari server.
const useAnnotation = (submissionId) => {
  const answersQuery = useAnswers(submissionId);
  const saveAnswer = useSaveAnswer();

  // Perubahan yang dibuat di sesi ini: { [submissionId]: { [reviewid]: jawaban } }.
  const [local, setLocal] = useState({});
  const [saveState, setSaveState] = useState({ pending: 0, failed: 0 });

  // Antrean dibuat sekali. Ref menjaga agar ia selalu memakai fungsi simpan terbaru.
  const saveRef = useRef(saveAnswer.mutateAsync);
  useEffect(() => {
    saveRef.current = saveAnswer.mutateAsync;
  });
  const [queue] = useState(() =>
    createSaveQueue((payload) => saveRef.current(payload), setSaveState),
  );

  // Jawaban dari server, sudah diterjemahkan ke bentuk UI.
  const fromServer = useMemo(
    () =>
      new Map(
        (answersQuery.data ?? []).map((a) => [a.reviewid, fromApiAnswer(a)]),
      ),
    [answersQuery.data],
  );

  // Perubahan lokal menang atas data server.
  const get = (id) => local[submissionId]?.[id] ?? fromServer.get(id) ?? EMPTY;

  const update = (id, change) => {
    if (!submissionId) return;
    const next = change(get(id));
    setLocal((prev) => ({
      ...prev,
      [submissionId]: { ...prev[submissionId], [id]: next },
    }));
    queue.enqueue(`${submissionId}:${id}`, {
      submissionId,
      reviewid: id,
      ...toApiAnswer(next),
    });
  };

  const toggleNone = (id, checked) =>
    update(id, (a) => ({ none: checked, aspects: checked ? [] : a.aspects }));

  const addAspect = (id, key) =>
    update(id, (a) => ({
      ...a,
      aspects: [...a.aspects, { key, sentiment: "" }],
    }));

  const removeAspect = (id, key) =>
    update(id, (a) => ({
      ...a,
      aspects: a.aspects.filter((x) => x.key !== key),
    }));

  const setSentiment = (id, key, sentiment) =>
    update(id, (a) => ({
      ...a,
      aspects: a.aspects.map((x) => (x.key === key ? { ...x, sentiment } : x)),
    }));

  // Toast hanya sekali per episode gagal, bukan setiap ada perubahan baru.
  const hadFailure = useRef(false);
  useEffect(() => {
    if (saveState.failed > 0 && !hadFailure.current) {
      toastError("Gagal menyimpan jawaban. Periksa koneksi, lalu coba lagi.");
    }
    hadFailure.current = saveState.failed > 0;
  }, [saveState.failed]);

  // Peringatkan bila tab ditutup saat masih ada yang belum tersimpan.
  useEffect(() => {
    if (saveState.pending === 0 && saveState.failed === 0) return;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    
    return () => window.removeEventListener("beforeunload", warn);
  }, [saveState]);

  // Koneksi kembali: coba kirim ulang jawaban yang sempat gagal.
  useEffect(() => {
    const onOnline = () => queue.retryFailed();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [queue]);

  return {
    get,
    toggleNone,
    addAspect,
    removeAspect,
    setSentiment,
    query: answersQuery, // hasil React Query untuk jawaban (isPending, isError, refetch, ...)
    save: {
      ...saveState,
      retry: queue.retryFailed,
      // Buang antrean simpan milik submission yang sudah dihapus (lihat useSwitchGroup).
      discard: (id) => queue.discard(`${id}:`),
    },
  };
};

export default useAnnotation;