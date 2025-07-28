import api from "./api";

const DashBoardService = {
  adminDashboard: async () => {
    const response = await api.get('/dashboard/statistics');
    return response.data;
  },
};

export default DashBoardService;