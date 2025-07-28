import React, { useEffect, useState } from "react";
import { Users, CreditCard, DollarSign, MessageSquare } from "lucide-react";
import { ChartCard } from "~/components/admin/overview/ChartCard";
import ColourfulText from "~/components/ui/colourful-text";
import { PieChartCard } from "~/components/admin/overview/PieChartCard";
import DashBoardService from "~/services/dashboard";
import { useAuth } from "~/hooks/useAuth";
import AdminLayout from "~/components/layouts/admin/AdminLayout";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DashboardAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { currentUser } = useAuth();

  // Dữ liệu biểu đồ lấy từ API
  const userGrowthData = data?.charts?.userGrowth?.map((item) => ({
    month: monthNames[(item.month - 1) % 12] + " " + item.year,
    users: item.count,
  })) || [
    { month: "Th1", users: 200 },
    { month: "Th2", users: 400 },
    { month: "Th3", users: 800 },
    { month: "Th4", users: 1500 },
    { month: "Th5", users: 2400 },
    { month: "Th6", users: 3200 },
  ];

  const planData = data?.charts?.subscriptionDistribution?.map((item) => ({
    name: item.name,
    value: item.count,
  })) || [
    { name: "Cơ bản", value: 100 },
    { name: "Cao cấp", value: 140 },
    { name: "Gia đình", value: 80 },
  ];

  const revenueData = data?.charts?.revenueOverview?.map((item) => ({
    month: monthNames[(item.month - 1) % 12] + " " + item.year,
    revenue: item.total,
  })) || [
    { month: "Th1", revenue: 1000 },
    { month: "Th2", revenue: 1500 },
    { month: "Th3", revenue: 2200 },
    { month: "Th4", revenue: 2800 },
    { month: "Th5", revenue: 2900 },
    { month: "Th6", revenue: 3050 },
  ];

  const feedbackData = data?.charts?.feedbackTypes?.map((item) => ({
    type: item.name,
    value: item.count,
  })) || [
    { type: "Lỗi", value: 30 },
    { type: "Ý tưởng", value: 50 },
    { type: "Khen ngợi", value: 48 },
  ];

  const kpi = data?.kpi || {
    totalUsers: 1250,
    activePlans: 320,
    totalRevenue: 12450,
    totalFeedbacks: 128,
  };

  const fetchBadges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await DashBoardService.adminDashboard();
      setData(response);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Đang tải bảng điều khiển...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-red-500">
        {error}
      </div>
    );
  }

  return (
    <AdminLayout admin={currentUser}>
      <section className="py-16 bg-gray-100 min-h-screen text-gray-800">
        <div className="container mx-auto px-4">
          {/* Phần tiêu đề */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Chào mừng đến với{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
                <ColourfulText text="Bảng điều khiển quản trị viên" />
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mx-auto max-w-full">
              Giám sát, quản lý và tối ưu hóa hiệu suất nền tảng của bạn chỉ
              trong một nơi.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
            <div className="bg-white text-gray-900 rounded-xl p-6 shadow border border-gray-200 text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shadow-inner">
                <Users className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Tổng số người dùng</h3>
              <p className="text-3xl font-bold">{kpi.totalUsers}</p>
            </div>

            <div className="bg-white text-gray-900 rounded-xl p-6 shadow border border-gray-200 text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shadow-inner">
                <CreditCard className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Gói đang hoạt động</h3>
              <p className="text-3xl font-bold">{kpi.activePlans}</p>
            </div>

            <div className="bg-white text-gray-900 rounded-xl p-6 shadow border border-gray-200 text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shadow-inner">
                <DollarSign className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Tổng doanh thu</h3>
              <p className="text-3xl font-bold">
                {kpi.totalRevenue?.toLocaleString?.("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  maximumFractionDigits: 0,
                }) || kpi.totalRevenue}
              </p>
            </div>

            <div className="bg-white text-gray-900 rounded-xl p-6 shadow border border-gray-200 text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shadow-inner">
                <MessageSquare className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Phản hồi</h3>
              <p className="text-3xl font-bold">{kpi.totalFeedbacks}</p>
            </div>
          </div>
          {/* Phần biểu đồ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tăng trưởng người dùng */}
            <div className="bg-white text-gray-900 p-6 rounded-xl shadow border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">
                Tăng trưởng người dùng
              </h3>
              <ChartCard
                title=""
                data={userGrowthData}
                dataKeyX="month"
                dataKeyY="users"
                color="#2563eb"
              />
            </div>

            {/* Phân bổ gói hoạt động */}
            <div className="bg-white text-gray-900 p-6 rounded-xl shadow border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">
                Phân bổ gói hoạt động
              </h3>
              <div className="p-4 border border-gray-200 rounded-xl shadow-inner bg-gray-50">
                <PieChartCard
                  title=""
                  data={planData}
                  dataKey="value"
                  nameKey="name"
                />
              </div>
            </div>

            {/* Tổng quan doanh thu */}
            <div className="bg-white text-gray-900 p-6 rounded-xl shadow border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">
                Tổng quan doanh thu
              </h3>
              <ChartCard
                title=""
                data={revenueData}
                dataKeyX="month"
                dataKeyY="revenue"
                color="#f59e42"
              />
            </div>

            {/* Loại phản hồi */}
            <div className="bg-white text-gray-900 p-6 rounded-xl shadow border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Loại phản hồi</h3>
              <div className="p-4 border border-gray-200 rounded-xl shadow-inner bg-gray-50">
                <PieChartCard
                  title=""
                  data={feedbackData}
                  dataKey="value"
                  nameKey="type"
                />
              </div>
            </div>
          </div>

          <br />

          {/* Thẻ thống kê */}
        </div>
      </section>
    </AdminLayout>
  );
};

export default DashboardAdmin;
