import React from "react";
import Cards from "./Cards";
import { Card } from "antd";
import { AreaChart } from "../../ui/area-chart";
import { BarChart } from "../../ui/bar-chart";
import { LineChart } from "../../ui/line-chart";
import { PieChart } from "../../ui/pie-chart";

const userGrowthData = [
  { date: "2024-01", users: 100 },
  { date: "2024-02", users: 200 },
  { date: "2024-03", users: 300 },
  { date: "2024-04", users: 400 },
  { date: "2024-05", users: 500 },
];

const revenueData = [
  { month: "Tháng 1", revenue: 10000000, saving: 1000000 },
  { month: "Tháng 2", revenue: 20000000, saving: 2000000 },
  { month: "Tháng 3", revenue: 30000000, saving: 3000000 },
  { month: "Tháng 4", revenue: 40000000, saving: 4000000 },
  { month: "Tháng 5", revenue: 50000000, saving: 5000000 },
];

const feedbackData = [
  { name: "Tích cực", value: 70 },
  { name: "Tiêu cực", value: 20 },
  { name: "Trung lập", value: 10 },
];

const smokingData = [
  { day: "Thứ 2", hours: 4 },
  { day: "Thứ 3", hours: 3 },
  { day: "Thứ 4", hours: 2 },
  { day: "Thứ 5", hours: 1 },
  { day: "Thứ 6", hours: 2 },
  { day: "Thứ 7", hours: 1 },
  { day: "CN", hours: 0 },
];

export default function Overview() {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const formatHours = (value) => {
    return `${value} giờ`;
  };

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card
          title="Tăng trưởng người dùng"
          className="shadow-lg rounded-xl backdrop-blur-sm bg-opacity-30"
        >
          <AreaChart
            data={userGrowthData}
            index="date"
            categories={["users"]}
            colors={["#00e0ff"]}
            valueFormatter={formatNumber}
          />
        </Card>

        <Card
          title="Doanh thu theo tháng"
          className="shadow-lg rounded-xl backdrop-blur-sm bg-opacity-30 "
        >
          <BarChart
            data={revenueData}
            index="month"
            categories={["revenue"]}
            colors={["#4481eb"]}
            valueFormatter={formatCurrency}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Thời gian hút thuốc theo ngày">
          <LineChart
            data={smokingData}
            index="day"
            categories={["hours"]}
            colors={["#f43f5e"]}
            valueFormatter={formatHours}
          />
        </Card>

        <Card
          title="Tiền tiết kiệm theo thời gian"
          className="shadow-lg rounded-xl backdrop-blur-sm bg-opacity-30 "
        >
          <LineChart
            data={revenueData}
            index="month"
            categories={["saving"]}
            colors={["#4facfe"]}
            valueFormatter={formatCurrency}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card
          title="Tỉ lệ Feedback"
          className="shadow-lg rounded-xl backdrop-blur-sm bg-opacity-30 "
        >
          <PieChart
            data={feedbackData}
            colors={["#4facfe", "#f43f5e", "#8b5cf6"]}
          />
        </Card>
      </div>
    </div>
  );
}
