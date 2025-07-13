import { useState, useCallback } from "react";
import QuitPlanService from "~/services/quitPlanService";

export function useQuitPlanData() {
  const [quitPlans, setQuitPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [publicPlans, setPublicPlans] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [myUsers, setMyUsers] = useState([]);

  const callService = useCallback(async (serviceFn, ...params) => {
    setLoading(true);
    setError(null);
    try {
      return await serviceFn(...params);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------- Fetch Wrapper Functions ----------

  const fetchAndSet = async (serviceFn, setter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await serviceFn();
      setter(data);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchQuitPlans = useCallback(
    () => fetchAndSet(QuitPlanService.getAllQuitPlans, setQuitPlans),
    []
  );
  const fetchPublicPlans = useCallback(
    () => fetchAndSet(QuitPlanService.getPublicQuitPlans, setPublicPlans),
    []
  );
  const fetchMyRequests = useCallback(
    () => fetchAndSet(QuitPlanService.getMyQuitPlanRequests, setMyRequests),
    []
  );
  const fetchAllRequests = useCallback(
    () => fetchAndSet(QuitPlanService.getAllQuitPlanRequests, setAllRequests),
    []
  );
  const fetchMyUsers = useCallback(
    () => fetchAndSet(QuitPlanService.getMyUsers, setMyUsers),
    []
  );

  // ---------- CRUD with refresh ----------
  const createWithRefresh = async (data) => {
    const result = await callService(QuitPlanService.createQuitPlan, data);
    await fetchQuitPlans();
    return result;
  };

  const updateWithRefresh = async (id, data) => {
    const result = await callService(QuitPlanService.updateQuitPlan, id, data);
    await fetchQuitPlans();
    return result;
  };

  const deleteWithRefresh = async (id) => {
    const result = await callService(QuitPlanService.deleteQuitPlan, id);
    await fetchQuitPlans();
    return result;
  };

  const sendRequestWithRefresh = async (data) => {
    const result = await callService(QuitPlanService.sendQuitPlanRequest, data);
    await fetchMyRequests();
    return result;
  };

  const cancelRequestWithRefresh = async (id) => {
    const result = await callService(QuitPlanService.cancelQuitPlanRequest, id);
    await fetchMyRequests();
    return result;
  };

  const approveRequestWithRefresh = async (id, data) => {
    const result = await callService(
      QuitPlanService.approveQuitPlanRequest,
      id,
      data
    );
    await Promise.all([fetchAllRequests(), fetchMyUsers()]);
    return result;
  };

  const rejectRequestWithRefresh = async (id, data) => {
    const result = await callService(
      QuitPlanService.rejectQuitPlanRequest,
      id,
      data
    );
    await fetchAllRequests();
    return result;
  };

  // Memoize các function để tránh re-render
  const memoizedGetQuitPlanByUserId = useCallback(
    (userId) => callService(QuitPlanService.getQuitPlanByUserId, userId),
    [callService]
  );

  return {
    // State
    quitPlans,
    publicPlans,
    myRequests,
    allRequests,
    myUsers,
    loading,
    error,

    // Fetch methods
    fetchQuitPlans,
    fetchPublicPlans,
    fetchMyRequests,
    fetchAllRequests,
    fetchMyUsers,

    // CRUD
    createQuitPlan: createWithRefresh,
    getAllQuitPlans: () => callService(QuitPlanService.getAllQuitPlans),
    getQuitPlanById: (id) => callService(QuitPlanService.getQuitPlanById, id),
    updateQuitPlan: updateWithRefresh,
    deleteQuitPlan: deleteWithRefresh,
    getQuitPlanByUserId: memoizedGetQuitPlanByUserId,

    // Public plans
    getPublicQuitPlans: () => callService(QuitPlanService.getPublicQuitPlans),
    adoptPublicQuitPlan: (planId, userData) =>
      callService(QuitPlanService.adoptPublicQuitPlan, planId, userData),

    // Coach/user management
    getMyUsers: () => callService(QuitPlanService.getMyUsers),
    sendQuitPlanRequest: sendRequestWithRefresh,
    getAllQuitPlanRequests: () =>
      callService(QuitPlanService.getAllQuitPlanRequests),
    getMyQuitPlanRequests: () =>
      callService(QuitPlanService.getMyQuitPlanRequests),
    cancelQuitPlanRequest: cancelRequestWithRefresh,
    approveQuitPlanRequest: approveRequestWithRefresh,
    rejectQuitPlanRequest: rejectRequestWithRefresh,
  };
}

export default useQuitPlanData;
