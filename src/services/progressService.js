import api from "./api";

export const fetchProgressAPI = async () => {
  const response = await api.get("/progress");
  return response.data;
};

export const createProgressAPI = async (progressData) => {
  const response = await api.post("/progress", progressData);
  return response.data;
};

export const getProgressByIdAPI = async (id) => {
  const response = await api.get(`/progress/${id}`);
  return response.data;
};

export const updateProgressAPI = async (id, progressData) => {
  const response = await api.put(`/progress/${id}`, progressData);
  return response.data;
};

export const deleteProgressAPI = async (id) => {
  const response = await api.delete(`/progress/${id}`);
  return response.data;
};

export const getProgressByStageAPI = async (stageId) => {
  const response = await api.get(`/progress/stage/${stageId}`);
  return response.data;
};

export const getUserOverallProgressAPI = async (userId) => {
  const response = await api.get(`/progress/user/${userId}`);
  return response.data;
};

export const getSinglePlanProgressAPI = async (planId) => {
  const response = await api.get(`/progress/plan/${planId}`);
  return response.data;
};

export const getProgressByStageUserAPI = async (stageId) => {
  const response = await api.get(`/progress/stage/${stageId}/user`);
  return response.data;
};

export const getUserConsecutiveNoSmokeAPI = async (userId) => {
  const response = await api.get(`/progress/consecutive-no-smoke/${userId}`);
  return response.data;
};
