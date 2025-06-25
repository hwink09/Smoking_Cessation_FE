import api from "./api";


const SmokingStatusService = {
  createStatus: async (userId, data) => {
    try {
      const response = await api.post(`/smoking-status/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating smoking status:", error);
      throw error;
    }
  },

  getStatus: async (userId) => {
    try {
      const response = await api.get(`/smoking-status/${userId}`);
      return response.data.smokingStatus;
    } catch (error) {
      console.error("Error fetching smoking status:", userId);
      throw error;
    }
  },

  updateStatus: async (userId, data) => {
    try {
      const response = await api.put(`/smoking-status/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating smoking status:", error);
      throw error;
    }
  },

  deleteStatus: async (userId) => {
    try {
      const response = await api.delete(`/smoking-status/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting smoking status:", error);
      throw error;
    }
  },
};

export default SmokingStatusService;
