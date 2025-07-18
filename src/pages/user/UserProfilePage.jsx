import { useEffect, useState } from "react";
import { Spin, Alert, Avatar } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import userService from "~/services/userService";

const InfoRow = ({ icon, label, value }) => (
  <div className="mb-4 flex items-start">
    <div className="text-xl text-purple-600 mr-3 mt-1">{icon}</div>
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-base font-medium text-gray-800">{value}</div>
    </div>
  </div>
);

const UserProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getMyProfile();
        setUserData(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch my profile:", err);
        setError("Không thể tải thông tin hồ sơ của bạn.");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Spin tip="Đang tải hồ sơ..." size="large" />
      </div>
    );
  }

  // Lỗi
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Alert message="Lỗi" description={error} type="error" showIcon />
      </div>
    );
  }

  // Không có dữ liệu
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Alert
          message="Không tìm thấy thông tin người dùng."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        className="p-0 mb-6"
        title="Hồ sơ người dùng"
        subTitle="Thông tin chi tiết về tài khoản của bạn"
      />

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-4 bg-[#26234e] p-8 flex flex-col items-center justify-center text-white">
            <Avatar
              size={120}
              src={userData.avatar_url}
              icon={<UserOutlined />}
              className="border-4 border-purple-400/50"
            />
            <h2 className="text-2xl font-bold mt-4">{userData.name}</h2>
            <span className="bg-white/20 text-xs font-bold uppercase px-3 py-1 rounded-full mt-2">
              {userData.role}
            </span>
          </div>

          <div className="md:col-span-8 p-8">
            <InfoRow
              icon={<MailOutlined />}
              label="Địa chỉ email"
              value={userData.email}
            />
            <InfoRow
              icon={<CalendarOutlined />}
              label="Ngày tham gia"
              value={new Date(userData.createdAt).toLocaleDateString("vi-VN")}
            />
            {/* Có thể thêm thêm nhiều InfoRow nếu bạn có thông tin khác */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
