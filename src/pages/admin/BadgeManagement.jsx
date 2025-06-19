import React from "react";
import Badge from "~/components/admin/badge/Badge";
import AdminLayout from "~/components/layouts/admin/AdminLayout";
import { useAuth } from "~/hooks/useAuth";

function BadgeManagement() {
  const { currentUser } = useAuth();

  return (
    <AdminLayout admin={currentUser}>
      <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#6a5af9] to-[#1ecbe1] text-transparent bg-clip-text">
        Quản lý huy hiệu
      </h1>
      <Badge />
    </AdminLayout>
  );
}

export default BadgeManagement;
