import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Spin,
  Alert,
  Tag,
  Button,
  Avatar,
  message,
  Descriptions,
  Card,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  KeyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import AdminService from "~/services/adminService";
import EditUserModal from "~/components/admin/userManager/EditUserModal";

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
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
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

  return (
    <div className="max-w-4xl mx-auto">
      <Card
        className="shadow-md mb-6"
        extra={
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => setIsEditModalOpen(true)}
          >
            Chỉnh sửa
          </Button>
        }
      >
        <div className="flex flex-col md:flex-row">
          {/* Cột avatar */}
          <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-8">
            <Avatar
              size={120}
              src={user.avatar}
              icon={<UserOutlined />}
              className="mb-3"
            />
            <h2 className="text-xl font-bold">{user.name}</h2>
            <div className="flex items-center mt-1 gap-2">
              <Tag
                color={user.role === "admin" ? "volcano" : "geekblue"}
                className="px-3 py-1 text-sm"
              >
                {user.role?.toUpperCase()}
              </Tag>
              {user.isActive ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">Passive</Tag>
              )}
            </div>
          </div>

          {/* Cột chi tiết */}
          <div className="flex-1">
            <Descriptions
              title="Thông tin quản trị viên"
              column={1}
              bordered
              size="middle"
            >
              <Descriptions.Item label="ID">
                <span className="font-mono text-sm">{user._id}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {user.email || (
                  <span className="italic text-gray-400">Chưa cập nhật</span>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {user.phoneNumber || (
                  <span className="italic text-gray-400">Chưa cập nhật</span>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {user.isActive ? "Hoạt động" : "Đã khóa"}
              </Descriptions.Item>
            </Descriptions>

            {/* Nút hành động */}
            <div className="mt-6 flex gap-4 flex-wrap">
              <Button
                danger={user.isActive}
                type="primary"
                icon={
                  user.isActive ? (
                    <CloseCircleOutlined />
                  ) : (
                    <CheckCircleOutlined />
                  )
                }
                onClick={() => handleSetStatus(!user.isActive)}
              >
                {user.isActive ? "Khóa tài khoản" : "Kích hoạt tài khoản"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal chỉnh sửa */}
      <EditUserModal
        open={isEditModalOpen}
        user={user}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateSuccess={(updatedData) => {
          setUser(updatedData);
          setIsEditModalOpen(false);
        }}
      />
    </div>
  );
};

export default Profile;
