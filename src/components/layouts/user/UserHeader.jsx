import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Menu,
  Popover,
  List,
} from "antd";
import { BellOutlined, DashboardOutlined } from "@ant-design/icons";
import { MdLogout } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useAuth } from "~/hooks/useAuth";
import NotificationService from "~/services/notificationService";

const UserHeader = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser?.id && !currentUser?._id && !currentUser?.userId) return;
      const userId = currentUser?.id || currentUser?._id || currentUser?.userId;
      try {
        const response = await NotificationService.getUserNotifications(userId);
        setNotifications(response);
      } catch (err) {
        console.error("Lỗi khi tải thông báo:", err);
      }
    };
    fetchNotifications();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const notificationTypeVN = {
    reminder: 'Nhắc nhở',
    motivation: 'Thông báo',
  };
  const notificationTypeColor = {
    reminder: '#faad14', // orange
    motivation: '#1890ff', // blue
  };
  const notificationContent = (
    <div style={{ width: 300, maxHeight: 400, overflowY: "auto" }}>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item key={item._id}>
            <div>
              <div
                className="font-semibold"
                style={{ color: notificationTypeColor[item.type] || '#333' }}
              >
                {notificationTypeVN[item.type] || item.type}
              </div>
              <div>{item.message}</div>
              {item.schedule && (
                <div className="text-xs text-gray-400">
                  {new Date(item.schedule).toLocaleString()}
                </div>
              )}
            </div>
          </List.Item>
        )}
        locale={{ emptyText: "Không có thông báo" }}
      />
    </div>
  );

  const getUserMenuItems = (role) => {
    const baseItems = [
      {
        key: "profile",
        icon: <FaUser className="text-purple-400" />,
        label: <span className="text-white">Profile</span>,
        onClick: () => {
          const role = currentUser?.role;
          const id = currentUser?.userId || currentUser?._id || currentUser?.id;

          if (!id) {
            console.error("Không tìm thấy ID người dùng để điều hướng.");
            return;
          }

          let path = "";
          if (role === "admin") {
            path = `/admin/profile/${id}`;
          } else if (role === "coach") {
            path = `/coach/profile`;
          } else {
            path = `/user/profile/${id}`;
          }

          navigate(path);
        },
      },
      {
        key: "logout",
        icon: <MdLogout className="text-red-400" />,
        label: <span className="text-white">Logout</span>,
        onClick: handleLogout,
      },
    ];

    const dashboardItem = {
      key: "dashboard",
      icon: <DashboardOutlined className="text-blue-400" />,
      label: (
        <Link
          to={
            role === "admin"
              ? "/admin/dashboard"
              : role === "coach"
              ? "/coach/dashboard"
              : "/user/dashboard"
          }
        >
          <span className="text-white">Dashboard</span>
        </Link>
      ),
    };

    return [dashboardItem, ...baseItems];
  };

  const menu = (
    <Menu
      items={getUserMenuItems(currentUser?.role)}
      className="rounded-xl border-none bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl p-2"
      style={{
        minWidth: "180px",
      }}
    />
  );

  return (
    <header className="fixed w-full top-0 z-50 bg-gray-900/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              EXHELA
            </span>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex space-x-8">
            {[
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: "Kế Hoạch", path: "/quit-plan" },
              { name: "Community", path: "/community" },
              { name: "Ranking", path: "/ranking" },
              { name: "Premium", path: "/premium" },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-white hover:text-purple-400 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Dropdown & Notification */}
          <div className="flex items-center gap-4">
            <Popover
              content={notificationContent}
              title="Thông báo"
              trigger="click"
              placement="bottomRight"
            >
              <Badge count={notifications.length}>
                <Button
                  icon={<BellOutlined />}
                  className="flex items-center justify-center"
                  shape="circle"
                />
              </Badge>
            </Popover>

            <Dropdown overlay={menu} placement="bottomRight" arrow>
              <div className="flex items-center gap-3 cursor-pointer">
                <span className="text-white font-medium">
                  {currentUser?.name || "User"}
                </span>
                <Avatar
                  src={
                    currentUser?.avatar_url ||
                    "https://cdn-media.sforum.vn/storage/app/media/ve-capybara-2.jpg"
                  }
                  className="border-2"
                />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
