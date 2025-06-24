import Sidebar from "./Sidebar";

export default function AdminLayout({ children, admin }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar admin={admin} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
