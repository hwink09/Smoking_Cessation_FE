import AdminLayout from "../../components/layouts/admin/AdminLayout";
import UserTable from "../../components/admin/userManager/UserTable";

const admin = {
  name: "Admin Nguyễn",
  avatar: "https://i.pravatar.cc/150?img=3",
  role: "Super Admin",
};

export default function UserManagement() {
  return (
    <AdminLayout admin={admin}>
      <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-[#6a5af9] to-[#1ecbe1] text-transparent bg-clip-text drop-shadow-lg">
        Quản lý người dùng
      </h1>
      <UserTable />
    </AdminLayout>
  );
}
