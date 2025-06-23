import React from "react";
import { Trophy, Timer, Zap } from "lucide-react";
import { Progress } from "antd";
import BadgeIcon from "../../ui/BadgeIcon";

const AchievementStats = ({ badges = [], stats = {}, onView, lightTheme }) => {
  const badgesArray = Array.isArray(badges) ? badges : [];

  const earned = badgesArray.filter((b) => b && b.earned);
  const inProgress = badgesArray
    .filter((b) => b && !b.earned)
    .sort((a, b) => (b.progress || 0) - (a.progress || 0))
    .slice(0, 3);
  const recent = [...earned]
    .sort((a, b) => new Date(b.earnedAt || 0) - new Date(a.earnedAt || 0))
    .slice(0, 3);

  const completionRate =
    earned.length && badgesArray.length
      ? Math.round((earned.length / badgesArray.length) * 100)
      : 0;

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
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
            Bộ sưu tập huy hiệu
          </h3>
          <Trophy className="w-7 h-7 text-yellow-500" />
        </div>
        <div className="flex items-baseline mb-2">
          <span
            className={`text-3xl ${
              lightTheme ? "text-blue-600" : "text-cyan-400"
            } font-bold mr-2`}
          >
            {earned.length}
          </span>
          <span
            className={`${lightTheme ? "text-slate-500" : "text-gray-300"}`}
          >
            / {badges.length} đã nhận
          </span>
        </div>
        <Progress
          percent={completionRate}
          status="active"
          strokeColor={{ "0%": "#13c2c2", "100%": "#1890ff" }}
        />
        <p
          className={`text-sm ${
            lightTheme ? "text-slate-500" : "text-gray-300"
          } mt-2`}
        >
          Bạn đã đạt được {completionRate}% tổng số huy hiệu!
        </p>
      </div>

      {/* Đang tiến hành */}
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
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
            Đang tiến hành
          </h3>
          <Timer className="w-7 h-7 text-blue-500" />
        </div>
        {inProgress.length > 0 ? (
          inProgress.map((b) => (
            <div
              key={b.id}
              className="mb-3 cursor-pointer"
              onClick={() => onView(b)}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <div className="mr-2 bg-gradient-to-br from-white to-gray-50 p-1 rounded-full hover:shadow-md hover:border-blue-300 border border-gray-200 transition-all duration-300">
                    <BadgeIcon
                      icon={b.icon}
                      url_image={b.url_image}
                      size="md"
                      earned={false}
                    />
                  </div>
                  <span
                    className={`${
                      lightTheme ? "text-slate-700" : "text-gray-200"
                    } text-sm font-medium`}
                  >
                    {b.name}
                  </span>
                </div>
                <span
                  className={`${
                    lightTheme ? "text-slate-600" : "text-gray-300"
                  } text-xs`}
                >
                  {Math.round(b.progress || 0)}%
                </span>
              </div>
              <Progress
                percent={b.progress || 0}
                size="small"
                showInfo={false}
                status="active"
                strokeColor={b.color || "#1890ff"}
              />
            </div>
          ))
        ) : (
          <div
            className={`text-sm ${
              lightTheme ? "text-slate-500" : "text-gray-300"
            } mt-2`}
          >
            Không có huy hiệu nào đang tiến hành.
          </div>
        )}
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
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
            Thành tựu gần đây
          </h3>
          <Zap className="w-7 h-7 text-purple-500" />
        </div>
        {recent.length > 0 ? (
          recent.map((b) => (
            <div
              key={b.id}
              className="flex items-center mb-3 p-2 cursor-pointer hover:bg-gradient-to-br hover:from-white hover:to-gray-50 hover:border-blue-300 rounded-md border border-transparent transition-all duration-300"
              onClick={() => onView(b)}
            >
              <div className="mr-3 bg-gradient-to-br from-white to-gray-50 p-1 rounded-full hover:shadow-md border border-gray-200 transition-all duration-300">
                <BadgeIcon
                  icon={b.icon}
                  url_image={b.url_image}
                  size="md"
                  earned={true}
                />
              </div>
              <div className="flex-1">
                <div
                  className={`${
                    lightTheme ? "text-slate-700" : "text-gray-200"
                  } text-sm font-medium`}
                >
                  {b.name}
                </div>
                {b.earnedAt && (
                  <div
                    className={`${
                      lightTheme ? "text-slate-500" : "text-gray-400"
                    } text-xs`}
                  >
                    {new Date(b.earnedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div
            className={`text-sm ${
              lightTheme ? "text-slate-500" : "text-gray-300"
            } mt-2`}
          >
            Bạn chưa có thành tựu nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementStats;
