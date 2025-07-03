import api from "./api";

const handleResponse = (response) => {
  if (!response || !response.data) return [];
  return Array.isArray(response.data.data)
    ? response.data.data
    : response.data.data || response.data;
};

const QuitPlanService = {
  createQuitPlan: async (planData) => {
    const { data } = await api.post("/quitPlan", planData);
    return data;
  },

  getAllQuitPlans: async () => {
    const response = await api.get("/quitPlan");
    return handleResponse(response);
  },

  getQuitPlanById: async (id) => {
    const { data } = await api.get(`/quitPlan/${id}`);
    const plan = data?.data || data;

    if (!plan) throw new Error("Không tìm thấy kế hoạch bỏ thuốc");

    return {
      _id: plan._id || id,
      name: plan.name || "Kế hoạch không tên",
      reason: plan.reason || "Không có lý do",
      start_date: plan.start_date || plan.createdAt || new Date().toISOString(),
      target_quit_date: plan.target_quit_date || "",
      createdAt: plan.createdAt || "",
      updatedAt: plan.updatedAt || "",
      image: plan.image || "",
      user_id: plan.user_id || null,
      status: plan.status || "draft",
    };
  },

  updateQuitPlan: async (id, planData) => {
    const { data } = await api.put(`/quitPlan/${id}`, planData);
    return data;
  },

  deleteQuitPlan: async (id) => {
    const { data } = await api.delete(`/quitPlan/${id}`);
    return data;
  },

  getQuitPlanByUserId: async (userId) => {
    const response = await api.get(`/quitPlan/user/${userId}`);
    return handleResponse(response);
  },

  getPublicQuitPlans: async () => {
    const response = await api.get("/quitPlan/public");
    return handleResponse(response);
  },

  adoptPublicQuitPlan: async (planId, userData) => {
    const { data } = await api.post(`/quitPlan/user/use/${planId}`, userData);
    return data;
  },

  getMyUsers: async () => {
    const response = await api.get("/quitPlan/my-users");
    return handleResponse(response);
  },

  sendQuitPlanRequest: async (data) => {
    const { data: result } = await api.post("/quitPlan/request", data);
    return result;
  },

  getAllQuitPlanRequests: async () => {
    const response = await api.get("/quitPlan/requests");
    return handleResponse(response);
  },

  getMyQuitPlanRequests: async () => {
    const response = await api.get("/quitPlan/request/mine");
    return handleResponse(response);
  },

  cancelQuitPlanRequest: async (requestId) => {
    const { data } = await api.delete(`/quitPlan/request/${requestId}`);
    return data;
  },

  approveQuitPlanRequest: async (requestId, approvalData) => {
    const { data } = await api.put(
      `/quitPlan/${requestId}/approve`,
      approvalData
    );
    return data;
  },

  rejectQuitPlanRequest: async (requestId, rejectionData) => {
    const { data } = await api.put(
      `/quitPlan/${requestId}/reject`,
      rejectionData
    );
    return data;
  },
};

export default QuitPlanService;
