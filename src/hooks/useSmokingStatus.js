import { useState, useCallback } from "react";
import { message } from "antd";
import SmokingStatusService from "../services/SmokingStatusService";

const useSmokingStatus = () => {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy dữ liệu
  const fetchSmokingStatus = useCallback(async (userId) => {
    try {
      setLoading(true);
      const data = await SmokingStatusService.getStatus(userId);
      setStatusData(data);
      return data;
    } catch (err) {
      setError(err);
      message.error("Lấy thông tin thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, []);

  // Tạo mới
  const createSmokingStatus = useCallback(async (userId, payload) => {
    try {
      setLoading(true);
      const data = await SmokingStatusService.createStatus(userId, payload);
      setStatusData(data?.smokingStatus || null);
      message.success("Thêm thông tin hút thuốc thành công!");
      return data;
    } catch (err) {
      setError(err);
      message.error("Thêm thông tin thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, []);

  // Cập nhật
  const updateSmokingStatus = useCallback(async (userId, payload) => {
    try {
      setLoading(true);
      const data = await SmokingStatusService.updateStatus(userId, payload);
      setStatusData(data?.updatedSmokingStatus || null);
      message.success("Cập nhật thông tin thành công!");
      return data;
    } catch (err) {
      setError(err);
      message.error("Cập nhật thông tin thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, []);

  // Xóa
  const deleteSmokingStatus = useCallback(async (recordId) => {
    try {
      setLoading(true);
      await SmokingStatusService.deleteStatus(recordId);
      setStatusData(null);
      message.success("Xóa thông tin thành công!");
    } catch (err) {
      setError(err);
      message.error("Xóa thông tin thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, []);

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
