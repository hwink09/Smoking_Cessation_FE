import { useState, useEffect, useCallback } from "react";
import * as userBadgeService from "../services/userBadgeService";
import * as badgeService from "../services/badgeService";
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
      // This function would typically check for any new badges awarded to the user
      // Since we don't have a direct API for this, we'll skip this step
      console.log("Badge checking skipped - no direct API equivalent");

      // We won't show any new awards dialog since we're not checking for new badges
      setNewAwards([]);
      setShowNewAwardsModal(false);
    } catch {
      console.error("Failed to check for new badges");
    }
  }, []);

  const fetchUserAchievements = useCallback(async () => {
    try {
      const [userBadgesResponse, allBadges, progressData] = await Promise.all([
        userBadgeService.getUserBadgesAPI(userId),
        badgeService.getAllBadgesAPI(),
        // Use getUserProgressAPI instead of getUserProgress
        userBadgeService.getUserProgressAPI(token).catch(() => ({})),
      ]);

      const userBadges = userBadgesResponse.data || [];

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
      // Return empty data instead of throwing error
      return [];
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
      // Check if this function exists or needs to be updated
      const rawStatsResponse = await userBadgeService.getBadgeCountAPI();
      const rawStats = rawStatsResponse.data || {};
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
        await userBadgeService.shareBadgeAPI({
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
      await checkNewBadges().catch((error) =>
        console.warn(
          "Failed to check new badges:",
          error?.message || "Unknown error"
        )
      );

      const badgeData = await fetchUserAchievements();
      const statsData = await fetchBadgeStats(badgeData);

      setBadges(badgeData || []);
      setStats(statsData || {});
      setError(null);
    } catch (err) {
      console.warn(
        "Error refreshing achievement data:",
        err?.message || "Unknown error"
      );
      // Set empty data as fallback
      setBadges([]);
      setStats({
        total: 0,
        earned: 0,
        percentage: 0,
      });
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
