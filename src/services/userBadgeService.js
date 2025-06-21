import api from "./api";

const userBadgeService = {
  assignBadge: async (assignData) => {
    const response = await api.post("/user-badge/create", assignData);
    return response.data;
  },

  getUserBadges: async (userId) => {
    if (!userId) return [];
    const response = await api.get(`/user-badge/user/${userId}`);
    return response.data;
  },

  getBadgeCount: async () => {
    const response = await api.get("/user-badge/badge-count");
    return response.data;
  },

  shareBadge: async (shareData) => {
    const formattedData = {
      badge_id: shareData.badge_id || shareData.badgeId,
      content: shareData.content || shareData.message || "I earned this badge!",
    };
    const response = await api.post("/user-badge/share", formattedData);
    return response.data;
  },

  getUserProgress: async (token) => {
    if (!token) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      token = user?.token;
    }

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.get("/progress", { headers });
    return response.data;
  },
};

export default userBadgeService;
