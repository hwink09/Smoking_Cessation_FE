import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  fetchProgressAPI,
  createProgressAPI,
  updateProgressAPI,
  deleteProgressAPI,
  getUserOverallProgressAPI,
  getSinglePlanProgressAPI,
  getProgressByStageUserAPI,
} from "~/services/progressService";
import { message } from "antd";
import dayjs from "dayjs";

const useProgress = (userId = null, stageId = null, planId = null) => {
  const [progress, setProgress] = useState([]);
  const [overallProgress, setOverallProgress] = useState(null);
  const [planProgress, setPlanProgress] = useState(null);
  const [stageProgress, setStageProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const loadingRefs = useRef({
    fetchProgress: false,
    fetchUserOverall: false,
    fetchPlan: false,
    fetchStage: false
  });
  
  const STORAGE_KEY = `progress_data_${userId || 'default'}`;

  const getLocalProgress = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  }, [STORAGE_KEY]);

  const saveLocalProgress = useCallback((data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [STORAGE_KEY]);

  const fetchProgress = useCallback(async () => {
    if (loadingRefs.current.fetchProgress) return;
    
    loadingRefs.current.fetchProgress = true;
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchProgressAPI();
      setProgress(data);
      saveLocalProgress(data);
    } catch (err) {
      console.error("Error fetching progress:", err);
      setError(err.message || "Không thể tải dữ liệu tiến độ");
      const localData = getLocalProgress();
      setProgress(localData);
    } finally {
      loadingRefs.current.fetchProgress = false;
      setLoading(false);
    }
  }, [saveLocalProgress, getLocalProgress]);

  const fetchUserOverallProgress = useCallback(async (targetUserId = userId) => {
    if (!targetUserId || loadingRefs.current.fetchUserOverall) return;
    
    loadingRefs.current.fetchUserOverall = true;
    setLoading(true);
    setError(null);
    
    try {
      const data = await getUserOverallProgressAPI(targetUserId);
      setOverallProgress(data);
    } catch (err) {
      console.error("Error fetching user overall progress:", err);
      setError(err.message || "Không thể tải tổng quan tiến độ");
    } finally {
      loadingRefs.current.fetchUserOverall = false;
      setLoading(false);
    }
  }, [userId]);

  const fetchPlanProgress = useCallback(async (targetPlanId = planId) => {
    if (!targetPlanId || loadingRefs.current.fetchPlan) return;
    
    loadingRefs.current.fetchPlan = true;
    setLoading(true);
    setError(null);
    
    try {
      const data = await getSinglePlanProgressAPI(targetPlanId);
      setPlanProgress(data);
    } catch (err) {
      console.error("Error fetching plan progress:", err);
      setError(err.message || "Không thể tải tiến độ kế hoạch");
    } finally {
      loadingRefs.current.fetchPlan = false;
      setLoading(false);
    }
  }, [planId]);

  const fetchStageProgress = useCallback(async (targetStageId = stageId) => {
    if (!targetStageId || loadingRefs.current.fetchStage) return;
    
    loadingRefs.current.fetchStage = true;
    setLoading(true);
    setError(null);
    
    try {
      const data = await getProgressByStageUserAPI(targetStageId);
      setStageProgress(data);
    } catch (err) {
      console.error("Error fetching stage progress:", err);
      setError(err.message || "Không thể tải tiến độ giai đoạn");
    } finally {
      loadingRefs.current.fetchStage = false;
      setLoading(false);
    }
  }, [stageId]);

  const createProgressEntry = useCallback(async (progressData) => {
    if (submitting) return;
    
    setSubmitting(true);
    setError(null);
    
    // Transform data to match backend format
    const payload = {
      stage_id: progressData.stageId || stageId,
      date: progressData.date || dayjs().format("YYYY-MM-DD"),
      cigarettes_smoked: progressData.cigarettesSmoked || progressData.cigarettes || 0,
      health_stat: progressData.healthStat || progressData.symptoms || "",
      money_saved: progressData.moneySaved || 0,
      user_id: progressData.userId || userId,
      // Additional fields that might be in the original entry
      mood: progressData.mood,
      health_rating: progressData.health,
      smoked: progressData.smoked,
    };

    try {
      const newEntry = await createProgressAPI(payload);
      
      // Update local state
      setProgress(prev => {
        const updated = [newEntry, ...prev];
        saveLocalProgress(updated);
        return updated;
      });
      
      message.success("Đã lưu nhật ký tiến độ thành công!");
      return newEntry;
    } catch (err) {
      console.error("Error creating progress entry:", err);
      setError(err.message || "Không thể tạo nhật ký tiến độ");
      
      // Save to local storage as fallback
      const localEntry = {
        id: `local_${Date.now()}`,
        ...payload,
        created_at: new Date().toISOString(),
        isLocal: true
      };
      
      setProgress(prev => {
        const updated = [localEntry, ...prev];
        saveLocalProgress(updated);
        return updated;
      });
      
      message.warning("Đã lưu nhật ký cục bộ. Sẽ đồng bộ khi có kết nối.");
      return localEntry;
    } finally {
      setSubmitting(false);
    }
  }, [submitting, stageId, userId, saveLocalProgress]);

  // Update progress entry
  const updateProgressEntry = useCallback(async (id, progressData) => {
    if (submitting) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const updatedEntry = await updateProgressAPI(id, progressData);
      
      setProgress(prev => {
        const updated = prev.map(item => 
          item.id === id ? updatedEntry : item
        );
        saveLocalProgress(updated);
        return updated;
      });
      
      message.success("Đã cập nhật nhật ký thành công!");
      return updatedEntry;
    } catch (err) {
      console.error("Error updating progress entry:", err);
      setError(err.message || "Không thể cập nhật nhật ký");
      message.error("Không thể cập nhật nhật ký");
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [submitting, saveLocalProgress]);

  // Delete progress entry
  const deleteProgressEntry = useCallback(async (id) => {
    if (submitting) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      await deleteProgressAPI(id);
      
      setProgress(prev => {
        const updated = prev.filter(item => item.id !== id);
        saveLocalProgress(updated);
        return updated;
      });
      
      message.success("Đã xóa nhật ký thành công!");
    } catch (err) {
      console.error("Error deleting progress entry:", err);
      setError(err.message || "Không thể xóa nhật ký");
      message.error("Không thể xóa nhật ký");
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [submitting, saveLocalProgress]);

  // Calculate statistics
  const calculateStats = useCallback((quitDate, cigarettesPerDay = 20, pricePerPack = 50000, cigarettesPerPack = 20) => {
    const now = new Date();
    const quit = new Date(quitDate);
    const daysDiff = Math.max(0, Math.floor((now - quit) / (1000 * 3600 * 24)));
    
    const cigarettesAvoided = daysDiff * cigarettesPerDay;
    const packsAvoided = cigarettesAvoided / cigarettesPerPack;
    const moneySaved = packsAvoided * pricePerPack;
    const healthImprovement = Math.min((daysDiff / 365) * 100, 100);
    
    return {
      days: daysDiff,
      moneySaved,
      healthImprovement: healthImprovement.toFixed(1),
      cigarettesAvoided,
    };
  }, []);

  // Get recent entries (last 7 days)
  const recentEntries = useMemo(() => {
    return progress.filter(entry => {
      const entryDate = dayjs(entry.date);
      const daysDiff = dayjs().diff(entryDate, 'day');
      return daysDiff >= 0 && daysDiff < 7;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [progress]);

  // Calculate averages for recent entries
  const recentStats = useMemo(() => {
    if (recentEntries.length === 0) {
      return {
        averageMood: 0,
        averageHealth: 0,
        smokeFreePercentage: 100,
        totalCigarettes: 0
      };
    }

    const totalMood = recentEntries.reduce((sum, entry) => sum + (entry.mood || 0), 0);
    const totalHealth = recentEntries.reduce((sum, entry) => sum + (entry.health_rating || entry.health || 0), 0);
    const smokeFreeEntries = recentEntries.filter(entry => !entry.smoked && entry.cigarettes_smoked === 0);
    const totalCigarettes = recentEntries.reduce((sum, entry) => sum + (entry.cigarettes_smoked || 0), 0);

    return {
      averageMood: (totalMood / recentEntries.length).toFixed(1),
      averageHealth: (totalHealth / recentEntries.length).toFixed(1),
      smokeFreePercentage: ((smokeFreeEntries.length / recentEntries.length) * 100).toFixed(0),
      totalCigarettes
    };
  }, [recentEntries]);

  // Load local data on mount
  useEffect(() => {
    const localData = getLocalProgress();
    if (localData.length > 0) {
      setProgress(localData);
    }
  }, [getLocalProgress]);

  // Auto-fetch data when dependencies change - only run once per dependency change
  // Only fetch what we actually need for the progress tracking page
  // useEffect(() => {
  //   if (userId && !loadingRefs.current.fetchUserOverall) {
  //     fetchUserOverallProgress(userId);
  //   }
  // }, [userId]); // Removed fetchUserOverallProgress from deps to prevent loop

  // useEffect(() => {
  //   if (planId && !loadingRefs.current.fetchPlan) {
  //     fetchPlanProgress(planId);
  //   }
  // }, [planId]); // Removed fetchPlanProgress from deps to prevent loop

  // Only fetch stage progress if needed - for now, disable auto-fetching
  // useEffect(() => {
  //   if (stageId && !loadingRefs.current.fetchStage) {
  //     fetchStageProgress(stageId);
  //   }
  // }, [stageId]); // Removed fetchStageProgress from deps to prevent loop

  return {
    // State
    progress,
    overallProgress,
    planProgress,
    stageProgress,
    recentEntries,
    recentStats,
    loading,
    submitting,
    error,
    
    // Actions
    fetchProgress,
    fetchUserOverallProgress,
    fetchPlanProgress,
    fetchStageProgress,
    createProgressEntry,
    updateProgressEntry,
    deleteProgressEntry,
    
    // Utilities
    calculateStats,
    
    // Reset functions
    clearError: () => setError(null),
    refreshProgress: () => fetchProgress(),
  };
};

export default useProgress;
