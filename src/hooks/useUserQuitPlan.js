import { useState, useCallback } from "react";
import UserQuitPlanService from "~/services/userQuitPlanService";

// Helper function để xác định current stage
const determineCurrentStage = (stages) => {
  if (!stages || stages.length === 0) return null;

  // 1. Tìm stage có status "in_progress"
  let currentStage = stages.find((s) => s.status === "in_progress");
  if (currentStage) return currentStage;

  // 2. Tìm stage đầu tiên chưa completed
  currentStage = stages.find((s) => s.status !== "completed");
  if (currentStage) return currentStage;

  // 3. Nếu tất cả đều completed, lấy stage cuối cùng
  if (stages.length > 0) {
    return stages[stages.length - 1];
  }

  // 4. Fallback: stage đầu tiên
  return stages[0];
};

export function useUserQuitPlan() {
  const [myQuitPlan, setMyQuitPlan] = useState(null);
  const [myStages, setMyStages] = useState([]);
  const [currentStage, setCurrentStage] = useState(null);
  const [stageTasks, setStageTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy quit plan của user hiện tại
  const fetchMyQuitPlan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const plan = await UserQuitPlanService.getMyQuitPlan();
      setMyQuitPlan(plan);
      return plan;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err.message || "Lỗi khi lấy kế hoạch";
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy stages của quit plan
  const fetchMyStages = useCallback(async (planId) => {
    if (!planId) return [];

    setLoading(true);
    setError(null);
    try {
      const stages = await UserQuitPlanService.getMyStages(planId);
      setMyStages(stages);

      // Tìm stage hiện tại sử dụng helper function
      const currentStageData = determineCurrentStage(stages);
      setCurrentStage(currentStageData);

      return stages;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err.message || "Lỗi khi lấy giai đoạn";
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy tasks của stage hiện tại
  const fetchStageTasks = useCallback(async (stageId) => {
    if (!stageId) return [];

    setLoading(true);
    setError(null);
    try {
      const tasks = await UserQuitPlanService.getTasksWithCompletion(stageId);
      setStageTasks(tasks);
      return tasks;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err.message || "Lỗi khi lấy nhiệm vụ";
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Hoàn thành task
  const completeTask = useCallback(
    async (taskId) => {
      try {
        await UserQuitPlanService.completeTask(taskId);

        // Cập nhật trạng thái local
        const updatedTasks = stageTasks.map((task) =>
          task._id === taskId ? { ...task, is_completed: true } : task
        );
        setStageTasks(updatedTasks);

        // Kiểm tra xem tất cả tasks trong stage hiện tại đã hoàn thành chưa
        const allTasksCompleted = updatedTasks.every(
          (task) => task.is_completed
        );

        if (allTasksCompleted && currentStage) {
          try {
            // Đánh dấu stage hiện tại là hoàn thành trong database
            await UserQuitPlanService.completeStage(currentStage._id);

            // Cập nhật trạng thái local của stage hiện tại
            setCurrentStage((prev) => ({ ...prev, is_completed: true }));

            // Cập nhật myStages để đánh dấu stage hiện tại đã completed
            setMyStages((prevStages) =>
              prevStages.map((stage) =>
                stage._id === currentStage._id
                  ? { ...stage, status: "completed" }
                  : stage
              )
            );
          } catch (stageError) {
            // Tiếp tục dù lỗi vì có thể backend chưa hỗ trợ API này
          }

          // Kiểm tra xem có stage tiếp theo không
          const currentStageIndex = myStages.findIndex(
            (s) => s._id === currentStage._id
          );
          const nextStage = myStages[currentStageIndex + 1];

          if (nextStage) {
            // Có stage tiếp theo - không tự động chuyển, để người dùng chọn
            return {
              success: true,
              stageCompleted: true,
              hasNextStage: true,
              currentStageNumber:
                currentStage.stage_number || currentStageIndex + 1,
              nextStageNumber: nextStage.stage_number || currentStageIndex + 2,
              message: `🎉 Chúc mừng! Bạn đã hoàn thành giai đoạn ${
                currentStage.stage_number || currentStageIndex + 1
              }!`,
            };
          } else {
            // Đã hoàn thành tất cả stages
            return {
              success: true,
              allStagesCompleted: true,
              message:
                "🏆 Chúc mừng! Bạn đã hoàn thành tất cả các giai đoạn trong kế hoạch cai thuốc!",
            };
          }
        }

        return { success: true };
      } catch (err) {
        const errorMsg =
          err?.response?.data?.message ||
          err.message ||
          "Lỗi khi hoàn thành nhiệm vụ";
        return { success: false, error: errorMsg };
      }
    },
    [stageTasks, currentStage, myStages]
  );

  // Chuyển sang stage tiếp theo thủ công
  const moveToNextStage = useCallback(async () => {
    if (!currentStage || !myStages.length) {
      return { success: false, error: "Không có thông tin stage hiện tại" };
    }

    try {
      setLoading(true);

      // Tìm stage tiếp theo
      const currentStageIndex = myStages.findIndex(
        (s) => s._id === currentStage._id
      );
      const nextStage = myStages[currentStageIndex + 1];

      if (!nextStage) {
        return {
          success: false,
          error: "Bạn đã ở giai đoạn cuối cùng",
        };
      }

      // Chuyển sang stage tiếp theo
      setCurrentStage(nextStage);

      // Cập nhật trạng thái stages trong local state
      setMyStages((prevStages) =>
        prevStages.map((stage) => {
          if (stage._id === currentStage._id) {
            return { ...stage, status: "completed" };
          } else if (stage._id === nextStage._id) {
            return { ...stage, status: "in_progress" };
          }
          return stage;
        })
      );

      // Tải tasks của stage mới
      const nextStageTasks = await UserQuitPlanService.getTasksWithCompletion(
        nextStage._id
      );
      setStageTasks(nextStageTasks);

      return {
        success: true,
        message: `Đã chuyển sang giai đoạn ${
          nextStage.stage_number || currentStageIndex + 2
        }: ${nextStage.title}`,
        nextStage: nextStage,
      };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err.message ||
        "Lỗi khi chuyển giai đoạn";
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [currentStage, myStages]);

  // Lấy toàn bộ dữ liệu (quit plan + stages + tasks)
  const fetchAllUserData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Lấy quit plan
      const plan = await UserQuitPlanService.getMyQuitPlan();
      if (!plan) {
        setMyQuitPlan(null);
        setMyStages([]);
        setCurrentStage(null);
        setStageTasks([]);
        return { plan: null, stages: [], tasks: [] };
      }

      setMyQuitPlan(plan);

      // 2. Lấy stages
      const stages = await UserQuitPlanService.getMyStages(plan._id);
      setMyStages(stages);

      if (stages.length === 0) {
        setCurrentStage(null);
        setStageTasks([]);
        return { plan, stages: [], tasks: [] };
      }

      // 3. Tìm stage hiện tại sử dụng helper function
      const currentStageData = determineCurrentStage(stages);
      setCurrentStage(currentStageData);

      // 4. Lấy tasks của stage hiện tại
      if (currentStageData) {
        const tasks = await UserQuitPlanService.getTasksWithCompletion(
          currentStageData._id
        );
        setStageTasks(tasks);
        return { plan, stages, tasks };
      } else {
        setStageTasks([]);
        return { plan, stages, tasks: [] };
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err.message || "Lỗi khi tải dữ liệu";
      setError(errorMsg);
      return { plan: null, stages: [], tasks: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  // Tính toán progress
  const progress =
    stageTasks.length > 0
      ? Math.round(
          (stageTasks.filter((t) => t.is_completed).length /
            stageTasks.length) *
            100
        )
      : 0;

  const completedCount = stageTasks.filter((t) => t.is_completed).length;

  return {
    // Data
    myQuitPlan,
    myStages,
    currentStage,
    stageTasks,
    loading,
    error,
    progress,
    completedCount,

    // Actions
    fetchMyQuitPlan,
    fetchMyStages,
    fetchStageTasks,
    completeTask,
    fetchAllUserData,
    moveToNextStage,

    // Utilities
    clearError: () => setError(null),
    refetch: fetchAllUserData,
  };
}
