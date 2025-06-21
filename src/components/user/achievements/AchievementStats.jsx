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
      {/* Badge Collection */}
      <div
        className={`${
          lightTheme
            ? "bg-slate-50 border-slate-200"
            : "bg-white/10 border-white/20"
        } p-6 rounded-2xl ${
          !lightTheme && "backdrop-blur-lg"
        } border shadow-xl`}
      >
        <div className="flex justify-between mb-4">
          <h3
            className={`text-xl font-bold ${
              lightTheme ? "text-slate-800" : "text-white"
            }`}
          >
            Badge Collection
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
            / {badges.length} earned
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
          You've earned {completionRate}% of all achievements!
        </p>
      </div>

      {/* In Progress */}
      <div
        className={`${
          lightTheme
            ? "bg-slate-50 border-slate-200"
            : "bg-white/10 border-white/20"
        } p-6 rounded-2xl ${
          !lightTheme && "backdrop-blur-lg"
        } border shadow-xl`}
      >
        <div className="flex justify-between mb-4">
          <h3
            className={`text-xl font-bold ${
              lightTheme ? "text-slate-800" : "text-white"
            }`}
          >
            In Progress
          </h3>
          <Timer className="w-7 h-7 text-blue-500" />
        </div>
        {inProgress.length > 0 ? (
          inProgress.map((b) => (
            <div key={b.id} className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <div className="mr-2">
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
                    }`}
                  >
                    {b.name}
                  </span>
                </div>{" "}
                <span
                  className={`${
                    lightTheme ? "text-blue-600" : "text-cyan-400"
                  } font-semibold`}
                >
                  {b.progress ? `${b.progress}%` : "Not Started"}
                </span>
              </div>
              <Progress
                percent={b.progress || 0}
                showInfo={false}
                strokeColor={{ "0%": "#722ed1", "100%": b.color }}
              />
              <p
                className={`text-xs ${
                  lightTheme ? "text-slate-500" : "text-gray-400"
                }`}
              >
                {b.description}
              </p>
            </div>
          ))
        ) : (
          <p
            className={`${
              lightTheme ? "text-slate-500" : "text-gray-300"
            } text-center`}
          >
            No achievements in progress
          </p>
        )}
      </div>

      {/* Recent */}
      <div
        className={`${
          lightTheme
            ? "bg-slate-50 border-slate-200"
            : "bg-white/10 border-white/20"
        } p-6 rounded-2xl ${
          !lightTheme && "backdrop-blur-lg"
        } border shadow-xl`}
      >
        <div className="flex justify-between mb-4">
          <h3
            className={`text-xl font-bold ${
              lightTheme ? "text-slate-800" : "text-white"
            }`}
          >
            Recent Achievements
          </h3>
          <Zap className="w-7 h-7 text-yellow-500" />
        </div>
        {recent.length > 0 ? (
          recent.map((b) => (
            <div
              key={b.id}
              className={`flex items-center p-2 mb-2 rounded-lg ${
                lightTheme
                  ? "bg-white hover:bg-slate-100 border border-slate-100"
                  : "bg-white/5 hover:bg-white/10"
              } cursor-pointer transition-all`}
              onClick={() => onView(b)}
            >
              {" "}
              <div className="mr-3">
                <BadgeIcon
                  icon={b.icon}
                  url_image={b.url_image}
                  size="lg"
                  earned={true}
                />
              </div>
              <div>
                <h4
                  className={`${
                    lightTheme ? "text-slate-800" : "text-gray-200"
                  }`}
                >
                  {b.name}
                </h4>
                <p
                  className={`text-xs ${
                    lightTheme ? "text-slate-500" : "text-gray-400"
                  }`}
                >
                  Earned on {new Date(b.earnedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p
            className={`${
              lightTheme ? "text-slate-500" : "text-gray-300"
            } text-center`}
          >
            No achievements yet
          </p>
        )}
      </div>
    </div>
  );
};

export default AchievementStats;
