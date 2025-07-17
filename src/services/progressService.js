import api from "./api";

// Lấy tất cả progress (filter theo role trong backend)
export const getAllProgress = async () => {
  const response = await api.get("/progress");
  return response.data;
};

// Tạo progress entry mới
export const createProgressAPI = async (progressData) => {
  const response = await api.post("/progress", progressData);
  return response.data;
};

// Lấy progress theo ID
export const getProgressByIdAPI = async (id) => {
  const response = await api.get(`/progress/${id}`);
  return response.data;
};

// Cập nhật progress
export const updateProgressAPI = async (id, progressData) => {
  const response = await api.put(`/progress/${id}`, progressData);
  return response.data;
};

// Xóa progress
export const deleteProgressAPI = async (id) => {
  const response = await api.delete(`/progress/${id}`);
  return response.data;
};

// Lấy progress theo stage (tất cả users trong stage đó)
export const getProgressByStageAPI = async (stageId) => {
  const response = await api.get(`/progress/stage/${stageId}`);
  return response.data;
};

// Lấy tổng quan progress của user (qua nhiều plan)
export const getUserOverallProgressAPI = async (userId) => {
  const response = await api.get(`/progress/user/${userId}`);
  return response.data;
};

// Lấy progress của 1 plan cụ thể
export const getSinglePlanProgressAPI = async (planId) => {
  const response = await api.get(`/progress/plan/${planId}`);
  return response.data;
};

// Lấy progress của 1 stage cụ thể cho user hiện tại
export const getSingleStageProgressAPI = async (stageId) => {
  const response = await api.get(`/progress/stage/${stageId}/user`);
  return response.data;
};

// Lấy số ngày không hút thuốc liên tục
export const getUserConsecutiveNoSmokeAPI = async (userId) => {
  const response = await api.get(`/progress/consecutive-no-smoke/${userId}`);
  return response.data;
};

export const fetchProgressAPI = getAllProgress;
export const getProgressByStageUserAPI = getSingleStageProgressAPI;
