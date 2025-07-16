// src/services/adminService.js

import api from "./api"; // Kế thừa lại instance axios đã được cấu hình sẵn

const API_URL = "/admin/users"; // Tiền tố chung cho các API quản lý người dùng của Admin

// Hàm lấy thông tin chi tiết một người dùng theo ID
const getUserById = (userId) => {
  return api.get(`${API_URL}/${userId}`);
};

// Hàm cập nhật thông tin một người dùng theo ID
const updateUserById = (userId, userData) => {
  return api.put(`${API_URL}/${userId}`, userData);
};

// Hàm cập nhật trạng thái (active/inactive) của một người dùng
const setUserStatus = (userId, statusData) => {
  // statusData sẽ có dạng { isActive: true } hoặc { isActive: false }
  return api.patch(`${API_URL}/${userId}/status`, statusData);
};

// "Đóng gói" tất cả các hàm lại để xuất ra ngoài
const AdminService = {
  getUserById,
  updateUserById,
  setUserStatus,
};

export default AdminService;
