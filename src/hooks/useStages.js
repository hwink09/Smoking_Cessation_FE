import { useState, useEffect } from "react";
import QuitPlanService from "~/services/quitPlanService";
import StageService from "~/services/stageService";

const useStages = (planId) => {
  const [stages, setStages] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State cho modal/form
  const [selectedStage, setSelectedStage] = useState(null);
  const [editedStage, setEditedStage] = useState({
    plan_id: "",
    title: "",
    description: "",
    stage_number: "",
    start_date: "",
    end_date: "",
    is_completed: false,
  });
  const [errors, setErrors] = useState({
    plan_id: "",
    title: "",
    description: "",
    stage_number: "",
    start_date: "",
    end_date: "",
  });
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [stageToDelete, setStageToDelete] = useState(null);

  // Fetch plans
  const fetchPlans = async () => {
    try {
      const data = await QuitPlanService.admin.getAllPlans();
      setPlans(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể tải danh sách kế hoạch"
      );
    }
  };

  // Fetch stages
  const fetchStages = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (planId) {
        data = await StageService.getStagesByPlanId(planId);
      } else {
        data = await StageService.getAllStages();
      }
      setStages(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể tải danh sách giai đoạn"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStages();
    fetchPlans();
  }, [planId]);

  // Modal handlers
  const openEditModal = (stage) => {
    setSelectedStage(stage);
    setIsNew(false);
    setEditedStage({
      plan_id: stage.plan_id,
      title: stage.title,
      description: stage.description,
      stage_number: stage.stage_number,
      start_date: stage.start_date
        ? new Date(stage.start_date).toISOString().split("T")[0]
        : "",
      end_date: stage.end_date
        ? new Date(stage.end_date).toISOString().split("T")[0]
        : "",
      is_completed: stage.is_completed,
    });
  };

  const openNewModal = () => {
    setIsNew(true);
    setEditedStage({
      plan_id: planId || "",
      title: "",
      description: "",
      stage_number: "",
      start_date: "",
      end_date: "",
      is_completed: false,
    });
    setSelectedStage({});
  };

  // Validate form
  const validate = () => {
    let prevEndDate = null;
    if (isNew && stages.length > 0) {
      // Lấy ngày kết thúc lớn nhất của các stage hiện tại
      const sortedStages = [...stages].sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
      prevEndDate = sortedStages[sortedStages.length - 1].end_date;
    }
    const newErrors = {
      plan_id: !editedStage.plan_id ? "Vui lòng chọn một kế hoạch" : "",
      title: !editedStage.title ? "Vui lòng nhập tiêu đề" : "",
      description: !editedStage.description ? "Vui lòng nhập mô tả" : "",
      stage_number: !editedStage.stage_number ? "Vui lòng nhập số thứ tự giai đoạn" : "",
      start_date: !editedStage.start_date ? "Vui lòng chọn ngày bắt đầu" : "",
      end_date: !editedStage.end_date ? "Vui lòng chọn ngày kết thúc" : "",
    };
    // Validate ngày bắt đầu phải sau ngày kết thúc của giai đoạn trước
    if (isNew && prevEndDate && editedStage.start_date) {
      if (new Date(editedStage.start_date) <= new Date(prevEndDate)) {
        newErrors.start_date = `Ngày bắt đầu phải sau ngày kết thúc của giai đoạn trước (${prevEndDate})`;
      }
    }
    // Validate ngày kết thúc phải sau ngày bắt đầu
    if (editedStage.start_date && editedStage.end_date) {
      if (new Date(editedStage.end_date) <= new Date(editedStage.start_date)) {
        newErrors.end_date = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Save changes (add or edit)
  const handleSaveChanges = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      if (isNew) {
        await StageService.createStage(editedStage);
      } else {
        await StageService.updateStage(selectedStage._id, editedStage);
      }
      await fetchStages();
      setSelectedStage(null);
      setIsNew(false);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể lưu giai đoạn");
    } finally {
      setLoading(false);
    }
  };

  // Delete stage
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await StageService.deleteStage(id);
      await fetchStages();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể xóa giai đoạn");
    } finally {
      setLoading(false);
    }
  };

  return {
    stages,
    plans,
    loading,
    error,
    selectedStage,
    setSelectedStage,
    editedStage,
    setEditedStage,
    errors,
    setErrors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    stageToDelete,
    setStageToDelete,
    openEditModal,
    openNewModal,
    handleSaveChanges,
    handleDelete,
    fetchStages,
    fetchPlans,
  };
};

export default useStages;
