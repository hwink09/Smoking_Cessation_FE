import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "~/hooks/useAuth";

export default function UserLayout() {
  const { currentUser } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar user={currentUser} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
