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
