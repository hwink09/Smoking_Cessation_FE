import React, { useState } from "react";
import AchievementHeader from "./AchievementHeader";
import AchievementStats from "./AchievementStats";
import FeaturedBadgeMarquee from "./FeaturedBadgeMarquee";
import BadgeCategoriesTabs from "./BadgeCategoriesTabs";
import BadgeDetailModal from "./BadgeDetailModal";
import ShareModal from "./ShareModal";
import { useAchievementData } from "./useAchievementData";

const Achievements = () => {
  const {
    badges,
    badgesByCategory,
    totalEarnedBadges,
    totalBadges,
    completionRate,
  } = useAchievementData();
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [badgeModalVisible, setBadgeModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const handleViewBadge = (badge) => {
    setSelectedBadge(badge);
    setBadgeModalVisible(true);
  };

  const handleShareBadge = (badge) => {
    setSelectedBadge(badge);
    setShareModalVisible(true);
  };

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <AchievementHeader />

        {/* Achievement Stats */}
        <AchievementStats
          badges={badges}
          totalEarnedBadges={totalEarnedBadges}
          totalBadges={totalBadges}
          completionRate={completionRate}
          handleViewBadge={handleViewBadge}
        />

        {/* Featured Badge Marquee */}
        <FeaturedBadgeMarquee
          badges={badges.filter((badge) => badge.earned)}
          onBadgeClick={handleViewBadge}
        />

        {/* Badge Categories */}
        <BadgeCategoriesTabs
          badgesByCategory={badgesByCategory}
          onViewBadge={handleViewBadge}
          onShareBadge={handleShareBadge}
        />

        {/* Modals */}
        <BadgeDetailModal
          badge={selectedBadge}
          visible={badgeModalVisible}
          onClose={() => setBadgeModalVisible(false)}
          onShare={handleShareBadge}
        />

        <ShareModal
          badge={selectedBadge}
          visible={shareModalVisible}
          onClose={() => setShareModalVisible(false)}
        />
      </div>
    </div>
  );
};

export default Achievements;
