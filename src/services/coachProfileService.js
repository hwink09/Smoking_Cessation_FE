import api from "./api";

const CoachService = {
  // POST /api/coach - Create Coach Profile
  createCoachProfile: async (coachData) => {
    try {
      const response = await api.post("/coach", coachData);
      return response.data;
    } catch (error) {
      console.error("Error creating coach profile:", error);
      throw error;
    }
  },

  // GET /api/coach - Get All Coach Profiles
  getAllCoaches: async () => {
    try {
      const response = await api.get("/coach");
      return response.data;
    } catch (error) {
      console.error("Error fetching all coaches:", error);
      throw error;
    }
  },

  // GET /api/coach/{id} - Get One Coach Profile
  getCoachById: async (id) => {
    try {
      const response = await api.get(`/coach/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching coach with id ${id}:`, error);
      throw error;
    }
  },

  // PUT /api/coach/{id} - Edit Coach Profile
  updateCoachProfile: async (id, coachData) => {
    try {
      const response = await api.put(`/coach/${id}`, coachData);
      return response.data;
    } catch (error) {
      console.error(`Error updating coach with id ${id}:`, error);
      throw error;
    }
  },

  // DELETE /api/coach/{id} - Delete Coach Profile
  deleteCoachProfile: async (id) => {
    try {
      const response = await api.delete(`/coach/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting coach with id ${id}:`, error);
      throw error;
    }
  },
};

export default CoachService;
