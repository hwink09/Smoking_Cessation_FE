import React from "react";
import { Zap } from "lucide-react";

const RecentAchievementsCard = ({ badges, onBadgeClick }) => {
  // Sort badges by earnedAt date (recent first) and take top 3
  const recentBadges = [...badges]
    .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
    .slice(0, 3);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Recent Achievements</h3>
        <Zap className="w-7 h-7 text-yellow-400" />
      </div>

      {recentBadges.map((badge) => (
        <div
          key={badge.id}
          className="flex items-center p-2 mb-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
          onClick={() => onBadgeClick(badge)}
        >
          <span className="text-2xl mr-3">{badge.icon}</span>
          <div>
            <h4 className="text-gray-200">{badge.name}</h4>
            <p className="text-xs text-gray-400">
              Earned on {new Date(badge.earnedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}

      {recentBadges.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-300">No achievements yet</p>
        </div>
      )}
    </div>
  );
};

export default RecentAchievementsCard;
