import React from "react";
import { Trophy } from "lucide-react";
import { Progress } from "antd";

const BadgeCollectionCard = ({
  totalEarnedBadges,
  totalBadges,
  completionRate,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Badge Collection</h3>
        <Trophy className="w-7 h-7 text-yellow-400" />
      </div>

      <div className="flex items-baseline mb-2">
        <span className="text-3xl font-bold text-cyan-400 mr-2">
          {totalEarnedBadges}
        </span>
        <span className="text-gray-300">/ {totalBadges} earned</span>
      </div>

      <Progress
        percent={Math.round(completionRate)}
        status="active"
        strokeColor={{
          "0%": "#13c2c2",
          "100%": "#1890ff",
        }}
        className="mb-3"
      />

      <p className="text-gray-300 text-sm">
        You've earned {Math.round(completionRate)}% of all available
        achievements!
      </p>
    </div>
  );
};

export default BadgeCollectionCard;
