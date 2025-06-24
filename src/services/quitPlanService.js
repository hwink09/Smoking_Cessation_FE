import api from "./api";

// -------- Quit Plans --------
export const fetchAllQuitPlansAPI = async () => {
  return await api.get("/quitPlan");
};

export const getQuitPlanByIdAPI = async (id) => {
  return await api.get(`/quitPlan/${id}`);
};

// -------- Stages --------
export const getStagesByPlanIdAPI = async (planId) => {
  return await api.get(`/stages/plan/${planId}`);
};
