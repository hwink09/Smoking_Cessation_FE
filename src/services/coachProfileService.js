import api from "./api";

const CoachService = {
  // POST /api/coach - Create Coach Profile
  createCoachProfile: async (coachData) => {
    const response = await api.post("/coach", coachData);
    return response.data;
  },

  // GET /api/coach - Get All Coach Profiles
  getAllCoaches: async () => {
    const response = await api.get("/coach");
    return response.data;
  },

  // GET /api/coach/{id} - Get One Coach Profile
  getCoachById: async (id) => {
    const response = await api.get(`/coach/${id}`);
    return response.data;
  },

  // PUT /api/coach/{id} - Edit Coach Profile
  updateCoachProfile: async (id, coachData) => {
    const response = await api.put(`/coach/${id}`, coachData);
    return response.data;
  },

  // DELETE /api/coach/{id} - Delete Coach Profile
  deleteCoachProfile: async (id) => {
    const response = await api.delete(`/coach/${id}`);
    return response.data;
  },
};

export default CoachService;
