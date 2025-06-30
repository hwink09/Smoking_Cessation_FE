import api from "./api";

const StageService = {
  getAllStages: async () => {
    const response = await api.get("/stages");
    return response.data;
  },
  createStage: async (data) => {
    const response = await api.post("/stages", data);
    return response.data;
  },
  updateStage: async (id, data) => {
    const response = await api.put(`/stages/${id}`, data);
    return response.data;
  },
  deleteStage: async (id) => {
    const response = await api.delete(`/stages/${id}`);
    return response.data;
  },
};

export default StageService;
