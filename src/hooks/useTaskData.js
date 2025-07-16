import { useState, useCallback } from "react";
import {
  fetchAllTasksAPI,
  fetchTasksByStageIdAPI,
  fetchTaskByIdAPI,
  createTaskAPI,
  updateTaskAPI,
  deleteTaskAPI,
  completeTaskAPI,
} from "~/services/taskService";

export function useTaskData() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchAllTasks = useCallback(async () => {
    setLoading(true);
    try {
      const taskList = await fetchAllTasksAPI();
      setTasks(Array.isArray(taskList) ? taskList : []);
    } catch (err) {
      setError(err.message || "Lỗi khi tải tất cả nhiệm vụ.");
    } finally {
      setLoading(false);
    }
  }, []);

  const getTasksByStageId = (stageId) => {
    return tasks.filter((task) => task.stage_id === stageId);
  };

  const fetchTasksByStageId = async (stageId) => {
    setLoading(true);
    try {
      const taskList = await fetchTasksByStageIdAPI(stageId);
      return Array.isArray(taskList) ? taskList : [];
    } catch {
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskById = async (taskId) => {
    setLoading(true);
    try {
      const task = await fetchTaskByIdAPI(taskId);
      setSelectedTask(task);
      return task;
    } catch (err) {
      setError(err.message || "Lỗi khi lấy nhiệm vụ theo ID.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    setLoading(true);
    try {
      const newTask = await createTaskAPI(taskData);
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err.message || "Lỗi khi tạo nhiệm vụ.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId, taskData) => {
    setLoading(true);
    try {
      const response = await updateTaskAPI(taskId, taskData);

      if (response?.permissionDenied) {
        setError(response.message);
        return {
          success: false,
          permissionDenied: true,
          message: response.message,
          originalTask: taskData,
        };
      }

      const updatedTask = response?.data || response;
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? updatedTask : task))
      );

      if (selectedTask?._id === taskId) setSelectedTask(updatedTask);

      return updatedTask;
    } catch (err) {
      const msg =
        err.response?.status === 403
          ? "Không có quyền cập nhật nhiệm vụ này."
          : err.message || "Lỗi khi cập nhật nhiệm vụ.";

      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    setLoading(true);
    try {
      const response = await deleteTaskAPI(taskId);

      if (response?.permissionDenied) {
        return { success: true, message: response.message };
      }

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      if (selectedTask?._id === taskId) setSelectedTask(null);

      return { success: true };
    } catch (err) {
      const msg =
        err.response?.status === 403
          ? "Không có quyền xóa nhiệm vụ này."
          : err.message || "Lỗi khi xóa nhiệm vụ.";
      setError(msg);

      return {
        success: false,
        permissionDenied: err.response?.status === 403,
        message: msg,
      };
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId) => {
    setLoading(true);
    try {
      const result = await completeTaskAPI(taskId);
      return result;
    } catch (err) {
      setError(err.message || "Lỗi khi hoàn thành nhiệm vụ.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);
  const clearSelectedTask = () => setSelectedTask(null);

  return {
    // States
    tasks,
    loading,
    error,
    selectedTask,

    // Methods
    fetchAllTasks,
    getTasksByStageId,
    fetchTasksByStageId,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    clearError,
    clearSelectedTask,
  };
}
