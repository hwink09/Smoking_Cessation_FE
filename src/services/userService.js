import api from "./api";

// Tất cả các API liên quan đến người dùng
const userService = {
  // Lấy tất cả người dùng
  getAllUser: async () => {
    try {
      const response = await api.get("/user");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Sửa thông tin user từ admin hoặc trang quản trị
  editUser: async (id, data) => {
    try {
      const response = await api.put(`/user/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error editing user:", error);
      throw error;
    }
  },

  // Xóa user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/user/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  // --- Từ useProfileData thêm vào ---

  // Lấy thông tin user theo ID
  fetchUserById: async (userId) => {
    try {
      const response = await api.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  },

  // Cập nhật hồ sơ người dùng (self-update)
  updateUserProfile: async (userId, profileData) => {
    try {
      const response = await api.put(
        `/user/edit-profile/${userId}`,
        profileData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },
};

export default userService;
