import api from "./api";

// GET /api/tasks - Get All
export const fetchAllTasksAPI = async () => {
  try {
    const response = await api.get("/tasks");
    return response.data;
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    throw error;
  }
};

// GET /api/tasks/stage/{stageId} - Get By Stage ID
export const fetchTasksByStageIdAPI = async (stageId) => {
  try {
    const response = await api.get(`/tasks/stage/${stageId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tasks for stage ${stageId}:`, error);
    throw error;
  }
};

// GET /api/tasks/{id} - Get By Task ID
export const fetchTaskByIdAPI = async (taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching task ${taskId}:`, error);
    throw error;
  }
};

// POST /api/tasks - Create
export const createTaskAPI = async (taskData) => {
  try {
    const response = await api.post("/tasks", taskData);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// PUT /api/tasks/{id} - Update
export const updateTaskAPI = async (taskId, taskData) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error);
    throw error;
  }
};

// DELETE /api/tasks/{id} - Delete
export const deleteTaskAPI = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting task ${taskId}:`, error);
    throw error;
  }
};

// POST /api/tasks/{id}/complete - Complete Task
export const completeTaskAPI = async (taskId) => {
  try {
    const response = await api.post(`/tasks/${taskId}/complete`);
    return response.data;
  } catch (error) {
    console.error(`Error completing task ${taskId}:`, error);
    throw error;
  }
};

// GET /api/tasks/stage/{id}/completed - Get Task Complete by Stage ID
export const getCompletedTasksByStageAPI = async (stageId) => {
  try {
    const response = await api.get(`/tasks/stage/${stageId}/completed`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching completed tasks for stage ${stageId}:`,
      error
    );
    throw error;
  }
};
