import { useState, useCallback } from "react";
import StageService from "~/services/stageService";

export function useStageService() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllStages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await StageService.getAllStages();
      setStages(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStagesByPlanId = useCallback(async (planId) => {
    setLoading(true);
    try {
      const data = await StageService.getStagesByPlanId(planId);
      setStages(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStageById = useCallback(async (id) => {
    setLoading(true);
    try {
      const stage = await StageService.getStageById(id);
      setError(null);
      return stage;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createStage = useCallback(async (data) => {
    try {
      const newStage = await StageService.createStage(data);
      return newStage;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const updateStage = useCallback(async (id, data) => {
    try {
      const updatedStage = await StageService.updateStage(id, data);
      return updatedStage;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const deleteStage = useCallback(async (id) => {
    try {
      const result = await StageService.deleteStage(id);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  return {
    stages,
    loading,
    error,
    fetchAllStages,
    fetchStagesByPlanId,
    fetchStageById,
    createStage,
    updateStage,
    deleteStage,
  };
}
