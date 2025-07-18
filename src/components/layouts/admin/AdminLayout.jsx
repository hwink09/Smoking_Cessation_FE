import AdminSidebar from "./Sidebar";

export default function AdminLayout({ children, admin }) {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <AdminSidebar admin={admin} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
