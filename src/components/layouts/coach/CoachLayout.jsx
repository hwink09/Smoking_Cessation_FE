import { Outlet } from "react-router-dom";
import { useAuth } from "~/hooks/useAuth";
import SidebarCoach from "./Sidebar";

export default function UserLayout() {
  const { currentUser } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-900">
      <SidebarCoach user={currentUser} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
