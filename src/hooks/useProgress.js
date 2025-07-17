import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  getAllProgress,
  createProgressAPI,
  updateProgressAPI,
  deleteProgressAPI,
  getUserOverallProgressAPI,
  getSinglePlanProgressAPI,
  getSingleStageProgressAPI,
  getTotalMoneySavedInPlanAPI,
  getPlanSmokingStatsAPI,
} from "~/services/progressService";
import QuitPlanService from "~/services/quitPlanService";
import { message } from "antd";
import dayjs from "dayjs";

const useProgress = (userId = null, stageId = null, planId = null) => {
  const [progress, setProgress] = useState([]);
  const [overallProgress, setOverallProgress] = useState(null);
  const [planProgress, setPlanProgress] = useState(null);
  const [stageProgress, setStageProgress] = useState(null);
  const [planTotalStats, setPlanTotalStats] = useState(null);
  const [planSmokingStats, setPlanSmokingStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loadingRefs = useRef({
    fetchProgress: false,
    fetchUserOverall: false,
    fetchPlan: false,
    fetchStage: false,
    fetchPlanTotal: false,
    fetchPlanSmoking: false,
  });

  const fetchProgress = useCallback(async () => {
    if (loadingRefs.current.fetchProgress) return;
    loadingRefs.current.fetchProgress = true;
    setLoading(true);
    setError(null);

    try {
      const data = await getAllProgress();
      setProgress(data);
    } catch (err) {
      setError(err.message || "Không thể tải dữ liệu tiến độ");
    } finally {
      loadingRefs.current.fetchProgress = false;
      setLoading(false);
    }
  }, []);

  const fetchUserOverallProgress = useCallback(
    async (targetUserId = userId) => {
      if (!targetUserId || loadingRefs.current.fetchUserOverall) return;
      loadingRefs.current.fetchUserOverall = true;
      setLoading(true);
      setError(null);

      try {
        const data = await getUserOverallProgressAPI(targetUserId);
        setOverallProgress(data);
      } catch (err) {
        setError(err.message || "Không thể tải tổng quan tiến độ");
      } finally {
        loadingRefs.current.fetchUserOverall = false;
        setLoading(false);
      }
    },
    [userId]
  );

  const fetchPlanProgress = useCallback(
    async (targetPlanId = planId) => {
      if (!targetPlanId || loadingRefs.current.fetchPlan) return;
      loadingRefs.current.fetchPlan = true;
      setLoading(true);
      setError(null);

      try {
        const data = await getSinglePlanProgressAPI(targetPlanId);
        setPlanProgress(data);
      } catch (err) {
        setError(err.message || "Không thể tải tiến độ kế hoạch");
      } finally {
        loadingRefs.current.fetchPlan = false;
        setLoading(false);
      }
    },
    [planId]
  );

  const fetchPlanTotalStats = useCallback(
    async (targetPlanId = planId) => {
      if (!targetPlanId || loadingRefs.current.fetchPlanTotal) return;
      loadingRefs.current.fetchPlanTotal = true;
      setLoading(true);
      setError(null);

      try {
        const data = await getTotalMoneySavedInPlanAPI(targetPlanId);
        setPlanTotalStats(data);
      } catch (err) {
        setError(err.message || "Không thể tải thống kê tổng của kế hoạch");
      } finally {
        loadingRefs.current.fetchPlanTotal = false;
        setLoading(false);
      }
    },
    [planId]
  );

  const fetchPlanSmokingStats = useCallback(
    async (targetPlanId = planId) => {
      if (!targetPlanId || loadingRefs.current.fetchPlanSmoking) return;
      loadingRefs.current.fetchPlanSmoking = true;
      setLoading(true);
      setError(null);

      try {
        const data = await getPlanSmokingStatsAPI(targetPlanId);
        setPlanSmokingStats(data);
      } catch (err) {
        setError(
          err.message || "Không thể tải thống kê hút thuốc của kế hoạch"
        );
      } finally {
        loadingRefs.current.fetchPlanSmoking = false;
        setLoading(false);
      }
    },
    [planId]
  );

  const fetchStageProgress = useCallback(
    async (targetStageId = stageId, forceRefresh = false) => {
      if (!targetStageId) return;
      if (!forceRefresh && loadingRefs.current.fetchStage) return;

      loadingRefs.current.fetchStage = true;
      if (!forceRefresh) setLoading(true);
      setError(null);

      try {
        const allProgress = await getAllProgress();
        const stageProgressEntries = allProgress.filter((entry) => {
          const entryStageId =
            entry.stage_id && (entry.stage_id._id || entry.stage_id);
          return entryStageId === targetStageId;
        });

        try {
          const stageStats = await getSingleStageProgressAPI(targetStageId);
          setStageProgress(stageStats);
        } catch (err) {
          console.error("Error loading stage stats:", err);
        }

        setProgress(stageProgressEntries);
      } catch (err) {
        setError(err.message || "Không thể tải tiến độ giai đoạn");
      } finally {
        loadingRefs.current.fetchStage = false;
        if (!forceRefresh) setLoading(false);
      }
    },
    [stageId]
  );

  const createProgressEntry = useCallback(
    async (progressData) => {
      if (submitting) return;
      setSubmitting(true);
      setError(null);

      const payload = {
        stage_id: progressData.stage_id || stageId,
        date: progressData.date || dayjs().format("YYYY-MM-DD"),
        cigarettes_smoked:
          progressData.cigarettes_smoked || progressData.cigarettes || 0,
        health_status:
          progressData.health_status || progressData.symptoms || "",
        user_id: progressData.user_id || userId,
      };

      try {
        let resultEntry;

        // Luôn sử dụng createProgressAPI - backend sẽ tự động xử lý UPDATE nếu entry đã tồn tại
        resultEntry = await createProgressAPI(payload);

        // Refresh toàn bộ progress data để đảm bảo consistency
        if (stageId) {
          await fetchStageProgress(stageId, true); // Force refresh
        }

        message.success(
          progressData.isUpdate
            ? "Đã cập nhật nhật ký tiến độ thành công!"
            : "Đã lưu nhật ký tiến độ thành công!"
        );
        return resultEntry;
      } catch (err) {
        setError(err.message || "Không thể lưu nhật ký tiến độ");
        message.error(err.message || "Không thể lưu nhật ký tiến độ");
        console.error("Error creating progress entry:", err);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, stageId, userId, fetchStageProgress]
  );

  const updateProgressEntry = useCallback(
    async (id, progressData) => {
      if (submitting) return;
      setSubmitting(true);
      setError(null);

      try {
        const updatedEntry = await updateProgressAPI(id, progressData);
        setProgress((prev) =>
          prev.map((item) => (item.id === id ? updatedEntry : item))
        );
        message.success("Đã cập nhật nhật ký thành công!");
        return updatedEntry;
      } catch (err) {
        setError(err.message || "Không thể cập nhật nhật ký");
        message.error("Không thể cập nhật nhật ký");
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [submitting]
  );

  const deleteProgressEntry = useCallback(
    async (id) => {
      if (submitting) return;
      setSubmitting(true);
      setError(null);

      try {
        await deleteProgressAPI(id);
        setProgress((prev) => prev.filter((item) => item.id !== id));
        message.success("Đã xóa nhật ký thành công!");
      } catch (err) {
        setError(err.message || "Không thể xóa nhật ký");
        message.error("Không thể xóa nhật ký");
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [submitting]
  );

  const calculateStats = useCallback(
    (
      quitDate,
      cigarettesPerDay = 20,
      pricePerPack = 50000,
      cigarettesPerPack = 20
    ) => {
      const now = new Date();
      const quit = new Date(quitDate);
      const totalDaysSinceQuit = Math.max(
        1,
        Math.floor((now - quit) / (1000 * 3600 * 24)) + 1
      );
      const costPerCigarette = pricePerPack / cigarettesPerPack;

      let smokeFreedays = 0;
      let totalCigarettesAvoided = 0;
      let totalMoneySaved = 0;

      const entriesSinceQuit = progress.filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate >= quit;
      });

      for (let i = 0; i < totalDaysSinceQuit; i++) {
        const currentDate = new Date(quit);
        currentDate.setDate(quit.getDate() + i);
        const dateStr = currentDate.toISOString().split("T")[0];

        const dayEntry = entriesSinceQuit.find(
          (entry) => entry.date.split("T")[0] === dateStr
        );

        const cigarettesSmoked = dayEntry?.cigarettes_smoked || 0;
        const actualSmoked = Math.min(cigarettesSmoked, cigarettesPerDay);
        const cigarettesAvoided = cigarettesPerDay - actualSmoked;
        const moneySavedToday = cigarettesAvoided * costPerCigarette;

        totalCigarettesAvoided += cigarettesAvoided;
        totalMoneySaved += moneySavedToday;
        if (actualSmoked === 0) smokeFreedays++;
      }

      const totalExpectedCigarettes = totalDaysSinceQuit * cigarettesPerDay;
      const actualReductionRate =
        totalExpectedCigarettes > 0
          ? (totalCigarettesAvoided / totalExpectedCigarettes) * 100
          : 0;

      const timeBasedImprovement = Math.min(
        (totalDaysSinceQuit / 365) * 20,
        20
      );
      const smokeFreeRateImprovement =
        (smokeFreedays / totalDaysSinceQuit) * 30;
      const reductionRateImprovement = (actualReductionRate / 100) * 50;

      const healthImprovement = Math.min(
        timeBasedImprovement +
          smokeFreeRateImprovement +
          reductionRateImprovement,
        100
      );

      return {
        days: smokeFreedays,
        moneySaved: Math.round(totalMoneySaved),
        healthImprovement: healthImprovement.toFixed(1),
        cigarettesAvoided: Math.round(totalCigarettesAvoided),
        totalDaysSinceQuit,
        actualReductionRate: actualReductionRate.toFixed(1),
        smokeFreeRate: ((smokeFreedays / totalDaysSinceQuit) * 100).toFixed(1),
        averageCigarettesPerDay:
          entriesSinceQuit.length > 0
            ? (
                entriesSinceQuit.reduce(
                  (sum, entry) => sum + (entry.cigarettes_smoked || 0),
                  0
                ) / entriesSinceQuit.length
              ).toFixed(1)
            : (cigarettesPerDay * 0.7).toFixed(1),
        journalDays: entriesSinceQuit.length,
      };
    },
    [progress]
  );

  const recentEntries = useMemo(() => {
    return progress
      .filter((entry) => {
        const entryDate = dayjs(entry.date);
        const daysDiff = dayjs().diff(entryDate, "day");
        return daysDiff >= 0 && daysDiff < 7;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [progress]);

  const recentStats = useMemo(() => {
    if (recentEntries.length === 0) {
      return { smokeFreePercentage: 100, totalCigarettes: 0 };
    }

    const smokeFreeEntries = recentEntries.filter(
      (entry) => entry.cigarettes_smoked === 0
    );
    const totalCigarettes = recentEntries.reduce(
      (sum, entry) => sum + (entry.cigarettes_smoked || 0),
      0
    );

    return {
      smokeFreePercentage: (
        (smokeFreeEntries.length / recentEntries.length) *
        100
      ).toFixed(0),
      totalCigarettes,
    };
  }, [recentEntries]);

  useEffect(() => {
    if (stageId && !loadingRefs.current.fetchStage) {
      fetchStageProgress(stageId);
    }
  }, [stageId, fetchStageProgress]);

  useEffect(() => {
    if (userId && !loadingRefs.current.fetchUserOverall) {
      fetchUserOverallProgress(userId);
    }
  }, [userId, fetchUserOverallProgress]);

  useEffect(() => {
    if (planId && !loadingRefs.current.fetchPlan) {
      fetchPlanProgress(planId);
    }
  }, [planId, fetchPlanProgress]);

  useEffect(() => {
    if (planId && !loadingRefs.current.fetchPlanTotal) {
      fetchPlanTotalStats(planId);
    }
  }, [planId, fetchPlanTotalStats]);

  useEffect(() => {
    if (planId && !loadingRefs.current.fetchPlanSmoking) {
      fetchPlanSmokingStats(planId);
    }
  }, [planId, fetchPlanSmokingStats]);

  return {
    progress,
    overallProgress,
    planProgress,
    stageProgress,
    planTotalStats,
    planSmokingStats,
    recentEntries,
    recentStats,
    loading,
    submitting,
    error,
    fetchProgress,
    fetchUserOverallProgress,
    fetchPlanProgress,
    fetchStageProgress,
    fetchPlanTotalStats,
    fetchPlanSmokingStats,
    createProgressEntry,
    updateProgressEntry,
    deleteProgressEntry,
    calculateStats,
    clearError: () => setError(null),
    refreshProgress: () => {
      if (stageId) fetchStageProgress(stageId);
      else fetchProgress();
    },
  };
};

// Hook chính để quản lý data và logic của progress cho coach
export const useProgressData = () => {
  const [users, setUsers] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [healthStatusFilter, setHealthStatusFilter] = useState(null);

  // Fetch danh sách user của coach
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await QuitPlanService.coach.getMyUsers();
      const usersWithKeys = (response || []).map((user, index) => ({
        ...user,
        key: user._id || user.user_id || `user-${index}`,
      }));
      setUsers(usersWithKeys);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách user:", err);
      message.error("Không thể lấy danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch progress data của tất cả users
  const fetchProgressData = useCallback(async () => {
    if (users.length === 0) return;

    setLoading(true);
    try {
      const response = await getAllProgress();
      const userIds = users.map((user) => user.user_id || user._id);
      const filteredProgress = (response || []).filter((progress) =>
        userIds.includes(progress.user_id?._id || progress.user_id)
      );
      setProgressData(filteredProgress);
    } catch (err) {
      console.error("Lỗi khi lấy tiến độ:", err);
      message.error("Không thể lấy dữ liệu tiến độ");
    } finally {
      setLoading(false);
    }
  }, [users]);

  // Filter progress data theo các điều kiện
  const filteredProgressData = useMemo(() => {
    let filtered = progressData;

    if (selectedUser) {
      filtered = filtered.filter(
        (progress) =>
          (progress.user_id?._id || progress.user_id) === selectedUser
      );
    }

    if (dateRange && dateRange.length === 2) {
      filtered = filtered.filter((progress) => {
        const progressDate = dayjs(progress.date);
        return (
          progressDate.isAfter(dateRange[0]) &&
          progressDate.isBefore(dateRange[1])
        );
      });
    }

    if (healthStatusFilter) {
      filtered = filtered.filter(
        (progress) => progress.health_status === healthStatusFilter
      );
    }

    return filtered;
  }, [progressData, selectedUser, dateRange, healthStatusFilter]);

  // Handle chọn user
  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };

  // Handle refresh data
  const handleRefresh = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  // Initial data load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  return {
    users,
    progressData,
    filteredProgressData,
    loading,
    selectedUser,
    dateRange,
    healthStatusFilter,
    setDateRange,
    setHealthStatusFilter,
    handleUserSelect,
    handleRefresh,
  };
};

// Hook để tính toán thống kê tổng quan
export const useOverallStats = (filteredData) => {
  return useMemo(() => {
    const totalSmokeFreeDays = filteredData.filter(
      (p) => p.cigarettes_smoked === 0
    ).length;

    const totalMoneySaved = filteredData.reduce(
      (sum, p) => sum + (p.money_saved || 0),
      0
    );

    const totalCigarettesSmoked = filteredData.reduce(
      (sum, p) => sum + (p.cigarettes_smoked || 0),
      0
    );

    const averageCigarettes =
      filteredData.length > 0 ? totalCigarettesSmoked / filteredData.length : 0;

    const smokeFreeRate =
      filteredData.length > 0
        ? (totalSmokeFreeDays / filteredData.length) * 100
        : 0;

    const uniqueUsers = new Set(
      filteredData.map((p) => p.user_id?._id || p.user_id)
    ).size;

    return {
      totalSmokeFreeDays,
      totalMoneySaved,
      averageCigarettes: Math.round(averageCigarettes * 10) / 10,
      totalRecords: filteredData.length,
      smokeFreeRate: Math.round(smokeFreeRate * 10) / 10,
      uniqueUsers,
    };
  }, [filteredData]);
};

// Hook để tính toán thống kê user cụ thể
export const useUserStats = (selectedUser, filteredData) => {
  return useMemo(() => {
    if (!selectedUser || filteredData.length === 0) {
      return null;
    }

    const userProgressData = filteredData.filter(
      (progress) => (progress.user_id?._id || progress.user_id) === selectedUser
    );

    if (userProgressData.length === 0) {
      return {
        total_smoke_free_days: 0,
        total_money_saved: 0,
        total_cigarettes_saved: 0,
        total_records: 0,
        average_cigarettes_per_day: 0,
      };
    }

    const smokeFreeData = userProgressData.filter(
      (p) => p.cigarettes_smoked === 0
    );

    const totalMoneySaved = userProgressData.reduce(
      (sum, p) => sum + (p.money_saved || 0),
      0
    );

    const totalCigarettesSmoked = userProgressData.reduce(
      (sum, p) => sum + (p.cigarettes_smoked || 0),
      0
    );

    const averageCigarettesPerDay =
      userProgressData.length > 0
        ? totalCigarettesSmoked / userProgressData.length
        : 0;

    // Giả định trước khi bỏ thuốc hút 20 điếu/ngày
    const originalCigarettesPerDay = 20;
    const totalCigarettesSaved =
      userProgressData.length * originalCigarettesPerDay -
      totalCigarettesSmoked;

    return {
      total_smoke_free_days: smokeFreeData.length,
      total_money_saved: totalMoneySaved,
      total_cigarettes_saved: Math.max(0, totalCigarettesSaved),
      total_records: userProgressData.length,
      average_cigarettes_per_day: Math.round(averageCigarettesPerDay * 10) / 10,
    };
  }, [selectedUser, filteredData]);
};

export default useProgress;
