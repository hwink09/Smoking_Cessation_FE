import { useState, useEffect, useCallback } from "react";
import userBadgeService from "../services/userBadgeService";
import badgeService from "../services/badgeService";
import { message } from "antd";

const useBadgeAchievementsManager = () => {
  const [badges, setBadges] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedBadge, setSelectedBadge] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [newAwards, setNewAwards] = useState([]);
  const [showNewAwardsModal, setShowNewAwardsModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.userId || user?.id;
  const token = localStorage.getItem("token") || user?.token;

  const handleViewBadge = useCallback((badge) => {
    setSelectedBadge(badge);
    setDetailVisible(true);
  }, []);

  const handleShareBadge = useCallback((badge) => {
    if (badge?.earned) {
      setSelectedBadge(badge);
      setShareVisible(true);
    }
  }, []);

  const closeDetailModal = useCallback(() => setDetailVisible(false), []);
  const closeShareModal = useCallback(() => setShareVisible(false), []);

  const checkNewBadges = useCallback(async () => {
    try {
      const result = await userBadgeService.checkAndAwardBadges?.();
      if (result?.newBadges?.length) {
        setNewAwards(result.newBadges);
        setShowNewAwardsModal(true);
      }
    } catch {
      console.error("Failed to check for new badges");
    }
  }, []);

  const fetchUserAchievements = useCallback(async () => {
    try {
      const [userBadges, allBadges, progressData] = await Promise.all([
        userBadgeService.getUserBadges(userId),
        badgeService.getAllBadgesWithUserStatus(userId),
        userBadgeService.getUserProgress(token).catch(() => ({})),
      ]);

      const earnedBadgeMap = new Map();
      userBadges.forEach((badge) => {
        const badgeDoc = badge.badge_id || badge;
        const id = badgeDoc?._id || badgeDoc?.id || badge.badge_id || badge._id;
        if (id) {
          earnedBadgeMap.set(id.toString(), {
            earned: true,
            earnedAt:
              badge.date_awarded ||
              badge.awarded_at ||
              badge.createdAt ||
              new Date(),
            badge: badgeDoc,
          });
        }
      });
      const quitDate = progressData?.quit_date || user?.registrationDate;

      const badgeList = allBadges.map((badge) => {
        const badgeId = (badge.id || badge._id).toString();
        const userBadgeInfo = earnedBadgeMap.get(badgeId) || {
          earned: false,
        };
        return {
          ...badge,
          ...userBadgeInfo,
          id: badgeId,
          progress: progressData?.[badge.type] || 0,
          quitDate,
          url_image:
            badge.url_image ||
            badge.image ||
            badge.icon ||
            badge.imageUrl ||
            "",
        };
      });

      return badgeList;
    } catch (error) {
      console.error("Failed to fetch user achievements:", error);
      throw error;
    }
  }, [userId, token, user]);

  const formatBadgeStats = (rawStats) => {
    const total = rawStats?.total || 0;
    const earned = rawStats?.earned || 0;
    return {
      total,
      earned,
      completion: total ? Math.round((earned / total) * 100) : 0,
    };
  };

  const fetchBadgeStats = useCallback(async (badgeData) => {
    try {
      const rawStats = await userBadgeService.getUserBadgeStats();
      return formatBadgeStats(rawStats);
    } catch {
      const earned = badgeData.filter((b) => b.earned).length;
      const total = badgeData.length;
      return {
        total,
        earned,
        completion: total ? Math.round((earned / total) * 100) : 0,
      };
    }
  }, []);

  const shareBadge = useCallback(
    async (badgeId, content) => {
      if (!userId || !badgeId) return false;
      try {
        setLoading(true);
        await userBadgeService.shareBadge({
          badge_id: badgeId,
          content: content || "I earned this badge!",
        });
        message.success("Badge shared successfully!");
        return true;
      } catch {
        message.error("Failed to share badge");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      await checkNewBadges();
      const badgeData = await fetchUserAchievements();
      const statsData = await fetchBadgeStats(badgeData);

      setBadges(badgeData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setBadges([]);
      setStats({});
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [checkNewBadges, fetchUserAchievements, fetchBadgeStats]);

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    selectedBadge,
    detailVisible,
    shareVisible,
    handleViewBadge,
    handleShareBadge,
    closeDetailModal,
    closeShareModal,
    badges,
    stats,
    loading,
    error,
    shareBadge,
    newAwards,
    showNewAwardsModal,
    setShowNewAwardsModal,
    refreshData,
  };
};

export default useBadgeAchievementsManager;
