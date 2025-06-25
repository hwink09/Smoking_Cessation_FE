import api from "./api";

const SmokingStatusService = {
  createStatus: async (userId, data) => {
    try {
      console.log("Creating smoking status with data:", data);
      const response = await api.post(`/smoking-status/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating smoking status:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  },

  getStatus: async (userId) => {
    try {
      const response = await api.get(`/smoking-status/${userId}`);
      return response.data.smokingStatus;
    } catch (error) {
      console.error("Error fetching smoking status:", userId);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  },

  updateStatus: async (userId, data) => {
    try {
      console.log("Updating smoking status with data:", data);
      const response = await api.put(`/smoking-status/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating smoking status:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  },

  deleteStatus: async (userId) => {
    try {
      const response = await api.delete(`/smoking-status/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting smoking status:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  },
};

export default SmokingStatusService;
