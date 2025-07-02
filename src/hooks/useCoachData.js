import { useState, useCallback } from "react";
import CoachService from "~/services/coachProfileService";

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

  return {
    loading,
    error,
    createCoachProfile,
    getAllCoaches,
    getCoachById,
    updateCoachProfile,
    deleteCoachProfile,
  };
};

export default useCoachData;
