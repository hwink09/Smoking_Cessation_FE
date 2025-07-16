import api from "./api";

const handleResponse = (response) => {
  if (!response || !response.data) return [];
  return Array.isArray(response.data)
    ? response.data
    : response.data.data || response.data;
};

const handleQuitPlanResponse = (response, id) => {
  const plan = response.data?.data || response.data;

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
    coach_id: plan.coach_id || null,
    status: plan.status || "draft",
    is_public: plan.is_public || false,
  };
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
    const response = await api.get(`/quitPlan/${id}`);
    return handleQuitPlanResponse(response, id);
  },

  updateQuitPlan: async (id, planData) => {
    const { data } = await api.put(`/quitPlan/${id}`, planData);
    return data;
  },

  deleteQuitPlan: async (id) => {
    const { data } = await api.delete(`/quitPlan/${id}`);
    return data;
  },

  // ============ USER-SPECIFIC OPERATIONS ============

  getQuitPlanByUserId: async (userId) => {
    const response = await api.get(`/quitPlan/user/${userId}`);
    return handleResponse(response);
  },

  getMyUsers: async () => {
    const response = await api.get("/quitPlan/my-users");
    return handleResponse(response);
  },

  // ============ PUBLIC PLAN OPERATIONS ============

  getPublicQuitPlans: async () => {
    const response = await api.get("/quitPlan/public");
    return handleResponse(response);
  },

  createPublicQuitPlan: async (planData) => {
    const { data } = await api.post("/quitPlan/public", planData);
    return data;
  },

  togglePlanPublicStatus: async (planId) => {
    const { data } = await api.put(`/quitPlan/${planId}/toggle-public`);
    return data;
  },

  adoptPublicQuitPlan: async (planId, userData) => {
    const { data } = await api.post(`/quitPlan/user/use/${planId}`, userData);
    return data;
  },

  // ============ QUIT PLAN REQUEST OPERATIONS ============

  sendQuitPlanRequest: async (requestData) => {
    const { data } = await api.post("/quitPlan/request", requestData);
    return data;
  },

  getAllQuitPlanRequests: async () => {
    const response = await api.get("/quitPlan/requests");
    return handleResponse(response);
  },

  getMyQuitPlanRequests: async () => {
    const response = await api.get("/quitPlan/request/mine");
    return handleResponse(response);
  },

  getRequestsByCoachId: async (coachId) => {
    const response = await api.get(`/quitPlan/requests/my-coach/${coachId}`);
    return handleResponse(response);
  },

  cancelQuitPlanRequest: async (requestId) => {
    const { data } = await api.delete(`/quitPlan/request/${requestId}`);
    return data;
  },

  // ============ REQUEST APPROVAL OPERATIONS ============

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

  // ============ ROLE-BASED CONVENIENCE METHODS ============
  admin: {
    /**
     * Get all quit plans (Admin only)
     */
    getAllPlans: async () => {
      return await QuitPlanService.getAllQuitPlans();
    },

    createPlan: async (planData) => {
      return await QuitPlanService.createQuitPlan(planData);
    },

    updatePlan: async (id, planData) => {
      return await QuitPlanService.updateQuitPlan(id, planData);
    },

    deletePlan: async (id) => {
      return await QuitPlanService.deleteQuitPlan(id);
    },

    createPublicPlan: async (planData) => {
      return await QuitPlanService.createPublicQuitPlan(planData);
    },

    togglePublicStatus: async (planId) => {
      return await QuitPlanService.togglePlanPublicStatus(planId);
    },

    getAllRequests: async () => {
      return await QuitPlanService.getAllQuitPlanRequests();
    },

    approveRequest: async (requestId, approvalData) => {
      return await QuitPlanService.approveQuitPlanRequest(
        requestId,
        approvalData
      );
    },

    rejectRequest: async (requestId, rejectionData) => {
      return await QuitPlanService.rejectQuitPlanRequest(
        requestId,
        rejectionData
      );
    },
  },

  coach: {
    getAllPlans: async () => {
      return await QuitPlanService.getAllQuitPlans();
    },

    createPlan: async (planData) => {
      return await QuitPlanService.createQuitPlan(planData);
    },

    updatePlan: async (id, planData) => {
      return await QuitPlanService.updateQuitPlan(id, planData);
    },

    deletePlan: async (id) => {
      return await QuitPlanService.deleteQuitPlan(id);
    },

    getMyUsers: async () => {
      return await QuitPlanService.getMyUsers();
    },

    getMyRequests: async (coachId) => {
      return await QuitPlanService.getRequestsByCoachId(coachId);
    },

    approveRequest: async (requestId, approvalData) => {
      return await QuitPlanService.approveQuitPlanRequest(
        requestId,
        approvalData
      );
    },

    rejectRequest: async (requestId, rejectionData) => {
      return await QuitPlanService.rejectQuitPlanRequest(
        requestId,
        rejectionData
      );
    },
  },

  /**
   * Methods for User role
   */
  user: {
    getPublicPlans: async () => {
      return await QuitPlanService.getPublicQuitPlans();
    },

    adoptPublicPlan: async (planId, userData) => {
      return await QuitPlanService.adoptPublicQuitPlan(planId, userData);
    },

    sendRequest: async (requestData) => {
      return await QuitPlanService.sendQuitPlanRequest(requestData);
    },

    getMyRequests: async () => {
      return await QuitPlanService.getMyQuitPlanRequests();
    },

    cancelRequest: async (requestId) => {
      return await QuitPlanService.cancelQuitPlanRequest(requestId);
    },

    getMyPlans: async (userId) => {
      return await QuitPlanService.getQuitPlanByUserId(userId);
    },
  },
};

export default QuitPlanService;
