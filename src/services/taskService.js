import api from "./api";

// Lấy tất cả task
export const fetchAllTasksAPI = async () => {
  return await api.get("/tasks");
};

// Lấy tasks theo stage ID
export const fetchTasksByStageIdAPI = async (stageId) => {
  return await api.get(`/tasks/stage/${stageId}`);
};
