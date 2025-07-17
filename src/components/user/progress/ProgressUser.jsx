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
  // State for user data
  const [userState, setUserState] = useState({
    userId: null,
    quitPlan: null,
    smokingStatus: null,
    currentStage: null,
    loading: true,
    error: null,
  });

  // Derived state
  const [quitDate, setQuitDate] = useState(null);
  const [cigarettesPerDay, setCigarettesPerDay] = useState(0);
  const [pricePerPack, setPricePerPack] = useState(0);
  const [cigarettesPerPack, setCigarettesPerPack] = useState(20); // Default to 20, but can be updated

  // Get user info from localStorage
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const userId = currentUser?.userId || currentUser?.id || currentUser?._id;

  const {
    progress: entries,
    recentEntries: last7DaysEntries,
    recentStats,
    loading: progressLoading,
    submitting,
    error: progressError,
    createProgressEntry,
    calculateStats,
    clearError,
  } = useProgress(userId, userState.currentStage?._id);

  // Fetch user data
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

      // Fetch quit plan
      const planData = await UserQuitPlanService.getMyQuitPlan();
      if (!planData) {
        setUserState((prev) => ({
          ...prev,
          error: "No approved quit plan found. Please contact your coach.",
          loading: false,
        }));
        return;
      }

      // Fetch smoking status
      const statusData = await SmokingStatusService.getStatus(userId);
      if (!statusData) {
        setUserState((prev) => ({
          ...prev,
          error: "No smoking status found. Please update your profile.",
          loading: false,
        }));
        return;
      }

      // Fetch current stage
      const stages = await UserQuitPlanService.getMyStages(planData._id);
      if (stages.length === 0) {
        setUserState((prev) => ({
          ...prev,
          error: "No stages found in your quit plan.",
          loading: false,
        }));
        return;
      }

      // Find current stage (first incomplete stage or last stage)
      const currentStageData =
        stages.find((stage) => !stage.is_completed) ||
        stages[stages.length - 1];

      // Update all state at once
      setUserState({
        userId,
        quitPlan: planData,
        smokingStatus: statusData,
        currentStage: currentStageData,
        loading: false,
        error: null,
      });

      // Set derived data
      setQuitDate(new Date(planData.start_date));
      setCigarettesPerDay(statusData.cigarettes_per_day);
      setPricePerPack(statusData.cost_per_pack);
      // Use cigarettes_per_pack from smoking status if available, otherwise default to 20
      setCigarettesPerPack(statusData.cigarettes_per_pack || 20);
    } catch (error) {
      console.error("Error fetching user data:", error);
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

  // Calculate stats with memoization
  const stats = useMemo(() => {
    if (!quitDate) return {};

    const calculatedStats = calculateStats(
      quitDate,
      cigarettesPerDay,
      pricePerPack,
      cigarettesPerPack
    );
    return calculatedStats;
  }, [
    quitDate,
    cigarettesPerDay,
    pricePerPack,
    cigarettesPerPack,
    calculateStats,
  ]);

  // Handle journal submission
  const handleSubmit = useCallback(
    async (entry, requestMethod) => {
      if (!userState.currentStage || !userId) {
        return;
      }

      try {
        clearError();
        const progressData = {
          date: entry.date,
          cigarettes_smoked: entry.cigarettes,
          health_status: entry.symptoms || "",
          stage_id: userState.currentStage._id,
          user_id: userId,
          isUpdate: entry.isUpdate,
          entryId: entry.entryId,
        };

        console.log("ProgressUser handleSubmit:", {
          requestMethod,
          isUpdate: entry.isUpdate,
          entryId: entry.entryId,
          date: entry.date,
        });

        await createProgressEntry(progressData);
      } catch (error) {
        // Optionally handle error, e.g. show notification
        console.error("Progress submission error:", error);
      }
    },
    [userState.currentStage, userId, createProgressEntry, clearError]
  );

  // Auto-clear progress errors
  useEffect(() => {
    if (progressError) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [progressError, clearError]);

  // Loading state
  if (userState.loading) {
    return (
      <div className="w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[50vh]">
            <Spin size="large" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
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

  // No data state
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

  return (
    <div className="w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <ProgressHeader quitDate={quitDate} stats={stats} />

        <JournalSection
          entries={entries}
          currentStage={userState.currentStage}
          onSubmit={handleSubmit}
          isLoading={progressLoading || submitting}
          smokingStatus={{
            cigarettesPerDay,
            costPerPack: pricePerPack,
            cigarettesPerPack,
          }}
        />

        {/* 7-day summary card */}
        {stats.days >= 7 && last7DaysEntries?.length > 0 && (
          <Card
            title={
              <div className="flex items-center">
                <TrendingUp className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
                  Tóm Tắt 7 Ngày Gần Nhất
                </h2>
              </div>
            }
            className="bg-gradient-to-br from-white to-purple-50 border border-purple-200 text-purple-900 mt-12 shadow-md mb-12 rounded-xl overflow-hidden"
            styles={{
              header: {
                borderBottom: "1px solid #e5d8fd",
                padding: "20px 24px",
                backgroundColor: "white",
              },
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
              <div className="text-center p-6 bg-gradient-to-b from-white to-green-50 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircleOutlined className="text-2xl text-green-500" />
                </div>
                <h4 className="text-green-800 font-medium mb-3 text-lg">
                  Tỷ lệ không hút thuốc
                </h4>
                <p className="text-3xl font-bold text-green-600">
                  {Math.max(
                    0,
                    Math.min(100, recentStats?.smokeFreePercentage || 0)
                  )}
                  <span className="text-green-500 text-lg ml-1">%</span>
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Trong 7 ngày gần nhất
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-b from-white to-blue-50 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <TrendingUp className="text-2xl text-blue-500" />
                </div>
                <h4 className="text-blue-800 font-medium mb-3 text-lg">
                  Tổng điếu đã hút
                </h4>
                <p className="text-3xl font-bold text-blue-600">
                  {Math.max(0, recentStats?.totalCigarettes || 0)}
                  <span className="text-blue-500 text-lg ml-1">điếu</span>
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Trong 7 ngày gần nhất
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-b from-white to-purple-50 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <CheckCircleOutlined className="text-2xl text-purple-500" />
                </div>
                <h4 className="text-purple-800 font-medium mb-3 text-lg">
                  Tỷ lệ giảm hút thuốc
                </h4>
                <p className="text-3xl font-bold text-purple-600">
                  {Math.max(
                    0,
                    Math.min(100, parseFloat(stats?.actualReductionRate || 0))
                  )}
                  <span className="text-purple-500 text-lg ml-1">%</span>
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  So với thói quen ban đầu ({last7DaysEntries.length} ngày ghi
                  nhật ký)
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Error display */}
        {progressError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{progressError}</p>
            <button
              onClick={clearError}
              className="mt-2 text-sm text-red-500 underline hover:text-red-700"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressUser;
