import { useState, useEffect } from "react";
import { fetchAllQuitPlansAPI, getQuitPlanByIdAPI, getStagesByPlanIdAPI } from "~/services/quitPlanService";


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
      const response = await fetchAllQuitPlansAPI();

      console.log("QuitPlan API response:", response.data);

      if (Array.isArray(response.data)) {
        setQuitPlans(response.data);
      } else if (Array.isArray(response.data.data)) {
        setQuitPlans(response.data.data);
      } else {
        setQuitPlans([]);
      }
    } catch (err) {
      console.error("Error fetching quit plans:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getQuitPlanById = async (id) => {
    try {
      setLoading(true);
      const response = await getQuitPlanByIdAPI(id);
      console.log("Raw QuitPlan response:", response.data);

      const data = response.data?.data || response.data;

      if (!data) {
        throw new Error("Không tìm thấy kế hoạch bỏ thuốc");
      }

      const formattedPlan = {
        _id: data._id || id,
        name: data.name || "Kế hoạch không tên",
        reason: data.reason || "Không có lý do",
        start_date: data.start_date || data.createdAt || new Date().toISOString(),
        target_quit_date: data.target_quit_date || "",
        createdAt: data.createdAt || "",
        updatedAt: data.updatedAt || "",
        image: data.image || data.banner || "/placeholder-plan.png",
        user_id: data.user_id || null,
        status: data.status || "draft",
      };

      return formattedPlan;
    } catch (error) {
      if (error.response?.status === 403) {
        setError("Bạn không có quyền truy cập kế hoạch này");
      } else {
        setError(error.message || "Có lỗi xảy ra khi tải kế hoạch");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getStagesByPlanId = async (planId) => {
    try {
      const response = await getStagesByPlanIdAPI(planId);
      console.log("Stages by Plan response:", response.data);

      return Array.isArray(response.data?.data)
        ? response.data.data
        : response.data;
    } catch (error) {
      console.error("Lỗi khi lấy stages của kế hoạch:", error);
      throw error;
    }
  };

  return {
    quitPlans,
    loading,
    error,
    fetchQuitPlans,
    getQuitPlanById,
    getStagesByPlanId,
  };
}
