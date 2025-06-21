import api from "./api";

const badgeService = {
  // POST /api/badge/create
  createBadge: async (badgeData) => {
    try {
      const response = await api.post("/badge/create", badgeData);
      return response.data;
    } catch (error) {
      console.error("Lỗi tạo badge:", error);
      throw error;
    }
  },

  // GET /api/badges
  getAllBadges: async () => {
    try {
      const response = await api.get("/badges");
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy danh sách badge:", error);
      throw error;
    }
  },

  // PUT /api/badge/{id}
  updateBadge: async (id, badgeData) => {
    try {
      const response = await api.put(`/badge/${id}`, badgeData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi cập nhật badge id=${id}:`, error);
      throw error;
    }
  },

  // DELETE /api/badge/{id}
  deleteBadge: async (id) => {
    try {
      const response = await api.delete(`/badge/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi xóa badge id=${id}:`, error);
      throw error;
    }
  },
  // GET /api/badge/user/{id} - Gets all badges with user earned status
  getAllBadgesWithUserStatus: async (userId) => {
    try {
      const response = await api.get(`/badge/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Lỗi lấy danh sách badge với trạng thái của user id=${userId}:`,
        error
      );
      return []; // Return empty array instead of throwing to improve resilience
    }
  },
  // GET /api/badge/leaderboard
  getBadgesLeaderBoard: async () => {
    try {
      const response = await api.get("/badge/leaderboard");
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy bảng xếp hạng badge:", error);
      return []; // Return empty array instead of throwing to improve resilience
    }
  },
};

export default badgeService;
