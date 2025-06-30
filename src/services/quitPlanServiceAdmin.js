import api from "./api";

const QuitPlanServiceAdmin = {
  getAllQuitPlans: async () => {
    const response = await api.get("/quitPlan");
    return response.data;
  },
  createQuitPlan: async (data) => {
    const response = await api.post("/quitPlan", data);
    return response.data;
  },
  updateQuitPlan: async (id, data) => {
    const response = await api.put(`/quitPlan/${id}`, data);
    return response.data;
  },
  deleteQuitPlan: async (id) => {
    const response = await api.delete(`/quitPlan/${id}`);
    return response.data;
  },
};

export default QuitPlanServiceAdmin;
