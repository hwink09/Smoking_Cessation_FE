import Profile from "~/components/Admin/profile/Profile";
import AdminLayout from "../../components/layouts/admin/AdminLayout";

const admin = {
    name: "Admin Nguyễn",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "Super Admin",
    email: "admin@example.com",
};

export default function ProfilePage() {
    return (
        <AdminLayout admin={admin}>
            <h1 className="text-3xl text-center font-extrabold mb-6 bg-gradient-to-r from-[#6a5af9] to-[#1ecbe1] text-transparent bg-clip-text drop-shadow-lg">
                Profile
            </h1>
            <Profile admin={admin} />
        </AdminLayout>
    );
}