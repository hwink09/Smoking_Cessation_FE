import React, { useState, useEffect, useMemo, useCallback } from "react";
import ProgressHeader from "./ProgressHeader";
import JournalSection from "./JournalSection";
import useProgress from "~/hooks/useProgress";
import UserQuitPlanService from "~/services/userQuitPlanService";
import SmokingStatusService from "~/services/SmokingStatusService";
import { Card, Spin, Alert } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { TrendingUp } from "lucide-react";

function ProgressUser() {
  // Initial state
  const [userState, setUserState] = useState({
    userId: null,
    quitPlan: null,
    smokingStatus: null,
    currentStage: null,
    loading: true,
    error: null,
  });

  const [quitDate, setQuitDate] = useState(null);
  const [cigarettesPerDay, setCigarettesPerDay] = useState(0);
  const [pricePerPack, setPricePerPack] = useState(0);
  const [cigarettesPerPack, setCigarettesPerPack] = useState(20);

  // Get userId from localStorage
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);
  const userId = currentUser?.userId || currentUser?.id || currentUser?._id;

  // Custom hook: Progress logic
  const {
    progress: entries,
    planTotalStats,
    planSmokingStats,
    recentEntries: last7DaysEntries,
    recentStats,
    loading: progressLoading,
    submitting,
    error: progressError,
    createProgressEntry,
    calculateStats,
    clearError,
    fetchPlanTotalStats,
    fetchPlanSmokingStats,
  } = useProgress(userId, userState.currentStage?._id, userState.quitPlan?._id);

  // Fetch user data: quitPlan + smokingStatus + currentStage
  const fetchUserData = useCallback(async () => {
    if (!userId) {
      setUserState((prev) => ({
        ...prev,
        error: "User not found. Please login again.",
        loading: false,
      }));
      return;
    }

    try {
      setUserState((prev) => ({ ...prev, loading: true, error: null }));

      const planData = await UserQuitPlanService.getMyQuitPlan();
      if (!planData)
        return setUserState((prev) => ({
          ...prev,
          error: "No approved quit plan found. Please contact your coach.",
          loading: false,
        }));

      const statusData = await SmokingStatusService.getStatus(userId);
      if (!statusData)
        return setUserState((prev) => ({
          ...prev,
          error: "No smoking status found. Please update your profile.",
          loading: false,
        }));

      const stages = await UserQuitPlanService.getMyStages(planData._id);
      if (!stages.length)
        return setUserState((prev) => ({
          ...prev,
          error: "No stages found in your quit plan.",
          loading: false,
        }));

      const currentStageData =
        stages.find((stage) => !stage.is_completed) || stages.at(-1);

      setUserState({
        userId,
        quitPlan: planData,
        smokingStatus: statusData,
        currentStage: currentStageData,
        loading: false,
        error: null,
      });

      // Set additional state
      setQuitDate(new Date(planData.start_date));
      setCigarettesPerDay(statusData.cigarettes_per_day);
      setPricePerPack(statusData.cost_per_pack);
      setCigarettesPerPack(statusData.cigarettes_per_pack || 20);
    } catch {
      setUserState((prev) => ({
        ...prev,
        error: "Failed to load user data. Please try again.",
        loading: false,
      }));
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (userState.quitPlan?._id) {
      fetchPlanTotalStats(userState.quitPlan._id);
      fetchPlanSmokingStats(userState.quitPlan._id);
    }
  }, [userState.quitPlan?._id, fetchPlanTotalStats, fetchPlanSmokingStats]);

  const stats = useMemo(() => {
    if (!quitDate) return {};
    return calculateStats(
      quitDate,
      cigarettesPerDay,
      pricePerPack,
      cigarettesPerPack
    );
  }, [
    quitDate,
    cigarettesPerDay,
    pricePerPack,
    cigarettesPerPack,
    calculateStats,
  ]);

  const handleSubmit = useCallback(
    async (entry) => {
      if (!userState.currentStage || !userId) return;

      try {
        clearError();
        await createProgressEntry({
          date: entry.date,
          cigarettes_smoked: entry.cigarettes,
          health_status: entry.symptoms || "",
          stage_id: userState.currentStage._id,
          user_id: userId,
          isUpdate: entry.isUpdate,
          entryId: entry.entryId,
        });
      } catch (error) {
        console.error("Progress submission error:", error);
      }
    },
    [userState.currentStage, userId, createProgressEntry, clearError]
  );

  useEffect(() => {
    if (progressError) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [progressError, clearError]);

  // Loading
  if (userState.loading) {
    return (
      <div className="w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 flex justify-center items-center min-h-[50vh]">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  // Error
  if (userState.error) {
    return (
      <div className="w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Alert
            message="Lỗi tải dữ liệu"
            description={userState.error}
            type="error"
            showIcon
            className="mb-4"
            action={
              <button
                onClick={fetchUserData}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Thử lại
              </button>
            }
          />
        </div>
      </div>
    );
  }

  // Incomplete data
  if (
    !userState.quitPlan ||
    !userState.smokingStatus ||
    !userState.currentStage
  ) {
    return (
      <div className="w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Alert
            message="Dữ liệu chưa đầy đủ"
            description="Vui lòng hoàn thành thiết lập quit plan và thông tin hút thuốc trước khi sử dụng tính năng này."
            type="warning"
            showIcon
            className="mb-4"
          />
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <ProgressHeader
          quitDate={quitDate}
          stats={stats}
          planTotalStats={planTotalStats}
          planSmokingStats={planSmokingStats}
        />

        <JournalSection
          entries={entries}
          currentStage={userState.currentStage}
          planTotalStats={planTotalStats}
          onSubmit={handleSubmit}
          isLoading={progressLoading || submitting}
          smokingStatus={{
            cigarettesPerDay,
            costPerPack: pricePerPack,
            cigarettesPerPack,
          }}
        />
      </div>
    </div>
  );
}

// Subcomponent cho từng thống kê
const StatCard = ({ title, value, unit, description, color, Icon }) => (
  <div
    className={`text-center p-6 bg-gradient-to-b from-white to-${color}-50 rounded-xl border border-${color}-200 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1`}
  >
    <div
      className={`inline-flex items-center justify-center w-16 h-16 bg-${color}-100 rounded-full mb-4`}
    >
      <Icon className={`text-2xl text-${color}-500`} />
    </div>
    <h4 className={`text-${color}-800 font-medium mb-3 text-lg`}>{title}</h4>
    <p className={`text-3xl font-bold text-${color}-600`}>
      {value}
      <span className={`text-${color}-500 text-lg ml-1`}>{unit}</span>
    </p>
    <p className="text-xs text-gray-600 mt-2">{description}</p>
  </div>
);

export default ProgressUser;
