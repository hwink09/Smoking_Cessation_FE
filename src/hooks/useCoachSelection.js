import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { message } from "antd";
import { useQuitPlanData } from "~/hooks/useQuitPlanData";
import useCoachData from "~/hooks/useCoachData";
import { useAuth } from "~/hooks/useAuth";
import api from "~/services/api";
import {
  FullPageLoadingSkeleton,
  FullPageErrorCard,
} from "~/components/common/QuitPlanComponents";

/**
 * Custom hook to manage all the logic for coach selection and quit plan management
 */
export const useCoachSelection = () => {
  const { currentUser } = useAuth();
  const { getAllCoaches } = useCoachData();
  const { getQuitPlanByUserId, sendQuitPlanRequest, getMyQuitPlanRequests } =
    useQuitPlanData();

  const [selectedCoach, setSelectedCoach] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [userQuitPlan, setUserQuitPlan] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userId = useMemo(
    () => currentUser?.userId || currentUser?.id || currentUser?._id,
    [currentUser]
  );

  // Store functions in ref to avoid dependency issues
  const serviceRef = useRef({
    getAllCoaches,
    getQuitPlanByUserId,
    getMyQuitPlanRequests,
  });
  serviceRef.current = {
    getAllCoaches,
    getQuitPlanByUserId,
    getMyQuitPlanRequests,
  };

  const refreshDataRef = useRef();

  // Helper function to check if a quit plan has stages/tasks
  const checkPlanHasStages = useCallback(async (planId) => {
    try {
      const response = await api.get(`/stages/plan/${planId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Handle different response structures
      let stages = [];
      if (Array.isArray(response.data)) {
        stages = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        stages = response.data.data;
      } else if (response.data && typeof response.data === "object") {
        stages = response.data.stages || response.data.results || [];
      }

      return stages.length > 0;
    } catch (error) {
      if (error.response?.status === 403) {
        return true;
      }
      return false;
    }
  }, []);

  // Refresh function
  const refreshData = useCallback(async () => {
    if (!userId || isRefreshing) return;

    setIsRefreshing(true);
    setLoading(true);
    try {
      const [coachList, quitPlans, requests] = await Promise.all([
        serviceRef.current.getAllCoaches(),
        serviceRef.current.getQuitPlanByUserId(userId),
        serviceRef.current.getMyQuitPlanRequests(),
      ]);

      setCoaches(coachList || []);

      // Check for approved quit plan
      let approvedPlan = Array.isArray(quitPlans)
        ? quitPlans.find((plan) => plan.status === "approved" || plan.coach_id)
        : quitPlans?.status === "approved" || quitPlans?.coach_id
        ? quitPlans
        : null;

      // Check if approved plan has stages
      if (approvedPlan) {
        const hasStages = await checkPlanHasStages(approvedPlan._id);
        if (!hasStages) {
          approvedPlan = null;
        }
      }

      setUserQuitPlan(approvedPlan);

      // Check for pending request
      const pendingReq = Array.isArray(requests)
        ? requests.find(
            (req) =>
              req.status === "pending" ||
              (req.status === "approved" && !approvedPlan) ||
              req.status === "created"
          )
        : requests?.status === "pending" ||
          (requests?.status === "approved" && !approvedPlan) ||
          requests?.status === "created"
        ? requests
        : null;

      setPendingRequest(pendingReq);
      setError(null);
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi tải dữ liệu"
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [userId, isRefreshing, checkPlanHasStages]);

  refreshDataRef.current = refreshData;

  // Initial data fetch
  useEffect(() => {
    if (!userId) return setLoading(false);

    let isCanceled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [coachList, quitPlans, requests] = await Promise.all([
          serviceRef.current.getAllCoaches(),
          serviceRef.current.getQuitPlanByUserId(userId),
          serviceRef.current.getMyQuitPlanRequests(),
        ]);

        if (!isCanceled) {
          setCoaches(coachList || []);

          let approvedPlan = Array.isArray(quitPlans)
            ? quitPlans.find(
                (plan) => plan.status === "approved" || plan.coach_id
              )
            : quitPlans?.status === "approved" || quitPlans?.coach_id
            ? quitPlans
            : null;

          if (approvedPlan) {
            const hasStages = await checkPlanHasStages(approvedPlan._id);
            if (!hasStages) {
              approvedPlan = null;
            }
          }

          setUserQuitPlan(approvedPlan);

          const pendingReq = Array.isArray(requests)
            ? requests.find(
                (req) =>
                  req.status === "pending" ||
                  (req.status === "approved" && !approvedPlan) ||
                  req.status === "created"
              )
            : requests?.status === "pending" ||
              (requests?.status === "approved" && !approvedPlan) ||
              requests?.status === "created"
            ? requests
            : null;
          setPendingRequest(pendingReq);
        }
      } catch (err) {
        if (!isCanceled)
          setError(
            err?.response?.data?.message || err.message || "Lỗi tải dữ liệu"
          );
      } finally {
        if (!isCanceled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isCanceled = true;
    };
  }, [userId, checkPlanHasStages]);

  // Auto-refresh for pending requests
  useEffect(() => {
    if (!userId) return;
    if (!pendingRequest?._id || userQuitPlan?._id) return;

    const interval = setInterval(() => {
      if (!isRefreshing) {
        refreshDataRef.current?.();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [userId, pendingRequest, userQuitPlan, isRefreshing]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (formData) => {
      const coachId =
        selectedCoach?.coach_id?._id ||
        selectedCoach?.coach_id ||
        selectedCoach?._id;
      if (!coachId) return message.error("Không xác định được coach!");

      try {
        const response = await sendQuitPlanRequest({
          coach_id: coachId,
          ...formData,
        });
        message.success("Gửi yêu cầu thành công!");
        setSelectedCoach(null);

        // Immediately set pending request to show waiting interface
        setPendingRequest({
          _id: response._id || Date.now(),
          status: "pending",
          coach_id: selectedCoach?.coach_id || selectedCoach,
          ...formData,
        });

        // Refresh data to get actual pending request from server
        await refreshDataRef.current?.();
      } catch (err) {
        message.error("Thất bại: " + (err?.message || ""));
      }
    },
    [selectedCoach, sendQuitPlanRequest]
  );

  return {
    // State
    selectedCoach,
    coaches,
    userQuitPlan,
    pendingRequest,
    loading,
    error,
    isRefreshing,

    // Actions
    setSelectedCoach,
    handleSubmit,
    refreshData,
  };
};
