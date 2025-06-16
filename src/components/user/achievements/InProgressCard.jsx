import React from "react";
import { Timer } from "lucide-react";
import { Progress } from "antd";

const InProgressCard = ({ badges }) => {
  // Sort badges by progress and take top 2
  const topInProgressBadges = [...badges]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 2);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">In Progress</h3>
        <Timer className="w-7 h-7 text-blue-400" />
      </div>

      {topInProgressBadges.map((badge) => (
        <div key={badge.id} className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <span className="text-2xl mr-2">{badge.icon}</span>
              <span className="text-gray-200">{badge.name}</span>
            </div>
            <span className="text-cyan-400 font-semibold">
              {badge.progress}%
            </span>
          </div>
          <Progress
            percent={badge.progress}
            showInfo={false}
            strokeColor={{
              "0%": "#722ed1",
              "100%": badge.color,
            }}
            className="mb-1"
          />
          <p className="text-xs text-gray-400">{badge.description}</p>
        </div>
      ))}

      {topInProgressBadges.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-300">No achievements in progress</p>
        </div>
      )}
    </div>
  );
};

export default InProgressCard;
