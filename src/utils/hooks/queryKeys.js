// Satu sumber untuk semua query key, supaya penulisan dan invalidate selalu konsisten.
export const queryKeys = {
  groups: () => ["groups"],
  questions: (groupId) => ["questions", groupId],
  answers: (submissionId) => ["answers", submissionId],
};
