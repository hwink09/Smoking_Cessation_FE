import api from "./api";

const handleRequest = async (requestFn, fallback = null) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return fallback !== null ? fallback : Promise.reject(error);
  }
};

export const fetchAllTasksAPI = () =>
  handleRequest(() => api.get("/tasks"), []);

export const fetchTasksByStageIdAPI = (stageId) => {
  if (!stageId) return Promise.resolve([]);

  return handleRequest(() => api.get(`/tasks/stage/${stageId}`), []).then(
    (response) => {
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }
      return [];
    }
  );
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

export const getCompletedTasksByStageAPI = (stageId) =>
  handleRequest(() => api.get(`/tasks/stage/${stageId}/completed`));
