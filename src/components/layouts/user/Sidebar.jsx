import {
  AuditOutlined,
  CarryOutOutlined,
  DashboardOutlined,
  FieldTimeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Space } from "antd";
import { Cigarette, MessageCircleHeart, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ColourfulText from "~/components/ui/colourful-text";
import { useAuth } from "~/hooks/useAuth";

const menu = [
  { label: "Dashboard", icon: <DashboardOutlined />, path: "/user/dashboard" },
  {
    label: "Smoking Status",
    icon: <Cigarette />,
    path: "/user/smoking-status",
  },
  { label: "Blog", icon: <AuditOutlined />, path: "/user/blog" },
  { label: "Quit Plan", icon: <CarryOutOutlined />, path: "/user/quitplan" },
  { label: "Progress", icon: <FieldTimeOutlined />, path: "/user/progress" },
  { label: "Achievements", icon: <Trophy />, path: "/user/achievements" },
  { label: "Support", icon: <MessageCircleHeart />, path: "/user/support" },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved === "true";
  });
  const { logout, currentUser: user } = useAuth();

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  const items = [
    {
      key: "1",
      label: user?.name || "My Account",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Profile",
      icon: <FaUser />,
      onClick: () => navigate(`/user/profile/${user.id}`),
    },
    {
      key: "3",
      label: "Settings",
      icon: <SettingOutlined />,
      onClick: () => navigate("/user/settings"),
    },
    {
      key: "4",
      label: "Logout",
      icon: <MdLogout />,
      onClick: async () => {
        try {
          await logout();
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
    },
  ];

  return (
    <div
      className={`h-screen sticky top-0 ${
        collapsed ? "w-20" : "w-64"
      } bg-gradient-to-b from-[#1a1333] via-[#2b2256] to-[#1a2a3a] flex flex-col transition-all duration-300`}
    >
      {/* Collapse button */}
      <div
        className={`${
          !collapsed
            ? "flex justify-between items-center border-b border-[#1f1f1f] p-2"
            : "flex items-center justify-center p-2"
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

      {/* Profile */}
      <div
        className={`${
          !collapsed
            ? "px-4 py-3 border-b border-[#1f1f1f] flex items-center gap-3"
            : "px-4 py-3 border-b border-[#1f1f1f] flex flex-col items-center gap-3"
        } hover:bg-[#232042] hover:cursor-pointer transition-colors duration-200`}
      >
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Avatar
                size={collapsed ? 32 : 40}
                src={
                  user?.avatar_url ||
                  "https://cdn-media.sforum.vn/storage/app/media/ve-capybara-2.jpg"
                }
              />
              {!collapsed && (
                <div>
                  <div className="text-sm font-semibold">
                    {user?.name || "Guest"}
                  </div>
                  <div className="text-xs text-gray-400">{user?.email}</div>
                </div>
              )}
            </Space>
          </a>
        </Dropdown>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-4 flex flex-col items-center">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center transition-all duration-200 mt-1
                ${collapsed ? "justify-center w-12 h-12" : "px-6 py-2 w-11/12"}
                ${
                  isActive
                    ? "bg-gray-200 text-[#232042] rounded-2xl"
                    : "text-white hover:bg-[#232042] hover:text-[#1ecbe1] rounded-2xl"
                }
              `}
              style={{
                minHeight: collapsed ? 48 : undefined,
              }}
            >
              <span className={`text-lg ${isActive ? "text-[#232042]" : ""}`}>
                {item.icon}
              </span>
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

export default Sidebar;
