import { useState, useEffect } from "react";
import {
  fetchQuitPlansAPI,
  createQuitPlanAPI,
  getQuitPlanByIdAPI,
  getStagesByPlanIdAPI,
  sendQuitPlanRequestAPI,
  getMyQuitPlanRequestsAPI,
} from "../services/quitPlanService";

export function useQuitPlanData() {
  const [quitPlans, setQuitPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuitPlans();
  }, []);

  const fetchQuitPlans = async () => {
    try {
      setLoading(true);
      const data = await fetchQuitPlansAPI();
      setQuitPlans(data);
    } catch (err) {
      console.error("Error fetching quit plans:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createQuitPlan = async (planData) => {
    try {
      setLoading(true);
      await createQuitPlanAPI(planData);
      await fetchQuitPlans();
    } catch (err) {
      setError(err.message || "Có lỗi khi tạo kế hoạch");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getQuitPlanById = async (id) => {
    try {
      setLoading(true);
      return await getQuitPlanByIdAPI(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStagesByPlanId = async (planId) => {
    try {
      return await getStagesByPlanIdAPI(planId);
    } catch (err) {
      console.error("Lỗi khi lấy stages:", err);
      throw err;
    }
  };

  const sendQuitPlanRequest = async (data) => {
    try {
      return await sendQuitPlanRequestAPI(data);
    } catch (err) {
      setError(err.message || "Không thể gửi yêu cầu kế hoạch");
      throw err;
    }
  };

  const getMyQuitPlanRequests = async () => {
    try {
      return await getMyQuitPlanRequestsAPI();
    } catch (err) {
      console.error("Lỗi khi lấy danh sách yêu cầu:", err);
      throw err;
    }
  };

  return {
    quitPlans,
    loading,
    error,
    fetchQuitPlans,
    getQuitPlanById,
    getStagesByPlanId,
    createQuitPlan,
    sendQuitPlanRequest,
    getMyQuitPlanRequests,
  };
}
