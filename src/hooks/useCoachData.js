import { useState, useCallback } from "react";
import CoachService from "~/services/coachProfileService";
import FeedbackService from "~/services/feedbackService";

const useCoachData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = async (requestFn) => {
    setLoading(true);
    setError(null);
    try {
      return await requestFn();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createCoachProfile = useCallback(
    async (coachData) =>
      handleRequest(() => CoachService.createCoachProfile(coachData)),
    []
  );

  const getAllCoaches = useCallback(
    async () => handleRequest(() => CoachService.getAllCoaches()),
    []
  );

  const getCoachById = useCallback(async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const data = await CoachService.getCoachById(id);
      return data;
    } catch (err) {
      setError(err);
      if (err?.response?.status === 404) return null;
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCoachProfile = useCallback(
    async (id, coachData) =>
      handleRequest(() => CoachService.updateCoachProfile(id, coachData)),
    []
  );

  const deleteCoachProfile = useCallback(
    async (id) => handleRequest(() => CoachService.deleteCoachProfile(id)),
    []
  );

  const getCoachRatingInfo = useCallback(async (coachId) => {
    if (!coachId) return { averageRating: 0, totalFeedbacks: 0 };
    setLoading(true);
    setError(null);
    try {
      const data = await FeedbackService.getCoachAverageRating(coachId);
      return {
        averageRating: data.averageRating || 0,
        totalFeedbacks: data.totalFeedbacks || 0,
      };
    } catch (err) {
      console.error("Error fetching coach rating info:", err);
      setError(err);
      return { averageRating: 0, totalFeedbacks: 0 };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createCoachProfile,
    getAllCoaches,
    getCoachById,
    updateCoachProfile,
    deleteCoachProfile,
    getCoachRatingInfo,
  };
};

export default useCoachData;
