import api from "./api";

// Lấy danh sách tất cả kế hoạch bỏ thuốc
export const fetchQuitPlansAPI = async () => {
  const response = await api.get("/quitPlan");
  return Array.isArray(response.data)
    ? response.data
    : response.data?.data || [];
};

// Tạo kế hoạch mới
export const createQuitPlanAPI = async (planData) => {
  const response = await api.post("/quitPlan", planData);
  return response.data;
};

// Lấy kế hoạch theo ID
export const getQuitPlanByIdAPI = async (id) => {
  const response = await api.get(`/quitPlan/${id}`);
  const data = response.data?.data || response.data;
  if (!data) throw new Error("Không tìm thấy kế hoạch bỏ thuốc");

  return {
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
};

// Lấy danh sách các giai đoạn theo kế hoạch
export const getStagesByPlanIdAPI = async (planId) => {
  const response = await api.get(`/stages/plan/${planId}`);
  return Array.isArray(response.data?.data)
    ? response.data.data
    : response.data;
};

// Gửi yêu cầu đến huấn luyện viên
export const sendQuitPlanRequestAPI = async (data) => {
  const response = await api.post("/quitPlan/request", data);
  return response.data;
};

// Lấy danh sách yêu cầu của chính user
export const getMyQuitPlanRequestsAPI = async () => {
  const response = await api.get("/quitPlan/request/mine");
  return Array.isArray(response.data?.data)
    ? response.data.data
    : response.data;
};

// PUT /api/quitPlan/{id} - Update Quit Plan By Id
export const updateQuitPlanAPI = async (id, planData) => {
  const response = await api.put(`/quitPlan/${id}`, planData);
  return response.data;
};

// DELETE /api/quitPlan/{id} - Delete Quit Plan By Id
export const deleteQuitPlanAPI = async (id) => {
  const response = await api.delete(`/quitPlan/${id}`);
  return response.data;
};

// GET /api/quitPlan/user/{id} - Get Quit Plan By User Id
export const getQuitPlanByUserIdAPI = async (userId) => {
  const response = await api.get(`/quitPlan/user/${userId}`);
  return Array.isArray(response.data?.data)
    ? response.data.data
    : response.data;
};

// GET /api/quitPlan/public - Get Quit Plan Public
export const getPublicQuitPlansAPI = async () => {
  const response = await api.get("/quitPlan/public");
  return Array.isArray(response.data?.data)
    ? response.data.data
    : response.data;
};

// POST /api/quitPlan/user/use/{id} - Use QuitPlan Public to Private
export const usePublicQuitPlanAPI = async (planId, userData) => {
  const response = await api.post(`/quitPlan/user/use/${planId}`, userData);
  return response.data;
};

// GET /api/quitPlan/my-users - Get My Users by Coach
export const getMyUsersAPI = async () => {
  const response = await api.get("/quitPlan/my-users");
  return Array.isArray(response.data?.data)
    ? response.data.data
    : response.data;
};

// GET /api/quitPlan/requests - Get all Request Quit Plan
export const getAllQuitPlanRequestsAPI = async () => {
  const response = await api.get("/quitPlan/requests");
  return Array.isArray(response.data?.data)
    ? response.data.data
    : response.data;
};

// DELETE /api/quitPlan/request/{id} - Cancel Quitplan Request
export const cancelQuitPlanRequestAPI = async (requestId) => {
  const response = await api.delete(`/quitPlan/request/${requestId}`);
  return response.data;
};

// PUT /api/quitPlan/{id}/approve - Approved Quit Plan Request
export const approveQuitPlanRequestAPI = async (requestId, approvalData) => {
  const response = await api.put(
    `/quitPlan/${requestId}/approve`,
    approvalData
  );
  return response.data;
};

// PUT /api/quitPlan/{id}/reject - Reject Quit Plan Request
export const rejectQuitPlanRequestAPI = async (requestId, rejectionData) => {
  const response = await api.put(
    `/quitPlan/${requestId}/reject`,
    rejectionData
  );
  return response.data;
};
