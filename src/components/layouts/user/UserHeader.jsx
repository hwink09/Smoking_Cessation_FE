import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Dropdown, Menu } from "antd";
import { DashboardOutlined } from "@ant-design/icons";
import { MdLogout } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useAuth } from "~/hooks/useAuth";


const UserHeader = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getUserMenuItems = (role) => {
    const baseItems = [
      {
        key: "profile",
        icon: <FaUser className="text-purple-400" />,
        label: <span className="text-white">Profile</span>,
        onClick: () => navigate(`/user/profile/${currentUser?.id}`),
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
        <Link to={role === "admin" ? "/admin/dashboard" : "/user/dashboard"}>
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

          {/* User Dropdown */}
          <div className="flex items-center gap-4">
            <Dropdown overlay={menu} placement="bottomRight" arrow>
              <div className="flex items-center gap-3 cursor-pointer">
                <span className="text-white font-medium">
                  {currentUser?.name || "User"}
                </span>
                <Avatar
                  src={
                    currentUser.avatar_url ||
                    "https://cdn-media.sforum.vn/storage/app/media/ve-capybara-2.jpg"
                  }
                  className="border-2 "
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