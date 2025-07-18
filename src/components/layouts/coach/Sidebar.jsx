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
import { toast } from "react-toastify";

const menuItems = [
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
  { label: "Giai Đoạn", icon: <BarChartOutlined />, path: "/coach/stages" },
  { label: "Tiến Độ", icon: <FieldTimeOutlined />, path: "/coach/progress" },
  { label: "Đánh Giá", icon: <FieldTimeOutlined />, path: "/coach/feedback" },
  { label: "Thông Báo", icon: <BellOutlined />, path: "/coach/notifications" },
  {
    label: "Yêu Cầu Tư Vấn",
    icon: <MessageOutlined />,
    path: "/coach/meet-session",
  },
];

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

  const dropdownItems = [
    {
      key: "1",
      label: user?.name || "Tài khoản",
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
      onClick: async () => {
        try {
          await logout();
          toast.success("Đăng xuất thành công!");
          navigate("/");
        } catch (err) {
          console.error("Đăng xuất lỗi:", err);
          toast.error("Lỗi khi đăng xuất!");
          navigate("/");
        }
      },
    },
  ];

  return (
    <div
      className={`h-screen sticky top-0 flex flex-col transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        bg-gradient-to-b from-[#1a1333] via-[#2b2256] to-[#1a2a3a]`}
    >
      <div
        className={`border-b border-[#1f1f1f] p-2
          ${
            collapsed
              ? "flex justify-center"
              : "flex justify-between items-center"
          }`}
      >
        {!collapsed && (
          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
            <div className="text-xl font-semibold whitespace-nowrap">
              <ColourfulText text="EXHELA" />
            </div>
          </Link>
        )}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="text-white"
        />
      </div>

      <div
        className={`border-b border-[#1f1f1f] py-3 px-4 flex transition-colors duration-200 hover:bg-[#232042] hover:cursor-pointer
          ${collapsed ? "flex-col items-center gap-3" : "items-center gap-3"}`}
      >
        <Dropdown menu={{ items: dropdownItems }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Avatar
                size={collapsed ? 32 : 40}
                src={user?.avatar_url}
                icon={<UserOutlined />}
              />
              {!collapsed && (
                <div>
                  <div className="text-sm font-semibold">
                    {user?.name || "Huấn luyện viên"}
                  </div>
                  <div className="text-xs text-gray-400">{user?.email}</div>
                </div>
              )}
            </Space>
          </a>
        </Dropdown>
      </div>

      <nav className="flex-1 mt-4 flex flex-col items-center">
        {menuItems.map(({ label, icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`mt-1 flex items-center rounded-2xl transition-all duration-200
                ${collapsed ? "justify-center w-12 h-12" : "px-6 py-2 w-11/12"}
                ${
                  isActive
                    ? "bg-gray-200 text-[#232042]"
                    : "text-white hover:bg-[#232042] hover:text-[#1ecbe1]"
                }`}
              style={{ minHeight: collapsed ? 48 : undefined }}
            >
              <span className={`text-lg ${isActive ? "text-[#232042]" : ""}`}>
                {icon}
              </span>
              {!collapsed && <span className="font-medium ml-3">{label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default SidebarCoach;
