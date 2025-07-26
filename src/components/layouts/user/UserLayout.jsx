import { Outlet } from "react-router-dom";
import { useAuth } from "~/hooks/useAuth";
import UserSidebar from "./Sidebar";

export default function UserLayout() {
  const { currentUser } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar user={currentUser} />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
