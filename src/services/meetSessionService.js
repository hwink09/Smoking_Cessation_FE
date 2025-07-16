import api from "./api";


const meetSessionService = {
 
  bookSession: async (sessionData) => {
    try {
      const response = await api.post("/meet-session", sessionData);
      return response.data;
    } catch (error) {
      console.error("Error booking session:", error);
      throw error;
    }
  },

  getCoachSessions: async () => {
    try {
      const response = await api.get("/meet-session/coach");
      return response.data;
    } catch (error) {
      console.error("Error fetching coach sessions:", error);
      throw error;
    }
  },


  getUserSessions: async () => {
    try {
      const response = await api.get("/meet-session/user");
      return response.data;
    } catch (error) {
      console.error("Error fetching user sessions:", error);
      throw error;
    }
  },

  updateSessionStatus: async (sessionId, statusData) => {
    try {
      const response = await api.put(
        `/meet-session/${sessionId}/status`,
        statusData
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error updating session status for session ${sessionId}:`,
        error
      );
      throw error;
    }
  },


  updateSession: async (sessionId, updatedData) => {
    try {
      const response = await api.put(`/meet-session/${sessionId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating session ${sessionId}:`, error);
      throw error;
    }
  },

 
  deleteSession: async (sessionId) => {
    try {
      const response = await api.delete(`/meet-session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting session ${sessionId}:`, error);
      throw error;
    }
  },
};

export default meetSessionService;
