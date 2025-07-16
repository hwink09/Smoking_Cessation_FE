import api from "./api";

// Common request handler
const handleRequest = async (requestFn, fallback = null) => {
  try {
    const response = await requestFn();
    return response?.data?.data || response?.data || [];
  } catch (error) {
    console.error("API Error:", error);
    return fallback !== null ? fallback : Promise.reject(error);
  }
};

// Token checker
const hasValidToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("Token not found");
    return false;
  }
  return true;
};

// API methods
export const fetchAllTasksAPI = () =>
  handleRequest(() => api.get("/tasks"), []);

export const fetchTasksByStageIdAPI = (stageId) => {
  if (!stageId) {
    console.warn("No stageId provided");
    return Promise.resolve([]);
  }

  if (!hasValidToken()) return Promise.resolve([]);

  return handleRequest(() => api.get(`/tasks/stage/${stageId}`), []);
};

export const fetchTaskByIdAPI = (taskId) =>
  handleRequest(() => api.get(`/tasks/${taskId}`));

export const createTaskAPI = (taskData) =>
  handleRequest(() => api.post("/tasks", taskData));

export const updateTaskAPI = (taskId, taskData) =>
  handleRequest(() => api.put(`/tasks/${taskId}`, taskData));

export const deleteTaskAPI = (taskId) =>
  handleRequest(() => api.delete(`/tasks/${taskId}`));

export const completeTaskAPI = (taskId) =>
  handleRequest(() => api.post(`/tasks/${taskId}/complete`));
