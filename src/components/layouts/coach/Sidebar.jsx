import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  CheckCircleOutlined,
  FieldTimeOutlined,
  BarChartOutlined,
  MessageOutlined,
  BellOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Space } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "~/hooks/useAuth";
import ColourfulText from "~/components/ui/colourful-text";

function SidebarCoach() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser: user } = useAuth();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("coach-sidebar-collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("coach-sidebar-collapsed", collapsed);
  }, [collapsed]);

  const menu = [
    {
      label: "Kế hoạch của tôi",
      icon: <CheckCircleOutlined />,
      path: "/coach/dashboard",
    },
    {
      label: "Duyệt Yêu Cầu",
      icon: <CheckCircleOutlined />,
      path: "/coach/request",
    },
    {
      label: "Giai Đoạn",
      icon: <BarChartOutlined />,
      path: "/coach/stages",
    },
    {
      label: "Tiến Độ",
      icon: <FieldTimeOutlined />,
      path: "/coach/progress",
    },
    {
      label: "Đánh Giá",
      icon: <FieldTimeOutlined />,
      path: "/coach/feedback",
    },
    {
      label: "Thông Báo",
      icon: <BellOutlined />,
      path: "/coach/notifications",
    },
    {
      label: "Yêu Cầu Tư Vấn",
      icon: <MessageOutlined />,
      path: "/coach/meet-session",
    },
  ];

  const dropdownItems = [
    {
      key: "1",
      label: <span className="text-gray-400">Tài khoản của tôi</span>,
      disabled: true,
    },
    { type: "divider" },
    {
      key: "2",
      label: "Hồ sơ cá nhân",
      icon: <UserOutlined />,
      onClick: () => navigate("/coach/profile"),
    },
    {
      key: "3",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: logout,
    },
  ];

  return (
    <div
      className={`h-screen sticky top-0 overflow-y-auto sidebar-scroll ${
        collapsed ? "w-20" : "w-64"
      } bg-gradient-to-b from-[#1a1333] via-[#2b2256] to-[#1a2a3a] flex flex-col transition-all duration-300`}
    >
      {/* Header: Logo + Collapse Button */}
      <div className="relative h-16 border-b border-[#1f1f1f] flex items-center">
        {!collapsed && (
          <Link
            to="/coach/dashboard"
            className="absolute left-1/2 transform -translate-x-1/2"
          >
            <div className="text-xl font-semibold whitespace-nowrap">
              <ColourfulText text="COACH PANEL" />
            </div>
          </Link>
        )}
        <div className="ml-auto p-2">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-white"
          />
        </div>
      </div>

      {/* Profile Section */}
      <div
        className={`px-4 py-3 border-b border-[#1f1f1f] ${
          collapsed
            ? "flex flex-col items-center gap-2"
            : "flex items-center gap-3"
        } hover:bg-[#232042] hover:cursor-pointer transition-colors duration-200`}
      >
        <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
          <a onClick={(e) => e.preventDefault()}>
            <Space direction={collapsed ? "vertical" : "horizontal"}>
              <Avatar
                size={collapsed ? 32 : 40}
                src={user?.avatar_url}
                icon={<UserOutlined />}
              />
              {!collapsed && (
                <div>
                  <div className="text-sm font-semibold">{user?.name}</div>
                  <div className="text-xs text-gray-400">{user?.role}</div>
                </div>
              )}
            </Space>
          </a>
        </Dropdown>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-1 mt-4 flex flex-col items-center">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center transition-all duration-200 mt-1 ${
                collapsed ? "justify-center w-12 h-12" : "px-6 py-2 w-11/12"
              } ${
                isActive
                  ? "bg-gray-200 text-[#232042] rounded-2xl"
                  : "text-white hover:bg-[#232042] hover:text-[#1ecbe1] rounded-2xl"
              }`}
              style={{ minHeight: collapsed ? 48 : undefined }}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && (
                <span className="font-medium ml-3">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default SidebarCoach;
