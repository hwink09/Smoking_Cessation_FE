import { UserOutlined, DashboardOutlined, TeamOutlined, MenuFoldOutlined, MenuUnfoldOutlined, DownOutlined, SettingOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Space } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { MdOutlineFeedback, MdLogout } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi"
import { FaUser } from "react-icons/fa";
import { useEffect } from "react";

const menu = [
    { label: "Overview", icon: <DashboardOutlined />, path: "/admin/dashboard" },
    { label: "Management User", icon: <TeamOutlined />, path: "/admin/dashboard/user-management" },
    { label: "Feedback & Rating", icon: <MdOutlineFeedback />, path: "#" },
    { label: "Report", icon: <HiOutlineDocumentReport />, path: "#" },
];

export default function Sidebar({ admin }) {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(() => {
        // Lấy trạng thái từ localStorage khi khởi tạo
        const saved = localStorage.getItem("sidebar-collapsed");
        return saved === "true";
    });

    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", collapsed);
    }, [collapsed]);

    const items = [
        {
            key: '1',
            label: 'My Account',    
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: 'Profile',
            icon: <FaUser />,

        },

        {
            key: '3',
            label: 'Settings',
            icon: <SettingOutlined />,

        },
        {
            key: '4',
            label: 'Logout',
            icon: <MdLogout />,
            onClick: () => {
                // Xử lý đăng xuất ở đây
                console.log("Logout clicked");
            }

        },
    ];

    return (
        <div className={`h-screen sticky top-0 ${collapsed ? "w-20" : "w-64"} bg-gradient-to-b from-[#1a1333] via-[#2b2256] to-[#1a2a3a] flex flex-col  transition-all duration-300`}>
            {/* Collapse button */}

            <div className={`${!collapsed ? "flex justify-between items-center border-b border-[#1f1f1f]" : "flex items-center"} `}>
                {!collapsed && <div className="text-xs uppercase text-gray-500 mt-4 mb-2 px-4">Platform</div>}
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
            <div className={`${!collapsed ? "px-4 py-3 border-b border-[#1f1f1f] flex items-center gap-3 hover:bg-[#232042] hover:cursor-pointer transition-colors duration-200" : "px-4 py-3 border-b border-[#1f1f1f] flex items-center gap-3 hover:bg-[#232042] hover:cursor-pointer transition-colors duration-200 flex-col justify-center"}`}>
                <Dropdown menu={{ items }}>
                    <a onClick={e => e.preventDefault()}>
                        <Space>
                            <Avatar size={collapsed ? 32 : 40} src={admin.avatar} icon={<UserOutlined />} />
                            {!collapsed && (
                                <div>
                                    <div className="text-sm font-semibold">{admin.name}</div>
                                    <div className="text-xs text-gray-400">{admin.role}</div>
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
                                        ${collapsed ? "justify-center w-12 h-12" : "px-6 py-2 w-11/12"}
                                        ${isActive
                                    ? `bg-gray-200 text-[#232042]  rounded-2xl`
                                    : "text-white hover:bg-[#232042]  hover:text-[#1ecbe1] rounded-2xl"
                                }
                                    `}
                            style={{
                                minHeight: collapsed ? 48 : undefined,
                            }}
                        >
                            <span className={`text-lg ${isActive ? "text-[#232042]" : ""}`}>{item.icon}</span>
                            {!collapsed && <span className="font-medium ml-3">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}