import api from "./api";

const UserQuitPlanService = {
  // Lấy quit plan của user hiện tại
  getMyQuitPlan: async () => {
    try {
      // Lấy user ID từ localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.userId || user?.id || user?._id;

      if (!userId) {
        throw new Error("User ID not found. Please login again.");
      }

      const response = await api.get(`/quitPlan/user/${userId}`);

      const plans = Array.isArray(response.data)
        ? response.data
        : [response.data];

      const approvedPlan = plans.find(
        (plan) => plan && plan.coach_id && plan.status === "approved"
      );

      return approvedPlan || null;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Lấy stages của quit plan
  getMyStages: async (planId) => {
    try {
      const response = await api.get(`/stages/plan/${planId}`);

      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  // Lấy tasks của một stage
  getMyTasks: async (stageId) => {
    try {
      const response = await api.get(`/tasks/stage/${stageId}`);

      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  // Hoàn thành một task
  completeTask: async (taskId) => {
    const response = await api.post(`/tasks/${taskId}/complete`);
    return response.data;
  },

  // Lấy danh sách task đã hoàn thành của một stage
  getCompletedTasks: async (stageId) => {
    const response = await api.get(`/tasks/stage/${stageId}/completed`);
    return Array.isArray(response.data) ? response.data : [];
  },

  // Lấy tasks kèm theo trạng thái hoàn thành
  getTasksWithCompletion: async (stageId) => {
    const [tasks, completedTasks] = await Promise.all([
      UserQuitPlanService.getMyTasks(stageId),
      UserQuitPlanService.getCompletedTasks(stageId),
    ]);

    const completedTaskIds = completedTasks.map((ct) => ct.task_id);

    return tasks.map((task) => ({
      ...task,
      is_completed: completedTaskIds.includes(task._id),
    }));
  },
};

export default UserQuitPlanService;
