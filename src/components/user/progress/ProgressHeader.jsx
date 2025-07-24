import React, { useMemo } from "react";
import {
  Clock,
  CalendarClock,
  Cigarette,
  TrendingUp,
  Flame,
} from "lucide-react";
import ColourfulText from "~/components/ui/colourful-text";

// Định dạng tiền tệ Việt Nam
const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

// Card hiển thị thống kê
const StatCard = ({
  icon,
  title,
  value,
  unit,
  bgColor,
  textColor,
  borderColor,
}) => (
  <div
    className={`bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 rounded-xl text-center p-6 border-t-4 ${borderColor} border border-gray-200 group hover:scale-105`}
  >
    <div
      className={`w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full shadow-lg ${bgColor}`}
    >
      {icon}
    </div>
    <p className="text-gray-700 mb-2 font-medium">{title}</p>
    <h2 className={`text-4xl font-bold mb-2 ${textColor}`}>{value}</h2>
    <div
      className={`border-t ${borderColor.replace(
        "border-t-",
        "border-"
      )} pt-2 mt-2`}
    >
      <span
        className={`inline-block px-3 py-1 ${textColor} text-sm font-medium rounded-full bg-opacity-10`}
      >
        {unit}
      </span>
    </div>
  </div>
);

function ProgressHeader({
  quitDate,
  stats = {},
  planTotalStats = null,
  planSmokingStats = null,
}) {
  const {
    days = 0,
    moneySaved = 0,
    cigarettesAvoided = 0,
    healthImprovement = 0,
  } = stats;

  const quitDateText = useMemo(() => {
    return quitDate?.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [quitDate]);

  const actualDaysSinceQuit = useMemo(() => {
    if (!quitDate) return 0;
    const now = new Date();
    const start = new Date(quitDate);
    const diffTime = now - start;
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  }, [quitDate]);

  const safeStats = {
    days: Math.max(0, days),
    moneySaved: planTotalStats
      ? Math.max(0, planTotalStats.total_money_saved)
      : Math.max(0, moneySaved),
    cigarettesAvoided: planSmokingStats
      ? Math.max(0, planSmokingStats.total_cigarettes_reduced)
      : Math.max(0, cigarettesAvoided),
    cigarettesSmoked: planSmokingStats
      ? Math.max(0, planSmokingStats.total_cigarettes_smoked)
      : 0,
    healthImprovement: Math.max(0, Math.min(100, healthImprovement)),
  };

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
        {planTotalStats && (
          <div className="inline-block px-4 py-2 bg-green-50 border border-green-300 rounded-full text-green-800 text-sm font-medium">
            📊 Đang hiển thị thống kê tổng từ tất cả stages
          </div>
        )}
      </div>

      {quitDateText && (
        <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-100 to-blue-50 rounded-full shadow-md border-2 border-blue-200 mb-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CalendarClock className="w-7 h-7 text-purple-600 mr-4" />
          <span className="text-gray-700 text-lg">
            Ngày bắt đầu cai:{" "}
            <span className="font-bold text-blue-800">{quitDateText}</span>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <StatCard
          icon={<Clock className="w-10 h-10 text-purple-600" />}
          title="Bạn Đã Cai Thuốc Được"
          value={actualDaysSinceQuit}
          unit="Ngày"
          bgColor="bg-purple-100"
          textColor="text-purple-600"
          borderColor="border-t-purple-500"
        />
        <StatCard
          icon={<TrendingUp className="w-10 h-10 text-green-600" />}
          title="Bạn Đã Tiết Kiệm Được"
          value={formatCurrency(safeStats.moneySaved)}
          unit="VND"
          bgColor="bg-green-100"
          textColor="text-green-600"
          borderColor="border-t-green-500"
        />
        <StatCard
          icon={<Cigarette className="w-10 h-10 text-red-600" />}
          title="Bạn Đã Giảm Được"
          value={safeStats.cigarettesAvoided.toLocaleString()}
          unit="Điếu"
          bgColor="bg-red-100"
          textColor="text-red-600"
          borderColor="border-t-red-500"
        />
        {planSmokingStats && (
          <StatCard
            icon={<Flame className="w-10 h-10 text-orange-600" />}
            title="Bạn Đã Hút"
            value={safeStats.cigarettesSmoked.toLocaleString()}
            unit="Điếu"
            bgColor="bg-orange-100"
            textColor="text-orange-600"
            borderColor="border-t-orange-500"
          />
        )}
      </div>
    </div>
  );
}

export default ProgressHeader;
