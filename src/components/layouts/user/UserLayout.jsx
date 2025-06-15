import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';


export default function UserLayout() {
    const { user } = useSelector((state) => state.auth);
    
    return (
        <div className="flex min-h-screen bg-gray-900">
            <Sidebar user={user} />
            <main className="flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
}