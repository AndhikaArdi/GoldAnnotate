import { useQuery } from "@tanstack/react-query";
import { getGroups, getGroupQuestions, getAnswers } from "@apis";
import { queryKeys } from "@hooks/queryKeys";

// Daftar group untuk landing. Jarang berubah.
export const useGroups = () =>
  useQuery({
    queryKey: queryKeys.groups(),
    queryFn: ({ signal }) => getGroups({ signal }),
    staleTime: 5 * 60 * 1000,
  });

// Soal satu group. Tidak jalan selama groupId masih kosong.
export const useQuestions = (groupId) =>
  useQuery({
    queryKey: queryKeys.questions(groupId),
    queryFn: ({ signal }) => getGroupQuestions(groupId, { signal }),
    enabled: Boolean(groupId),
    staleTime: Infinity, // soal tidak berubah selama sesi pengisian
  });

// Jawaban tersimpan satu submission (untuk memulihkan progres setelah refresh).
export const useAnswers = (submissionId) =>
  useQuery({
    queryKey: queryKeys.answers(submissionId),
    queryFn: ({ signal }) => getAnswers(submissionId, { signal }),
    enabled: Boolean(submissionId),
    // Setelah dimuat sekali, cache diperbarui oleh useSaveAnswer, bukan oleh fetch ulang
    // (fetch ulang bisa menimpa jawaban yang baru diketik).
    staleTime: Infinity,
  });
