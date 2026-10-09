import api from "@apis/axiosInstance";

const enc = encodeURIComponent;

// POST /submissions  (email dinormalisasi: trim + huruf kecil)
export const createSubmission = async ({ email, nama, groupId }) => {
  const { data } = await api.post("/submissions", {
    email: email.trim().toLowerCase(),
    nama: nama.trim(),
    groupId,
  });
  return data;
};

// GET /submissions/:id/answers
export const getAnswers = async (submissionId, { signal } = {}) => {
  const { data } = await api.get(`/submissions/${enc(submissionId)}/answers`, {
    signal,
  });
  return data;
};

// PUT /submissions/:id/answers/:reviewid  (idempoten, aman di-retry)
export const saveAnswer = async (
  submissionId,
  reviewid,
  { aspect, informative },
) => {
  const { data } = await api.put(
    `/submissions/${enc(submissionId)}/answers/${enc(reviewid)}`,
    { aspect, informative },
  );
  return data;
};

// PATCH /submissions/:id  → status "completed"
export const finishSubmission = async (submissionId) => {
  const { data } = await api.patch(`/submissions/${enc(submissionId)}`, {
    status: "completed",
  });
  return data;
};

// DELETE /submissions/:id  (204, tanpa isi)
export const deleteSubmission = async (submissionId) => {
  await api.delete(`/submissions/${enc(submissionId)}`);
};

// GET /submissions/:id/result  (untuk admin/ekspor, bukan halaman annotator)
export const getResult = async (submissionId, { signal } = {}) => {
  const { data } = await api.get(`/submissions/${enc(submissionId)}/result`, {
    signal,
  });
  return data;
};
