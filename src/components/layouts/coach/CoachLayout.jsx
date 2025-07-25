import { Outlet } from "react-router-dom";
import { useAuth } from "~/hooks/useAuth";
import CoachSidebar from "./Sidebar";

export default function CoachLayout() {
  const { currentUser } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CoachSidebar user={currentUser} />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
