import React from 'react'
import Badge from '~/components/Admin/badge/Badge';
import AdminLayout from '~/components/layouts/admin/AdminLayout'

const admin = {
    name: "Admin Nguyễn",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "Super Admin",
};
function BadgeManagement() {
    return (
        <AdminLayout admin={admin}>
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#6a5af9] to-[#1ecbe1] text-transparent bg-clip-text">Quản lý huy hiệu</h1>
            <Badge />
        </AdminLayout>
    )
}

export default BadgeManagement
