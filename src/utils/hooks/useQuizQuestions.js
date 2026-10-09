import { useMemo } from "react";
import { useQuestions } from "@hooks/useGoldsetData";
import { orderQuestions, getTotalPages } from "@helpers/questions";

// Soal satu group yang sudah diacak dengan seed, plus jumlah halamannya.
// `query` adalah hasil React Query asli (isPending, isError, error, refetch, ...).
const useQuizQuestions = (groupId, seed) => {
  const query = useQuestions(groupId);

  const questions = useMemo(
    () => orderQuestions(query.data ?? [], seed),
    [query.data, seed],
  );

  return { query, questions, totalPages: getTotalPages(questions.length) };
};

export default useQuizQuestions;