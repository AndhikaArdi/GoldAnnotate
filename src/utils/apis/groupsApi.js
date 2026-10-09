import api from "@apis/axiosInstance";

// GET /groups
export const getGroups = async ({ signal } = {}) => {
  const { data } = await api.get("/groups", { signal });
  return data;
};

// GET /groups/:groupId/questions
export const getGroupQuestions = async (groupId, { signal } = {}) => {
  const { data } = await api.get(
    `/groups/${encodeURIComponent(groupId)}/questions`,
    { signal },
  );
  return data;
};
