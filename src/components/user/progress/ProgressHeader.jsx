import React, { useMemo } from "react";
import {
  Clock,
  Heart,
  CalendarClock,
  Cigarette,
  TrendingUp,
} from "lucide-react";
import { Progress } from "antd";
import ColourfulText from "~/components/ui/colourful-text";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

function ProgressHeader({ quitDate, stats = {} }) {
  const {
    days = 0,
    moneySaved = 0,
    cigarettesAvoided = 0,
    healthImprovement = 0,
  } = stats;

  const quitDateText = quitDate?.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const actualDaysSinceQuit = useMemo(() => {
    if (!quitDate) return 0;
    const now = new Date();
    const start = new Date(quitDate);
    const diffTime = now - start;
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  }, [quitDate]);

  const safeStats = {
    days: Math.max(0, days),
    moneySaved: Math.max(0, moneySaved),
    cigarettesAvoided: Math.max(0, cigarettesAvoided),
    healthImprovement: Math.max(0, Math.min(100, healthImprovement)),
  };

  const StatCard = ({ icon, title, value, unit, color, borderColor }) => (
    <div
      className={`bg-gradient-to-br from-white to-gray-50 hover:shadow-xl hover:border-blue-300 transition-all duration-300 rounded-xl text-center p-6 border border-gray-200 border-t-4 ${borderColor} group hover:scale-105`}
    >
      <div
        className={`${color} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:${color
          .replace("bg-", "bg-")
          .replace("-100", "-200")}`}
      >
        {icon}
      </div>
      <p className="text-gray-700 mb-2 font-medium">{title}</p>
      <h2
        className={`text-4xl font-bold mb-2 ${color
          .replace("bg-", "text-")
          .replace("-100", "-600")}`}
      >
        {value}
      </h2>
      <div
        className={`border-t ${borderColor.replace(
          "border-t-",
          "border-"
        )} pt-2 mt-2`}
      >
        <span
          className={`inline-block px-3 py-1 ${color.replace(
            "-100",
            "-50"
          )} ${color
            .replace("bg-", "text-")
            .replace("-100", "-700")} text-sm font-medium rounded-full`}
        >
          {unit}
        </span>
      </div>
    </div>
  );

  return (
    <div className="text-center mb-8 bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8 rounded-2xl shadow-md border border-blue-200">
      <div className="relative mb-10">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full"></div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-blue-200 inline-block">
          Hành Trình <ColourfulText text="Cai Thuốc Lá" />
        </h1>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Theo dõi nhật ký hàng ngày và duy trì động lực để đạt được mục tiêu
          của bạn
        </p>
      </div>

      <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-100 to-blue-50 rounded-full shadow-md border-2 border-blue-200 mb-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <CalendarClock className="w-7 h-7 text-purple-600 mr-4" />
        <span className="text-gray-700 text-lg">
          Ngày bắt đầu cai:{" "}
          <span className="font-bold text-blue-800">{quitDateText}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        <StatCard
          icon={<Clock className="w-10 h-10 text-purple-600" />}
          title="Bạn Đã Cai Thuốc Được"
          value={actualDaysSinceQuit}
          unit="ngày"
          color="bg-purple-100"
          borderColor="border-t-purple-500"
        />
        <StatCard
          icon={<TrendingUp className="w-10 h-10 text-green-600" />}
          title="Tiết Kiệm Được"
          value={formatCurrency(safeStats.moneySaved)}
          unit="VND"
          color="bg-green-100"
          borderColor="border-t-green-500"
        />
        <StatCard
          icon={<Cigarette className="w-10 h-10 text-red-600" />}
          title="Điếu Thuốc Không Hút"
          value={safeStats.cigarettesAvoided.toLocaleString()}
          unit="điếu"
          color="bg-red-100"
          borderColor="border-t-red-500"
        />
      </div>
    </div>
  );
}

export default ProgressHeader;
