import api from "./api";

const CoachService = {
  // POST /api/coach - Create Coach Profile
  createCoachProfile: async (coachData) => {
    // Validate required fields
    if (
      !coachData.specialization ||
      coachData.experience_years === undefined ||
      coachData.experience_years === null ||
      !coachData.bio
    ) {
      const error = new Error("Missing required fields");
      error.details = {
        specialization: !coachData.specialization,
        experience_years:
          coachData.experience_years === undefined ||
          coachData.experience_years === null,
        bio: !coachData.bio,
      };
      throw error;
    }

    // Make sure experience_years is a number
    if (typeof coachData.experience_years !== "number") {
      coachData.experience_years = Number(coachData.experience_years);
    }

    try {
      const response = await api.post("/coach", coachData);
      return response.data;
    } catch (error) {
      console.error(
        "Error creating coach profile:",
        error.response?.data || error
      );
      throw error;
    }
  },

  // GET /api/coach - Get All Coach Profiles
  getAllCoaches: async () => {
    const response = await api.get("/coach");
    return response.data;
  },

  // GET /api/coach/{id} - Get One Coach Profile
  getCoachById: async (id) => {
    if (!id) {
      throw new Error("Coach ID is required");
    }

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
