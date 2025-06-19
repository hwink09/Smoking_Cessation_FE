import {
  AuditOutlined,
  CarryOutOutlined,
  DashboardOutlined,
  FieldTimeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Space } from "antd";
import { MessageCircleHeart, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ColourfulText from "~/components/ui/colourful-text";
import { toast } from "react-toastify";
import { useAuth } from "~/hooks/useAuth";

const menu = [
  { label: "Dashboard", icon: <DashboardOutlined />, path: "/user/dashboard" },
  { label: "Blog", icon: <AuditOutlined />, path: "/user/blog" },
  { label: "Quit Plan", icon: <CarryOutOutlined />, path: "/user/quitplan" },
  { label: "Progress", icon: <FieldTimeOutlined />, path: "/user/progress" },
  { label: "Achievements", icon: <Trophy />, path: "/user/achievements" },
  { label: "Support", icon: <MessageCircleHeart />, path: "/user/support" },
];
function Sidebar({ user = {} }) {
  const { logout, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collaped");
    return saved === "true";
  });

  // Sử dụng currentUser nếu user không được truyền vào hoặc rỗng
  const userData = Object.keys(user).length ? user : currentUser || {};

  useEffect(() => {
    localStorage.setItem("sidebar-collaped", collapsed);
  }, [collapsed]);

  const items = [
    {
      key: "1",
      label: "My Account",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Profile",
      icon: <FaUser />,
    },

    {
      key: "3",
      label: "Settings",
      icon: <SettingOutlined />,
    },
    {
      key: "4",
      label: "Logout",
      icon: <MdLogout />,
      onClick: () => {
        try {
          const result = logout();
          toast.success(result?.message || "Đăng xuất thành công!");
          navigate("/");
        } catch (error) {
          console.error("Lỗi khi đăng xuất:", error);
          toast.error("Có lỗi xảy ra khi đăng xuất");
          // Vẫn chuyển hướng về trang chủ ngay cả khi gặp lỗi
          navigate("/");
        }
      },
    },
  ];
  return (
    <div
      className={`h-screen sticky top-0 ${
        collapsed ? "w-20" : "w-64"
      } bg-gradient-to-b from-[#1a1333] via-[#2b2256] to-[#1a2a3a] flex flex-col  transition-all duration-300`}
    >
      {/* Collapse button */}

      <div
        className={`${
          !collapsed
            ? "flex justify-between items-center border-b border-[#1f1f1f]"
            : "flex items-center"
        } `}
      >
        {!collapsed && (
          <Link to="/">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
              <ColourfulText text="EXHELA" />
            </div>
          </Link>
        )}
        <div className="flex items-center justify-end p-2">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-white"
          />
        </div>
      </div>

      {/* Profile */}
      <div
        className={`${
          !collapsed
            ? "px-4 py-3 border-b border-[#1f1f1f] flex items-center gap-3 hover:bg-[#232042] hover:cursor-pointer transition-colors duration-200"
            : "px-4 py-3 border-b border-[#1f1f1f] flex items-center gap-3 hover:bg-[#232042] hover:cursor-pointer transition-colors duration-200 flex-col justify-center"
        }`}
      >
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {" "}
              <Avatar
                size={collapsed ? 32 : 40}
                src={userData?.avatar_url || userData?.avatar}
                icon={<UserOutlined />}
              />
              {!collapsed && (
                <div>
                  <div className="text-sm font-semibold">
                    {userData?.name || "User"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {userData?.role || "Member"}
                  </div>
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
                                        flex items-center transition-all duration-200 active-menu mt-1
                                        ${
                                          collapsed
                                            ? "justify-center w-12 h-12"
                                            : "px-6 py-2 w-11/12"
                                        }
                                        ${
                                          isActive
                                            ? `bg-gray-200 text-[#232042]  rounded-2xl`
                                            : "text-white hover:bg-[#232042]  hover:text-[#1ecbe1] rounded-2xl"
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
