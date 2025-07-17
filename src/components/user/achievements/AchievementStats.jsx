import React from "react";
import { Trophy, Award, Star } from "lucide-react";
import { Progress } from "antd";
import BadgeIcon from "~/components/ui/BadgeIcon";

const AchievementStats = ({ badges = [], stats = {}, onView, lightTheme }) => {
  const badgesArray = Array.isArray(badges) ? badges : [];
  const earned = badgesArray.filter((b) => b && b.earned);
  const recent = [...earned]
    .sort(
      (a, b) =>
        new Date(b.earnedAt || b.date_awarded || 0) -
        new Date(a.earnedAt || a.date_awarded || 0)
    )
    .slice(0, 3);

  const totalBadges = stats.total || badgesArray.length || 0;
  const earnedCount = stats.earned || earned.length || 0;
  const completionRate =
    stats.completion ||
    (totalBadges ? Math.round((earnedCount / totalBadges) * 100) : 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
      {/* Bộ sưu tập huy hiệu */}
      <div
        className={`${
          lightTheme
            ? "bg-gradient-to-br from-white to-gray-50 border-gray-200"
            : "bg-white/10 border-white/20"
        } p-6 rounded-2xl ${
          !lightTheme && "backdrop-blur-lg"
        } border shadow-md hover:shadow-xl hover:border-blue-300 transition-all duration-300`}
      >
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
            Bộ sưu tập huy hiệu
          </h3>
          <Trophy className="w-6 h-6 text-yellow-500" />
        </div>
        <div className="flex items-baseline mb-2">
          <span
            className={`text-3xl ${
              lightTheme ? "text-blue-600" : "text-cyan-400"
            } font-bold mr-2`}
          >
            {earnedCount}
          </span>
          <span
            className={`${lightTheme ? "text-slate-500" : "text-gray-300"}`}
          >
            / {totalBadges} đã đạt
          </span>
        </div>
        <div className="mb-4">
          <Progress
            percent={completionRate}
            showInfo={false}
            strokeColor={{
              "0%": "#3b82f6",
              "100%": "#8b5cf6",
            }}
            trailColor={lightTheme ? "#e2e8f0" : "#374151"}
            className="mb-2"
          />
          <p
            className={`text-sm ${
              lightTheme ? "text-slate-600" : "text-gray-400"
            }`}
          >
            Bạn đã đạt được {completionRate}% tổng số huy hiệu!
          </p>
        </div>
      </div>

      {/* Thành tựu gần đây */}
      <div
        className={`${
          lightTheme
            ? "bg-gradient-to-br from-white to-gray-50 border-gray-200"
            : "bg-white/10 border-white/20"
        } p-6 rounded-2xl ${
          !lightTheme && "backdrop-blur-lg"
        } border shadow-md hover:shadow-xl hover:border-blue-300 transition-all duration-300`}
      >
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
            Thành tựu gần đây
          </h3>
          <Award className="w-6 h-6 text-green-500" />
        </div>
        {recent.length > 0 ? (
          <div className="space-y-3">
            {recent.map((badge, index) => (
              <div
                key={badge.id || index}
                className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  lightTheme
                    ? "hover:bg-blue-50 border hover:border-blue-200"
                    : "hover:bg-white/10 border border-transparent hover:border-white/20"
                }`}
                onClick={() => onView && onView(badge)}
              >
                <div className="mr-3">
                  <BadgeIcon
                    icon={badge.icon}
                    url_image={badge.url_image}
                    size="md"
                    earned={true}
                  />
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-medium text-sm ${
                      lightTheme ? "text-slate-800" : "text-white"
                    }`}
                  >
                    {badge.name}
                  </h4>
                  <p
                    className={`text-xs ${
                      lightTheme ? "text-slate-500" : "text-gray-400"
                    }`}
                  >
                    {badge.tier}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Star
              className={`w-12 h-12 mx-auto mb-2 ${
                lightTheme ? "text-slate-300" : "text-gray-500"
              }`}
            />
            <p
              className={`text-sm ${
                lightTheme ? "text-slate-500" : "text-gray-400"
              }`}
            >
              Chưa có thành tựu nào được đạt
            </p>
          </div>
        )}
      </div>

      {/* Thống kê tổng quan */}
      <div
        className={`${
          lightTheme
            ? "bg-gradient-to-br from-white to-gray-50 border-gray-200"
            : "bg-white/10 border-white/20"
        } p-6 rounded-2xl ${
          !lightTheme && "backdrop-blur-lg"
        } border shadow-md hover:shadow-xl hover:border-blue-300 transition-all duration-300`}
      >
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
            Thống kê
          </h3>
          <Star className="w-6 h-6 text-purple-500" />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span
              className={`text-sm ${
                lightTheme ? "text-slate-600" : "text-gray-300"
              }`}
            >
              Tổng số huy hiệu
            </span>
            <span
              className={`font-bold ${
                lightTheme ? "text-slate-800" : "text-white"
              }`}
            >
              {totalBadges}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span
              className={`text-sm ${
                lightTheme ? "text-slate-600" : "text-gray-300"
              }`}
            >
              Đã đạt được
            </span>
            <span className={`font-bold text-green-500`}>{earnedCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span
              className={`text-sm ${
                lightTheme ? "text-slate-600" : "text-gray-300"
              }`}
            >
              Còn lại
            </span>
            <span className={`font-bold text-orange-500`}>
              {totalBadges - earnedCount}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span
              className={`text-sm ${
                lightTheme ? "text-slate-600" : "text-gray-300"
              }`}
            >
              Tỷ lệ hoàn thành
            </span>
            <span className={`font-bold text-blue-500`}>{completionRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementStats;
