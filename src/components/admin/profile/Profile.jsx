// src/components/admin/profile/Profile.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin, Alert, Tag, Button, message, Avatar } from "antd"; // Thêm Avatar
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  KeyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons"; // Thêm icon cho đẹp
import AdminService from "~/services/adminService";
import EditUserModal from "~/components/admin/userManager/EditUserModal";

// Một component nhỏ để hiển thị từng dòng thông tin, giúp code gọn hơn
const InfoRow = ({ icon, label, children }) => (
  <div className="flex items-center py-4 border-b border-gray-200">
    <div className="flex items-center text-gray-500 w-1/3">
      {icon}
      <span className="ml-2 font-semibold">{label}</span>
    </div>
    <div className="w-2/3 text-gray-800">{children}</div>
  </div>
);

const Profile = () => {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await AdminService.getUserById(userId);
        setUser(response.data.data);
      } catch (err) {
        setError("Không thể tải thông tin người dùng.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleSetStatus = async (newStatus) => {
    try {
      const response = await AdminService.setUserStatus(userId, {
        isActive: newStatus,
      });
      setUser(response.data.data);
      message.success("Cập nhật trạng thái tài khoản thành công!");
    } catch (err) {
      message.error("Cập nhật trạng thái thất bại.");
      console.error(err);
    }
  };

  // --- Giao diện hiển thị ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description={error}
        type="error"
        showIcon
        className="m-4"
      />
    );
  }

  if (!user) {
    return (
      <Alert
        message="Không tìm thấy người dùng"
        type="warning"
        showIcon
        className="m-4"
      />
    );
  }

  // --- Giao diện chính đã được lột xác ---
  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* CỘT BÊN TRÁI: AVATAR VÀ THÔNG TIN CƠ BẢN */}
          <div className="md:col-span-1 flex flex-col items-center text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
            <Avatar
              size={120}
              icon={<UserOutlined />}
              src={user.avatar}
              className="border-4 border-white shadow-lg mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <div className="mt-4">
              <Tag
                color={user.role === "admin" ? "volcano" : "geekblue"}
                className="text-sm px-3 py-1">
                {user.role?.toUpperCase()}
              </Tag>
            </div>
          </div>

          {/* CỘT BÊN PHẢI: THÔNG TIN CHI TIẾT VÀ HÀNH ĐỘNG */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              Information Profile
            </h3>

            <InfoRow icon={<KeyOutlined />} label="ID ">
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {user._id}
              </span>
            </InfoRow>

            <InfoRow icon={<PhoneOutlined />} label="Phone">
              {user.phoneNumber || (
                <span className="text-gray-400 italic">No updates</span>
              )}
            </InfoRow>

            <InfoRow
              icon={
                user.isActive ? (
                  <CheckCircleOutlined className="text-green-500" />
                ) : (
                  <CloseCircleOutlined className="text-red-500" />
                )
              }
              label="Status">
              {user.isActive ? (
                <Tag color="success">Active</Tag>
              ) : (
                <Tag color="error">Passive</Tag>
              )}
            </InfoRow>

            {/* KHU VỰC CÁC NÚT BẤM HÀNH ĐỘNG */}
            <div className="mt-8 flex flex-wrap gap-4">
              {user.isActive ? (
                <Button
                  type="primary"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleSetStatus(false)}>
                  Passive Account
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                  onClick={() => handleSetStatus(true)}>
                  Active Account
                </Button>
              )}
              <Button onClick={() => setIsEditModalOpen(true)}>
                Edit Information
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal chỉnh sửa vẫn được giữ nguyên, không thay đổi */}
      {user && (
        <EditUserModal
          open={isEditModalOpen}
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateSuccess={(updatedData) => {
            setUser(updatedData);
            setIsEditModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Profile;
