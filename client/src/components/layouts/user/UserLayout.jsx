import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';



const defaultUser = {
  name: "Default User",
  avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8VFgS1jaiqM-zT8vPWTMxqsQ7nZYN1frN5A&s",
  role: "User"
};

export default function UserLayout() {
    return (
        <div className="flex min-h-screen bg-gray-900">
            <Sidebar user={defaultUser} />
            <main className="flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
}