import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubmission, saveAnswer, finishSubmission } from "@apis";
import { queryKeys } from "@hooks/queryKeys";
import { shouldRetry } from "@utils/queryClient";

// Memulai atau melanjutkan sesi.
// Pemakaian: mutate({ email, nama, groupId })
export const useCreateSubmission = () =>
  useMutation({ mutationFn: createSubmission });

// Autosave satu soal. PUT bersifat idempoten, jadi aman diulang otomatis.
// Pemakaian: mutate({ submissionId, reviewid, aspect, informative })
export const useSaveAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ submissionId, reviewid, aspect, informative }) =>
      saveAnswer(submissionId, reviewid, { aspect, informative }),
    retry: shouldRetry(3),
    onSuccess: (saved, { submissionId, reviewid }) => {
      // Sinkronkan cache jawaban, tapi hanya jika cache sudah dimuat.
      // (Mengisi cache sebelum GET pertama akan membuat pemulihan progres terlewat.)
      queryClient.setQueryData(queryKeys.answers(submissionId), (old) => {
        if (!old) return old;
        const rest = old.filter((a) => a.reviewid !== reviewid);
        return saved.informative === null ? rest : [...rest, saved]; // null = jawaban dikosongkan
      });
    },
  });
};

// Menandai submission selesai.
// Pemakaian: mutate(submissionId)
// Jika 422 INCOMPLETE_ANSWERS, daftar reviewid yang kosong ada di error.details.missing.
export const useFinishSubmission = () =>
  useMutation({ mutationFn: finishSubmission });
