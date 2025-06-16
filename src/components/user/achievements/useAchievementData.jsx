import { useState, useMemo } from "react";

export const useAchievementData = () => {
  // Mock data for demonstrations - this would come from API in real implementation
  const [quitDate] = useState(new Date("2024-01-15"));
  const [cigarettesPerDay] = useState(20);
  const [pricePerPack] = useState(50000);
  const [cigarettesPerPack] = useState(20);

  const calculateStats = () => {
    const now = new Date();
    const timeDiff = now.getTime() - quitDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    const cigarettesAvoided = daysDiff * cigarettesPerDay;
    const packsAvoided = cigarettesAvoided / cigarettesPerPack;
    const moneySaved = packsAvoided * pricePerPack;
    const healthImprovement = Math.min((daysDiff / 365) * 100, 100);

    return {
      days: daysDiff,
      moneySaved: Math.round(moneySaved),
      healthImprovement: Math.round(healthImprovement * 10) / 10,
      cigarettesAvoided,
    };
  };

  const stats = calculateStats();

  const badges = useMemo(
    () => [
      // Time-based achievements
      {
        id: 1,
        name: "First Day Free",
        description: "Complete your first day without smoking",
        category: "time",
        earned: true,
        earnedAt: "2024-01-16",
        icon: "🌱",
        color: "#52c41a",
        tier: "Bronze",
      },
      {
        id: 4,
        name: "Monthly Master",
        description: "30 days smoke-free",
        category: "time",
        earned: stats.days >= 30,
        earnedAt: stats.days >= 30 ? "2024-02-15" : null,
        progress: Math.min(Math.round((stats.days / 30) * 100), 100),
        icon: "⭐",
        color: "#1890ff",
        tier: "Silver",
      },
      {
        id: 7,
        name: "One Year Legend",
        description: "365 days smoke-free",
        category: "time",
        earned: stats.days >= 365,
        earnedAt: stats.days >= 365 ? "2025-01-15" : null,
        progress: Math.min(Math.round((stats.days / 365) * 100), 100),
        icon: "👑",
        color: "#f5222d",
        tier: "Diamond",
      },

      // Health achievements
      {
        id: 8,
        name: "Breath of Fresh Air",
        description: "Blood oxygen levels improved after 3 days",
        category: "health",
        earned: stats.days >= 3,
        earnedAt: stats.days >= 3 ? "2024-01-18" : null,
        progress: Math.min(Math.round((stats.days / 3) * 100), 100),
        icon: "💨",
        color: "#13c2c2",
        tier: "Bronze",
      },

      // Money savings
      {
        id: 11,
        name: "Penny Pincher",
        description: "Saved 500,000 VND",
        category: "money",
        earned: stats.moneySaved >= 500000,
        earnedAt: stats.moneySaved >= 500000 ? "2024-01-25" : null,
        progress: Math.min(Math.round((stats.moneySaved / 500000) * 100), 100),
        icon: "💰",
        color: "#faad14",
        tier: "Bronze",
      },

      // Cigarette avoidance
      {
        id: 14,
        name: "Clean Lungs Starter",
        description: "Avoided 100 cigarettes",
        category: "avoidance",
        earned: stats.cigarettesAvoided >= 100,
        earnedAt: stats.cigarettesAvoided >= 100 ? "2024-01-20" : null,
        progress: Math.min(
          Math.round((stats.cigarettesAvoided / 100) * 100),
          100
        ),
        icon: "🚭",
        color: "#52c41a",
        tier: "Bronze",
      },
    ],
    [stats]
  );

  const badgesByCategory = useMemo(
    () => ({
      time: badges.filter((badge) => badge.category === "time"),
      health: badges.filter((badge) => badge.category === "health"),
      money: badges.filter((badge) => badge.category === "money"),
      avoidance: badges.filter((badge) => badge.category === "avoidance"),
    }),
    [badges]
  );

  const totalEarnedBadges = badges.filter((badge) => badge.earned).length;
  const totalBadges = badges.length;
  const completionRate = (totalEarnedBadges / totalBadges) * 100;

  return {
    stats,
    badges,
    badgesByCategory,
    totalEarnedBadges,
    totalBadges,
    completionRate,
  };
};
