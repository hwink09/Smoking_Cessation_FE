import AdminLayout from "../../components/layouts/admin/AdminLayout";
import Cards from "../../components/Admin/overview/Cards";
import Overview from "~/components/Admin/overview/Overview";
import ColourfulText from "../../components/ui/colourful-text";

const admin = {
    name: "Admin Nguyễn",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "Super Admin",
};

const stats = {
    users: 1200,
    revenue: "120,000,000đ",
    smokeFreeDays: 3500,
    moneySaved: "80,000,000đ",
    feedbacks: 320,
};

export default function DashboardAdmin() {
    return (
        <AdminLayout admin={admin}>
            <div className="flex items-center justify-start relative overflow-hidden ml-6">
                <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-center text-white relative z-10 font-sans">
                    <ColourfulText text="Overview" /> <br />
                </h1>
            </div>
            <Cards stats={stats} />
            <Overview />
        </AdminLayout>
    );
}