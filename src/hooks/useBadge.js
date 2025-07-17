import { useState, useEffect, useCallback } from "react";
import * as userBadgeService from "../services/userBadgeService";
import * as badgeService from "../services/badgeService";
import { message } from "antd";

const useBadgeAchievementsManager = (userId, token) => {
  const [badges, setBadges] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);

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

  // Fetch tất cả badges với trạng thái user từ backend
  const fetchUserAchievements = useCallback(async () => {
    if (!userId) return [];

    try {
      const badgeData = await badgeService.getAllBadgesWithUserStatusAPI(
        userId
      );
      return badgeData.map((badge) => ({
        ...badge,
        id: badge.id || badge._id,
        url_image:
          badge.url_image || badge.image || badge.icon || badge.imageUrl || "",
      }));
    } catch (error) {
      return [];
    }
  }, [userId]);

  // Tính toán stats từ badge data
  const fetchBadgeStats = useCallback(async (badgeData) => {
    const earned = badgeData.filter((b) => b.earned).length;
    const total = badgeData.length;
    return {
      total,
      earned,
      completion: total ? Math.round((earned / total) * 100) : 0,
    };
  }, []);

  // Share badge functionality
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

  // Refresh data function
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const badgeData = await fetchUserAchievements();
      const statsData = await fetchBadgeStats(badgeData);

      setBadges(badgeData || []);
      setStats(statsData || {});
      setError(null);
    } catch (err) {
      setBadges([]);
      setStats({
        total: 0,
        earned: 0,
        completion: 0,
      });
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchUserAchievements, fetchBadgeStats]);

  // Load data when userId changes
  useEffect(() => {
    if (userId) {
      refreshData();
    }
  }, [userId, refreshData]);

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
    refreshData,
  };
};

export default useBadgeAchievementsManager;
