import AdminLayout from "~/components/layouts/admin/AdminLayout";
import Profile from "~/components/admin/profile/Profile";

function ProfilePage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Hồ sơ người dùng</h1>
      <Profile />
    </AdminLayout>
  );
}

export default ProfilePage;
