import api from "./api";

const badgeService = {
  // Lấy tất cả badge kèm trạng thái của user (dành cho user)
  getAllBadgesWithUserStatus: async (userId) => {
    const response = await api.get(`/badges/user/${userId}`);
    return response.data;
  },

  // Lấy bảng xếp hạng badge (public)
  getBadgeLeaderBoard: async (type = "points", limit = 10) => {
    try {
      const params = new URLSearchParams();
      if (type) params.append("type", type);
      if (limit) params.append("limit", limit.toString());

      const response = await api.get(`/badges/leaderboard?${params}`);
      return response.data;
    } catch (error) {
      return [];
    }
  },

  // === ADMIN/COACH ONLY FUNCTIONS ===

  createBadge: async (badgeData) => {
    const response = await api.post("/badges/create", badgeData);
    return response.data;
  },

  getAllBadges: async () => {
    const response = await api.get("/badges");
    return response.data;
  },

  updateBadge: async (id, badgeData) => {
    const response = await api.put(`/badges/${id}`, badgeData);
    return response.data;
  },

  deleteBadge: async (id) => {
    const response = await api.delete(`/badges/${id}`);
    return response.data;
  },

  getBadgeStats: async () => {
    try {
      const response = await api.get("/badges/user-stats");
      return response.data;
    } catch (error) {
      return [];
    }
  },
    getRankingBadges: async (type) => {
    const response = await api.get(`/badges/leaderboard?type=${type}`);
    return response.data;
  },
};

// API functions với suffix API
export const getAllBadgesWithUserStatusAPI =
  badgeService.getAllBadgesWithUserStatus;
export const getBadgeLeaderBoardAPI = badgeService.getBadgeLeaderBoard;
export const createBadgeAPI = badgeService.createBadge;
export const getAllBadgesAPI = badgeService.getAllBadges;
export const updateBadgeAPI = badgeService.updateBadge;
export const deleteBadgeAPI = badgeService.deleteBadge;
export const getBadgeStatsAPI = badgeService.getBadgeStats;

export default badgeService;
