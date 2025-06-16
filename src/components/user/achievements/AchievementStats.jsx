import React from "react";
import BadgeCollectionCard from "./BadgeCollectionCard";
import InProgressCard from "./InProgressCard";
import RecentAchievementsCard from "./RecentAchievementsCard";

const AchievementStats = ({
  badges,
  totalEarnedBadges,
  totalBadges,
  completionRate,
  handleViewBadge,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
      {/* Badge Summary Card */}
      <BadgeCollectionCard
        totalEarnedBadges={totalEarnedBadges}
        totalBadges={totalBadges}
        completionRate={completionRate}
      />

      {/* Ongoing Achievements */}
      <InProgressCard
        badges={badges.filter((badge) => !badge.earned && badge.progress)}
      />

      {/* Recent Achievements */}
      <RecentAchievementsCard
        badges={badges.filter((badge) => badge.earned)}
        onBadgeClick={handleViewBadge}
      />
    </div>
  );
};

export default AchievementStats;
