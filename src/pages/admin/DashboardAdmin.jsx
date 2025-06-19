import AdminLayout from "../../components/layouts/admin/AdminLayout";
import Cards from "../../components/admin/overview/Cards";
import Overview from "~/components/admin/overview/Overview";
import ColourfulText from "../../components/ui/colourful-text";
import { useAuth } from "~/hooks/useAuth";

const stats = {
  users: 1200,
  revenue: "120,000,000đ",
  smokeFreeDays: 3500,
  moneySaved: "80,000,000đ",
  feedbacks: 320,
};

export default function DashboardAdmin() {
  // Get user data from auth context
  const { currentUser, loading } = useAuth();

  // Show loading indicator while auth state is being determined
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout admin={currentUser}>
      {" "}
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
