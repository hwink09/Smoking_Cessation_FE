import { Outlet } from "react-router-dom";
import SidebarCoach from "./SidebarCoach";
const CoachLayout = () => {
  return (
    <div className="flex min-h-screen w-full text-white">
      <SidebarCoach />
      <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-b from-black to-gray-900">
        <Outlet />
      </main>
    </div>
  );
};

export default CoachLayout;
