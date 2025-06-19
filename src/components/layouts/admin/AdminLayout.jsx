import Sidebar from "./Sidebar";

export default function AdminLayout({ children, admin }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar admin={admin} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
