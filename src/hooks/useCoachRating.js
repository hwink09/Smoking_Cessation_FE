import { useState, useEffect, useCallback } from "react";
import FeedbackService from "~/services/feedbackService";

/**
 * Hook để kiểm tra xem user đã đánh giá coach trong plan chưa
 * @param {string} coachId - ID của coach
 * @param {string} planId - ID của quit plan (tùy chọn)
 * @param {string} userId - ID của user
 * @returns {Object} - { hasRated, checkRating, loading, setHasRated, error }
 */
const useCoachRating = (coachId, planId, userId) => {
  const [hasRated, setHasRated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkRating = useCallback(async () => {
    // Reset error state
    setError(null);

    // Validate required parameters
    if (!coachId || !userId) {
      setHasRated(false);
      return false;
    }

    setLoading(true);
    try {
      const response = await FeedbackService.getUserFeedback(userId);

      // Handle different response formats from backend
      const feedbacks = Array.isArray(response)
        ? response
        : response.data || [];

      // Validate feedbacks is array
      if (!Array.isArray(feedbacks)) {
        console.warn("API không trả về mảng feedbacks:", feedbacks);
        setHasRated(false);
        return false;
      }

      const alreadyRated = feedbacks.some((fb) => {
        // Ensure feedback object has required properties
        if (!fb || typeof fb !== "object") {
          return false;
        }

        // Handle both ObjectId and string comparisons
        const coachMatches =
          fb.coach_id === coachId ||
          (fb.coach_id && fb.coach_id._id === coachId) ||
          (fb.coach_id && fb.coach_id.toString() === coachId);

        const typeMatches = fb.feedback_type === "user_to_coach";

        const planMatches =
          !planId ||
          fb.plan_id === planId ||
          (fb.plan_id && fb.plan_id._id === planId) ||
          (fb.plan_id && fb.plan_id.toString() === planId);

        return coachMatches && typeMatches && planMatches;
      });

      setHasRated(alreadyRated);
      return alreadyRated;
    } catch (error) {
      console.error("Lỗi khi kiểm tra đánh giá coach:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Không thể kiểm tra đánh giá"
      );
      setHasRated(false); // fallback: giả định chưa đánh giá
      return false;
    } finally {
      setLoading(false);
    }
  }, [coachId, planId, userId]);

  useEffect(() => {
    if (coachId && userId) {
      checkRating();
    }
  }, [coachId, planId, userId, checkRating]);

  return {
    hasRated,
    checkRating,
    loading,
    error,
    setHasRated,
  };
};

export default useCoachRating;
