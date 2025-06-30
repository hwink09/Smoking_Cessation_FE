import api from "./api";

const meetSessionService = {
  // POST /api/meet-session - Book Session
  bookSession: async (sessionData) => {
    try {
      const response = await api.post("/meet-session", sessionData);
      return response.data;
    } catch (error) {
      console.error("Error booking session:", error);
      throw error;
    }
  },

  // GET /api/meet-session/coach - Get Coach Session
  getCoachSessions: async () => {
    try {
      const response = await api.get("/meet-session/coach");
      return response.data;
    } catch (error) {
      console.error("Error fetching coach sessions:", error);
      throw error;
    }
  },

  // GET /api/meet-session/user - Get User Session
  getUserSessions: async () => {
    try {
      const response = await api.get("/meet-session/user");
      return response.data;
    } catch (error) {
      console.error("Error fetching user sessions:", error);
      throw error;
    }
  },

  // PUT /api/meet-session/{id}/status - Coach Update Status
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
};

export default meetSessionService;
