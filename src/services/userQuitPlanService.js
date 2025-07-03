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

      console.log("Getting quit plan for user ID:", userId);

      // Sử dụng endpoint hiện có để lấy quit plan theo user ID
      const response = await api.get(`/quitPlan/user/${userId}`);
      console.log("Quit plan response:", response.data);

      const plans = Array.isArray(response.data)
        ? response.data
        : [response.data];

      // Trả về plan có coach (đã được approve)
      const approvedPlan = plans.find(
        (plan) => plan && plan.coach_id && plan.status === "approved"
      );

      console.log("Found approved plan:", approvedPlan);
      return approvedPlan || null;
    } catch (error) {
      console.error("Error getting my quit plan:", error);
      // Nếu lỗi 404 thì user chưa có plan
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Lấy stages của quit plan
  getMyStages: async (planId) => {
    try {
      console.log("Getting stages for plan ID:", planId);
      const response = await api.get(`/stages/plan/${planId}`);
      console.log("Stages response:", response.data);

      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error getting my stages:", error);
      // Nếu lỗi 404 thì chưa có stages
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  // Lấy tasks của một stage
  getMyTasks: async (stageId) => {
    try {
      console.log("Getting tasks for stage ID:", stageId);
      const response = await api.get(`/tasks/stage/${stageId}`);
      console.log("Tasks response:", response.data);

      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error getting my tasks:", error);
      // Nếu lỗi 404 thì chưa có tasks
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  // Hoàn thành một task
  completeTask: async (taskId) => {
    try {
      const response = await api.post(`/tasks/${taskId}/complete`);
      return response.data;
    } catch (error) {
      console.error("Error completing task:", error);
      throw error;
    }
  },

  // Hoàn thành một stage
  completeStage: async (stageId) => {
    try {
      const response = await api.post(`/stages/${stageId}/complete`);
      return response.data;
    } catch (error) {
      console.error("Error completing stage:", error);
      throw error;
    }
  },

  // Lấy danh sách task đã hoàn thành của một stage
  getCompletedTasks: async (stageId) => {
    try {
      const response = await api.get(`/tasks/stage/${stageId}/completed`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error getting completed tasks:", error);
      throw error;
    }
  },

  // Lấy tasks kèm theo trạng thái hoàn thành
  getTasksWithCompletion: async (stageId) => {
    try {
      const [tasks, completedTasks] = await Promise.all([
        UserQuitPlanService.getMyTasks(stageId),
        UserQuitPlanService.getCompletedTasks(stageId),
      ]);

      // Đánh dấu task nào đã hoàn thành
      const completedTaskIds = completedTasks.map((ct) => ct.task_id);

      return tasks.map((task) => ({
        ...task,
        is_completed: completedTaskIds.includes(task._id),
      }));
    } catch (error) {
      console.error("Error getting tasks with completion:", error);
      throw error;
    }
  },
};

export default UserQuitPlanService;
