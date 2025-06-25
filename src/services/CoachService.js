import api from "./api";

const CoachService = {
  getAllCoaches: async () => {
    const response = await api.get('/coach');
    return response.data;
  },
};

export default CoachService;
