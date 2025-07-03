import React from "react";
import {
  Clock,
  Heart,
  ActivityIcon,
  CalendarClock,
  Cigarette,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { Tooltip, Progress, Badge } from "antd";
import ColourfulText from "~/components/ui/colourful-text";

function ProgressHeader({ quitDate, stats = {}, healthMilestone }) {
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

  const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
  const cardClass =
    "bg-gradient-to-br from-white to-gray-50 hover:shadow-xl hover:border-blue-300 transition-all duration-300 rounded-xl text-center p-6 border border-gray-200";
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
        <div className="flex items-center">
          <CalendarClock className="w-7 h-7 text-purple-600 mr-4" />
          <span className="text-gray-700 text-lg">
            Ngày bắt đầu cai:{" "}
            <span className="font-bold text-blue-800">{quitDateText}</span>
          </span>
        </div>
      </div>{" "}
      {healthMilestone && (
        <div className="mb-10">
          <Tooltip
            title={healthMilestone.description}
            color="#7e22ce"
            placement="bottom"
          >
            {" "}
            <div className="mt-2 inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-lg border-2 border-purple-300 cursor-help shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 mr-4">
                <Trophy className="w-6 h-6 text-purple-600 animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-xs text-purple-500 font-medium uppercase tracking-wider mb-1">
                  Cột mốc đã đạt
                </div>
                <span className="text-blue-800 font-bold text-lg">
                  {healthMilestone.title}
                </span>
              </div>
            </div>
          </Tooltip>
        </div>
      )}{" "}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        {" "}
        <div
          className={
            cardClass + " border-t-4 border-t-purple-500 group hover:scale-105"
          }
        >
          <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:bg-purple-200 transition-all duration-300">
            <Clock className="w-10 h-10 text-purple-600" />
          </div>
          <p className="text-gray-700 mb-2 font-medium">Số Ngày Không Thuốc</p>
          <h2 className="text-5xl font-bold text-purple-600 mb-2">{days}</h2>
          <div className="border-t border-purple-200 pt-2 mt-2">
            <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full">
              ngày
            </span>
          </div>
        </div>
        <div
          className={
            cardClass + " border-t-4 border-t-green-500 group hover:scale-105"
          }
        >
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:bg-green-200 transition-all duration-300">
            <TrendingUp className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-gray-700 mb-2 font-medium">Tiết Kiệm Được</p>
          <h2 className="text-4xl font-bold text-green-600 mb-2">
            {currencyFormatter.format(moneySaved)}
          </h2>
          <div className="border-t border-green-200 pt-2 mt-2">
            <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
              VND
            </span>
          </div>
        </div>
        <div
          className={
            cardClass + " border-t-4 border-t-red-500 group hover:scale-105"
          }
        >
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:bg-red-200 transition-all duration-300">
            <Cigarette className="w-10 h-10 text-red-600" />
          </div>
          <p className="text-gray-700 mb-2 font-medium">Điếu Thuốc Không Hút</p>
          <h2 className="text-4xl font-bold text-red-600 mb-2">
            {cigarettesAvoided.toLocaleString()}
          </h2>
          <div className="border-t border-red-200 pt-2 mt-2">
            <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-full">
              điếu
            </span>
          </div>
        </div>
        <div
          className={
            cardClass + " border-t-4 border-t-pink-500 group hover:scale-105"
          }
        >
          <div className="bg-pink-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:bg-pink-200 transition-all duration-300">
            <Heart className="w-10 h-10 text-pink-600" />
          </div>
          <p className="text-gray-700 mb-2 font-medium">Tiến Triển Sức Khỏe</p>
          <h2 className="text-4xl font-bold text-pink-600 mb-2">
            {healthImprovement}%
          </h2>
          <div className="w-full mt-2 px-2">
            {" "}
            <Progress
              percent={parseFloat(healthImprovement)}
              showInfo={false}
              size={[10, 10]}
              /* Thay strokeWidth bằng size */ strokeColor={{
                "0%": "#a855f7",
                "50%": "#3b82f6",
                "100%": "#06b6d4",
              }}
              className="rounded-full overflow-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressHeader;
