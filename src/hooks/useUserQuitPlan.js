import { useState, useCallback } from "react";
import UserQuitPlanService from "~/services/userQuitPlanService";

const determineCurrentStage = (stages) => {
  if (!stages || stages.length === 0) return null;

  const inProgress = stages.find((s) => s.status === "in_progress");
  if (inProgress) return inProgress;

  const notCompleted = stages.find((s) => !s.is_completed);
  if (notCompleted) return notCompleted;

  return stages.every((s) => s.is_completed) ? null : stages[0];
};

export function useUserQuitPlan() {
  const [myQuitPlan, setMyQuitPlan] = useState(null);
  const [myStages, setMyStages] = useState([]);
  const [currentStage, setCurrentStage] = useState(null);
  const [stageTasks, setStageTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyQuitPlan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const plan = await UserQuitPlanService.getMyQuitPlan();
      setMyQuitPlan(plan);
      return plan;
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi khi lấy kế hoạch"
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyStages = useCallback(async (planId) => {
    if (!planId) return [];

    setLoading(true);
    setError(null);
    try {
      const stages = await UserQuitPlanService.getMyStages(planId);
      setMyStages(stages);

      const current = determineCurrentStage(stages);
      setCurrentStage(current);

      return stages;
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi khi lấy giai đoạn"
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStageTasks = useCallback(async (stageId) => {
    if (!stageId) return [];

    setLoading(true);
    setError(null);
    try {
      const tasks = await UserQuitPlanService.getTasksWithCompletion(stageId);
      setStageTasks(tasks);
      return tasks;
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi khi lấy nhiệm vụ"
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const completeTask = useCallback(
    async (taskId) => {
      try {
        await UserQuitPlanService.completeTask(taskId);

        const updatedTasks = stageTasks.map((t) =>
          t._id === taskId ? { ...t, is_completed: true } : t
        );
        setStageTasks(updatedTasks);

        const allCompleted = updatedTasks.every((t) => t.is_completed);

        if (allCompleted && currentStage) {
          setCurrentStage((prev) => ({ ...prev, is_completed: true }));

          setMyStages((prev) =>
            prev.map((s) =>
              s._id === currentStage._id ? { ...s, is_completed: true } : s
            )
          );

          const index = myStages.findIndex((s) => s._id === currentStage._id);
          const next = myStages[index + 1];

          if (next) {
            return {
              success: true,
              stageCompleted: true,
              hasNextStage: true,
              currentStageNumber: currentStage.stage_number || index + 1,
              nextStageNumber: next.stage_number || index + 2,
              message: `🎉 Bạn đã hoàn thành giai đoạn ${
                currentStage.stage_number || index + 1
              }!`,
            };
          } else {
            setMyStages((prev) =>
              prev.map((s) => ({ ...s, is_completed: true }))
            );
            setMyQuitPlan((prev) => ({ ...prev, status: "completed" }));
            setCurrentStage(null);
            setStageTasks([]);

            return {
              success: true,
              allStagesCompleted: true,
              planCompleted: true,
              message:
                "🏆 Bạn đã hoàn thành tất cả các giai đoạn trong kế hoạch!",
            };
          }
        }

        return { success: true };
      } catch (err) {
        return {
          success: false,
          error:
            err?.response?.data?.message ||
            err.message ||
            "Lỗi khi hoàn thành nhiệm vụ",
        };
      }
    },
    [stageTasks, currentStage, myStages]
  );

  const moveToNextStage = useCallback(async () => {
    if (!currentStage || !myStages.length) {
      return { success: false, error: "Không có giai đoạn hiện tại" };
    }

    try {
      setLoading(true);

      const index = myStages.findIndex((s) => s._id === currentStage._id);
      const next = myStages[index + 1];

      if (!next) {
        return { success: false, error: "Bạn đã ở giai đoạn cuối" };
      }

      setCurrentStage(next);
      setMyStages((prev) =>
        prev.map((s) => {
          if (s._id === currentStage._id) return { ...s, is_completed: true };
          if (s._id === next._id) return { ...s, status: "in_progress" };
          return s;
        })
      );

      const tasks = await UserQuitPlanService.getTasksWithCompletion(next._id);
      setStageTasks(tasks);

      return {
        success: true,
        message: `Đã chuyển sang giai đoạn ${next.stage_number || index + 2}: ${
          next.title
        }`,
        nextStage: next,
      };
    } catch (err) {
      return {
        success: false,
        error:
          err?.response?.data?.message ||
          err.message ||
          "Lỗi khi chuyển giai đoạn",
      };
    } finally {
      setLoading(false);
    }
  }, [currentStage, myStages]);

  const fetchAllUserData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const plan = await UserQuitPlanService.getMyQuitPlan();
      if (!plan) {
        setMyQuitPlan(null);
        setMyStages([]);
        setCurrentStage(null);
        setStageTasks([]);
        return { plan: null, stages: [], tasks: [] };
      }

      setMyQuitPlan(plan);

      const stages = await UserQuitPlanService.getMyStages(plan._id);
      setMyStages(stages);

      if (stages.length === 0) {
        setCurrentStage(null);
        setStageTasks([]);
        return { plan, stages: [], tasks: [] };
      }

      const current = determineCurrentStage(stages);
      setCurrentStage(current);

      if (!current) {
        if (plan.status !== "completed") {
          const updatedPlan = { ...plan, status: "completed" };
          setMyQuitPlan(updatedPlan);
          return { plan: updatedPlan, stages, tasks: [], completed: true };
        }
        setStageTasks([]);
        return { plan, stages, tasks: [], completed: true };
      }

      const tasks = await UserQuitPlanService.getTasksWithCompletion(
        current._id
      );
      setStageTasks(tasks);
      return { plan, stages, tasks };
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi khi tải dữ liệu"
      );
      return { plan: null, stages: [], tasks: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const progress = stageTasks.length
    ? Math.round(
        (stageTasks.filter((t) => t.is_completed).length / stageTasks.length) *
          100
      )
    : 0;

  const completedCount = stageTasks.filter((t) => t.is_completed).length;

  return {
    myQuitPlan,
    myStages,
    currentStage,
    stageTasks,
    loading,
    error,
    progress,
    completedCount,

    fetchMyQuitPlan,
    fetchMyStages,
    fetchStageTasks,
    completeTask,
    fetchAllUserData,
    moveToNextStage,

    clearError: () => setError(null),
    refetch: fetchAllUserData,
  };
}
