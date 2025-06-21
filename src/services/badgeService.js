import api from "./api";

const badgeService = {
  createBadge: async (badgeData) => {
    const response = await api.post("/badge/create", badgeData);
    return response.data;
  },

  getAllBadges: async () => {
    const token = JSON.parse(localStorage.getItem("user") || "{}").token;
    const response = await api.get("/badges", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data;
  },

  updateBadge: async (id, badgeData) => {
    const response = await api.put(`/badge/${id}`, badgeData);
    return response.data;
  },

  deleteBadge: async (id) => {
    const response = await api.delete(`/badge/${id}`);
    return response.data;
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
      const response = await api.get("/badge/leaderboard");
      return response.data;
    } catch {
      return [];
    }
  },
};

export default badgeService;
