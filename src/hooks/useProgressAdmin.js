import { useState, useEffect } from "react";
import StageService from "~/services/stageService";
import {
  createProgressAPI,
  deleteProgressAPI,
  getAllProgress,
  updateProgressAPI,
} from "~/services/progressService";
import useUsers from "./useUsers";

const useProgressAdmin = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [stages, setStages] = useState([]);

  // Sử dụng hook useUsers thay vì state riêng
  const {
    users,
    loading: userLoading,
    error: userError,
    fetchUsers,
  } = useUsers();

  const [editedProgress, setEditedProgress] = useState({
    stage_id: "",
    date: "",
    cigarettes_smoked: "",
    money_saved: "",
    user_id: "",
    health_stat: "",
  });
  const [errors, setErrors] = useState({
    stage_id: "",
    date: "",
    cigarettes_smoked: "",
    money_saved: "",
    user_id: "",
    health_stat: "",
  });
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [progressToDelete, setProgressToDelete] = useState(null);

  // Combine loading states
  const combinedLoading = loading || userLoading;
  const combinedError = error || userError;

  useEffect(() => {
    fetchProgress();
    fetchStages();
    fetchUsers();
  }, [fetchUsers]);

  const fetchStages = async () => {
    try {
      const response = await StageService.getAllStages();
      setStages(response);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể tải danh sách giai đoạn"
      );
    }
  };

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProgress();
      setProgress(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể tải danh sách tiến trình"
      );
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const openEditModal = (progress) => {
    setSelectedProgress(progress);
    setIsNew(false);
    setEditedProgress({
      stage_id: progress.stage_id,
      date: progress.date
        ? new Date(progress.date).toISOString().split("T")[0]
        : "",
      cigarettes_smoked: progress.cigarettes_smoked,
      money_saved: progress.money_saved,
      user_id: progress.user_id,
      health_stat: progress.health_stat || "",
    });
  };

  const openNewModal = () => {
    setIsNew(true);
    setEditedProgress({
      stage_id: "",
      date: "",
      cigarettes_smoked: "",
      money_saved: "",
      user_id: "",
      health_stat: "",
    });
    setSelectedProgress({});
  };

  // Validate form
  const validate = () => {
    const newErrors = {
      stage_id: !editedProgress.stage_id ? "Vui lòng chọn một giai đoạn" : "",
      date: !editedProgress.date ? "Vui lòng chọn ngày" : "",
      cigarettes_smoked: !editedProgress.cigarettes_smoked
        ? "Vui lòng nhập số điếu thuốc đã hút"
        : "",
      money_saved: !editedProgress.money_saved
        ? "Vui lòng nhập số tiền tiết kiệm"
        : "",
      user_id: !editedProgress.user_id ? "Vui lòng chọn người dùng" : "",
      health_stat: !editedProgress.health_stat
        ? "Vui lòng nhập trạng thái hút thuốc ban đầu"
        : "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Save changes (add or edit)
  const handleSaveChanges = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      if (isNew) {
        await createProgressAPI(editedProgress);
      } else {
        await updateProgressAPI(selectedProgress._id, editedProgress);
      }
      await fetchProgress();
      setSelectedProgress(null);
      setIsNew(false);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể lưu tiến trình");
    } finally {
      setLoading(false);
    }
  };

  // Delete progress
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteProgressAPI(id);
      await fetchProgress();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể xóa tiến trình");
    } finally {
      setLoading(false);
    }
  };

  return {
    progress,
    loading: combinedLoading,
    error: combinedError,
    selectedProgress,
    setSelectedProgress,
    stages,
    users,
    editedProgress,
    setEditedProgress,
    errors,
    setErrors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    progressToDelete,
    setProgressToDelete,
    openEditModal,
    openNewModal,
    handleSaveChanges,
    handleDelete,
    fetchProgress,
    fetchStages,
    fetchUsers,
  };
};

export default useProgressAdmin;
