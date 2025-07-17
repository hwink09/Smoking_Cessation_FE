import api from "./api";

const userBadgeService = {
  // Gán badge cho user (admin/coach only)
  assignBadge: async (assignData) => {
    try {
      const response = await api.post("/user-badges/create", assignData);
      return response.data;
    } catch (error) {
      console.error("Lỗi gán badge:", error);
      throw error;
    }
  },

  // Lấy danh sách badge của user
  getUserBadges: async (userId) => {
    try {
      if (!userId) return { data: [] };
      const response = await api.get(`/user-badges/user/${userId}`);
      return { data: response.data };
    } catch (error) {
      console.error(`Lỗi lấy badge của user ${userId}:`, error);
      return { data: [] };
    }
  },

  // Đếm số lượng người nhận từng badge (admin/coach only)
  getBadgeCount: async () => {
    try {
      const response = await api.get("/user-badges/badge-count");
      return { data: response.data };
    } catch (error) {
      console.error("Lỗi lấy số lượng badge:", error);
      return { data: [] };
    }
  },

  // Chia sẻ badge lên post
  shareBadge: async (shareData) => {
    try {
      const formattedData = {
        badge_id: shareData.badge_id || shareData.badgeId,
        content:
          shareData.content || shareData.message || "I earned this badge!",
        title: shareData.title || "Badge Achievement!",
        tags: shareData.tags || [],
      };
      const response = await api.post("/user-badges/share", formattedData);
      return response.data;
    } catch (error) {
      console.error("Lỗi chia sẻ badge:", error);
      throw error;
    }
  },

  // Lấy progress của user
  getUserProgress: async (token) => {
    try {
      if (!token) {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        token = user?.token;
      }

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.get("/progress", { headers });
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy progress:", error);
      return {};
    }
  },
};

// API functions với suffix API
export const assignBadgeAPI = userBadgeService.assignBadge;
export const getUserBadgesAPI = userBadgeService.getUserBadges;
export const getBadgeCountAPI = userBadgeService.getBadgeCount;
export const shareBadgeAPI = userBadgeService.shareBadge;
export const getUserProgressAPI = userBadgeService.getUserProgress;

export default userBadgeService;
