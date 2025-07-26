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
      label: (
        <span className="text-gray-800 font-medium hover:text-purple-600">
          <UserOutlined className="inline-block mr-2" />
          Hồ sơ cá nhân
        </span>
      ),
      onClick: () => navigate("/coach/profile"),
    },
    {
      key: "3",
      label: (
        <span className="text-gray-800 font-medium hover:text-red-500">
          <LogoutOutlined className="inline-block mr-2" />
          Đăng xuất
        </span>
      ),
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
        bg-white border-r border-gray-200`}
    >
      <div
        className={`border-b border-gray-200 p-2
          ${
            collapsed
              ? "flex justify-center"
              : "flex justify-between items-center"
          }`}
      >
        {!collapsed && (
          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
            <div className="text-xl font-semibold whitespace-nowrap text-gray-900">
              <ColourfulText text="EXHELA" />
            </div>
          </Link>
        )}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-800"
        />
      </div>

      <div
        className={`border-b border-gray-200 py-3 px-4 flex transition-colors duration-200 hover:bg-gray-100 hover:cursor-pointer
          ${collapsed ? "flex-col items-center gap-3" : "items-center gap-3"}`}
      >
        <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Avatar
                size={collapsed ? 32 : 40}
                src={user?.avatar_url}
                icon={<UserOutlined />}
              />
              {!collapsed && (
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {user?.name || "Huấn luyện viên"}
                  </div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
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
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                }`}
              style={{ minHeight: collapsed ? 48 : undefined }}
            >
              <span className={`text-lg ${isActive ? "text-gray-900" : ""}`}>
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
