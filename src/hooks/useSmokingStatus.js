// src/hooks/useSmokingStatus.jsx
import { useState } from "react";
import SmokingStatusService from "../services/SmokingStatusService";

const useSmokingStatus = () => {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy dữ liệu
  const fetchSmokingStatus = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await SmokingStatusService.getStatus(id);
      setStatusData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Tạo mới
  const createSmokingStatus = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await SmokingStatusService.createStatus(id, payload);
      if (data.smokingStatus) {
        setStatusData(data.smokingStatus);
      } else {
        await fetchSmokingStatus(id);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật
  const updateSmokingStatus = async (userId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await SmokingStatusService.updateStatus(userId, payload);
      if (data.updatedSmokingStatus) {
        setStatusData(data.updatedSmokingStatus);
      } else {
        await fetchSmokingStatus(userId);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Xóa
  const deleteSmokingStatus = async (recordId) => {
    setLoading(true);
    setError(null);
    try {
      await SmokingStatusService.deleteStatus(recordId);
      setStatusData(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    statusData,
    loading,
    error,
    fetchSmokingStatus,
    createSmokingStatus,
    updateSmokingStatus,
    deleteSmokingStatus,
  };
};

export default useSmokingStatus;
