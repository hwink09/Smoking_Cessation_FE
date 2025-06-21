import api from "./api";

const badgeService = {
  createBadge: async (badgeData) => {
    try {
      const response = await api.post("/badges/create", badgeData);
      return response.data;
    } catch (error) {
      console.error("Lỗi tạo badge:", error);
      throw error;
    }
  },

  getAllBadges: async () => {
    const token = JSON.parse(localStorage.getItem("user") || "{}").token;
    const response = await api.get("/badges", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data;
  },

  updateBadge: async (id, badgeData) => {
    try {
      const response = await api.put(`/badges/${id}`, badgeData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi cập nhật badge id=${id}:`, error);
      throw error;
    }
  },

  deleteBadge: async (id) => {
    try {
      const response = await api.delete(`/badges/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi xóa badge id=${id}:`, error);
      throw error;
    }
  },

  getAllBadgesWithUserStatus: async (userId) => {
    try {
      const response = await api.get(`/badges/user/${userId}`);
      return response.data;
    } catch {
      const fallback = await api.get(`/badges`);
      return fallback.data;
    }
  },

  getBadgesLeaderBoard: async () => {
    try {
      const response = await api.get("/badges/leaderboard");
      return response.data;
    } catch {
      return [];
    }
  },

  getBadgeUserStats: async () => {
    try {
      const response = await api.get("/badges/user-stats");
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy bảng xếp hạng badge:", error);
      return [];
    }
  },
};

export default badgeService;
