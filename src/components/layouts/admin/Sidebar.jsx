import {
  DashboardOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  FieldTimeOutlined,
  FileTextOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Space } from "antd";
import { MdOutlineFeedback, MdLogout } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FaBoxOpen, FaUser } from "react-icons/fa";
import { SlBadge } from "react-icons/sl";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "~/hooks/useAuth";
import { toast } from "react-toastify";
import ColourfulText from "~/components/ui/colourful-text";

const menuItems = [
  { label: "Tổng quan", icon: <DashboardOutlined />, path: "/admin/dashboard" },
  {
    label: "Người dùng",
    icon: <TeamOutlined />,
    path: "/admin/dashboard/user-management",
  },
  {
    label: "Huy hiệu",
    icon: <SlBadge />,
    path: "/admin/dashboard/badge-management",
  },
  {
    label: "Phản hồi",
    icon: <MdOutlineFeedback />,
    path: "/admin/feedback-management",
  },
  {
    label: "Đăng ký",
    icon: <CreditCardOutlined />,
    path: "/admin/subscriptions",
  },
  {
    label: "Kế hoạch bỏ thuốc",
    icon: <CheckCircleOutlined />,
    path: "/admin/quit-plans",
  },
  { label: "Tiến độ", icon: <FieldTimeOutlined />, path: "/admin/progress" },
  { label: "Bài viết blog", icon: <FileTextOutlined />, path: "/admin/blogs" },
  { label: "Thông báo", icon: <BellOutlined />, path: "/admin/notifications" },
  { label: "Quản lý gói", icon: <FaBoxOpen />, path: "/admin/package" },
  { label: "Báo cáo", icon: <HiOutlineDocumentReport />, path: "#" },
];

const AdminSidebar = ({ admin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("sidebar-collapsed") === "true"
  );

  const user = admin || currentUser || {};

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Đăng xuất thành công!");
      navigate("/");
    } catch (err) {
      console.error("Đăng xuất lỗi:", err);
      toast.error("Lỗi khi đăng xuất!");
    }
  };

  const dropdownItems = [
    { key: "name", label: user?.name || "Admin", disabled: true },
    { type: "divider" },
    {
      key: "profile",
      label: "Trang cá nhân",
      icon: <FaUser />,
      onClick: () => {
        if (user?.userId) navigate("/admin/profile");
        else toast.error("Không xác định được ID admin.");
      },
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <MdLogout />,
      onClick: handleLogout,
    },
  ];

  const renderMenuItem = ({ label, icon, path }) => {
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
        <span className={`text-lg`}>{icon}</span>
        {!collapsed && <span className="font-medium ml-3">{label}</span>}
      </Link>
    );
  };

  return (
    <div
      className={`h-screen sticky top-0 flex flex-col transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        bg-gradient-to-b from-[#1a1333] via-[#2b2256] to-[#1a2a3a]`}
    >
      {/* Toggle button */}
      <div
        className={`border-b border-[#1f1f1f] p-2 ${
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

      {/* Admin profile */}
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
                    {user?.name || "Admin"}
                  </div>
                  <div className="text-xs text-gray-400">{user?.email}</div>
                </div>
              )}
            </Space>
          </a>
        </Dropdown>
      </div>

      {/* Sidebar menu */}
      <nav className="flex-1 mt-4 flex flex-col items-center">
        {menuItems.map(renderMenuItem)}
      </nav>
    </div>
  );
};

export default AdminSidebar;
