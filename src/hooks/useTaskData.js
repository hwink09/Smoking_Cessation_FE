import { useState, useCallback } from "react";
import {
  fetchAllTasksAPI,
  fetchTasksByStageIdAPI,
  fetchTaskByIdAPI,
  createTaskAPI,
  updateTaskAPI,
  deleteTaskAPI,
  completeTaskAPI,
  getCompletedTasksByStageAPI,
} from "~/services/taskService";

export function useTaskData() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);

  const fetchAllTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAllTasksAPI();

      const taskList = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      setTasks(taskList);
    } catch (err) {
      console.error("Lỗi khi lấy tất cả tasks:", err);
      setError(err.message || "Lỗi không xác định khi gọi tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  const getTasksByStageId = (stageId) => {
    return tasks.filter((task) => task.stage_id === stageId);
  };

  const fetchTasksByStageId = async (stageId) => {
    try {
      setLoading(true);
      const response = await fetchTasksByStageIdAPI(stageId);

      const taskList = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      return taskList;
    } catch (err) {
      console.error("Lỗi khi fetch task theo stage:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Lấy task theo ID
  const fetchTaskById = async (taskId) => {
    try {
      setLoading(true);
      const response = await fetchTaskByIdAPI(taskId);
      const task = response.data;
      setSelectedTask(task);
      return task;
    } catch (err) {
      console.error("Lỗi khi lấy task theo ID:", err);
      setError(err.message || "Lỗi không xác định khi lấy task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Tạo task mới
  const createTask = async (taskData) => {
    try {
      setLoading(true);
      const response = await createTaskAPI(taskData);
      const newTask = response.data;

      // Cập nhật danh sách tasks local
      setTasks((prevTasks) => [...prevTasks, newTask]);
      return newTask;
    } catch (err) {
      console.error("Lỗi khi tạo task:", err);
      setError(err.message || "Lỗi không xác định khi tạo task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật task
  const updateTask = async (taskId, taskData) => {
    try {
      setLoading(true);
      const response = await updateTaskAPI(taskId, taskData);
      const updatedTask = response.data;

      // Cập nhật danh sách tasks local
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
      );

      // Cập nhật selectedTask nếu đang được chọn
      if (selectedTask && selectedTask._id === taskId) {
        setSelectedTask(updatedTask);
      }

      return updatedTask;
    } catch (err) {
      console.error("Lỗi khi cập nhật task:", err);
      setError(err.message || "Lỗi không xác định khi cập nhật task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Xóa task
  const deleteTask = async (taskId) => {
    try {
      setLoading(true);
      await deleteTaskAPI(taskId);

      // Xóa task khỏi danh sách local
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));

      // Clear selectedTask nếu đang được chọn
      if (selectedTask && selectedTask._id === taskId) {
        setSelectedTask(null);
      }

      return true;
    } catch (err) {
      console.error("Lỗi khi xóa task:", err);
      setError(err.message || "Lỗi không xác định khi xóa task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Hoàn thành task
  const completeTask = async (taskId) => {
    try {
      setLoading(true);
      const response = await completeTaskAPI(taskId);
      const result = response.data;

      // Có thể cập nhật UI để hiển thị task đã completed
      return result;
    } catch (err) {
      console.error("Lỗi khi hoàn thành task:", err);
      setError(err.message || "Lỗi không xác định khi hoàn thành task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Lấy các task đã hoàn thành theo stage
  const fetchCompletedTasksByStage = async (stageId) => {
    try {
      setLoading(true);
      const response = await getCompletedTasksByStageAPI(stageId);

      const completedTaskList = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      setCompletedTasks(completedTaskList);
      return completedTaskList;
    } catch (err) {
      console.error("Lỗi khi lấy task đã hoàn thành:", err);
      setError(err.message || "Lỗi không xác định khi lấy task đã hoàn thành");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset error
  const clearError = () => {
    setError(null);
  };

  // Reset selected task
  const clearSelectedTask = () => {
    setSelectedTask(null);
  };

  return {
    // States
    tasks,
    loading,
    error,
    selectedTask,
    completedTasks,

    // Methods
    fetchAllTasks,
    getTasksByStageId,
    fetchTasksByStageId,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    fetchCompletedTasksByStage,
    clearError,
    clearSelectedTask,
  };
}
