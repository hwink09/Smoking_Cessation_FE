import api from "./api";

const NotificationService = {
  // POST /api/notifications - Create Notification
  createNotification: async (data) => {
    try {
      const response = await api.post("/notifications", data);
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  // GET /api/notifications - Get All Notifications
  getAllNotifications: async () => {
    try {
      const response = await api.get("/notifications");
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // GET /api/notifications/{id} - Get Notification By Id
  getNotificationById: async (id) => {
    try {
      const response = await api.get(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching notification ${id}:`, error);
      throw error;
    }
  },

  // PUT /api/notifications/{id} - Update Notifications
  updateNotification: async (id, data) => {
    try {
      const response = await api.put(`/notifications/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating notification ${id}:`, error);
      throw error;
    }
  },

  // DELETE /api/notifications/{id} - Delete Notifications
  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error);
      throw error;
    }
  },
};

export default NotificationService;
