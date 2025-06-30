import api from "./api";

const StageService = {
  // GET /api/stages/plan/{id} - Get Stages By Plan Id
  getStagesByPlanId: async (planId) => {
    try {
      const response = await api.get(`/stages/plan/${planId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stages for plan ${planId}:`, error);
      throw error;
    }
  },

  // GET /api/stages - Get All Stages
  getAllStages: async () => {
    try {
      const response = await api.get("/stages");
      return response.data;
    } catch (error) {
      console.error("Error fetching all stages:", error);
      throw error;
    }
  },

  // GET /api/stages/{id} - Get stage by Id
  getStageById: async (id) => {
    try {
      const response = await api.get(`/stages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stage ${id}:`, error);
      throw error;
    }
  },

  // POST /api/stages - Create Stage
  createStage: async (data) => {
    try {
      const response = await api.post("/stages", data);
      return response.data;
    } catch (error) {
      console.error("Error creating stage:", error);
      throw error;
    }
  },

  // PUT /api/stages/{id} - Update stage
  updateStage: async (id, data) => {
    try {
      const response = await api.put(`/stages/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating stage ${id}:`, error);
      throw error;
    }
  },

  // DELETE /api/stages/{id} - Delete Stage
  deleteStage: async (id) => {
    try {
      const response = await api.delete(`/stages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting stage ${id}:`, error);
      throw error;
    }
  },
};

export default StageService;
