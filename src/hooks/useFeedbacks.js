import { useState, useEffect } from "react";
import FeedbackService from "~/services/feedbackService";

const useFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [newData, setNewData] = useState({
    rating: 5,
    content: "",
    feedback_type: "user_to_system",
    status: "pending",
  });
  const [errors, setErrors] = useState({
    rating: "",
    content: "",
    feedback_type: "",
    status: "",
  });
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line
  }, [filterType]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await FeedbackService.getFeedbacksByType(filterType);
      console.log("API response:", response);
      setFeedbacks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tải dữ liệu phản hồi");
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setNewData({
      rating: feedback.rating || 5,
      content: feedback.content || "",
      feedback_type: feedback.feedback_type || "user_to_system",
      status: feedback.status || "pending",
    });
    setIsNew(false);
  };

  const handleNew = () => {
    setNewData({
      rating: 5,
      content: "",
      feedback_type: "user_to_system",
      status: "pending",
    });
    setErrors({
      rating: "",
      content: "",
      feedback_type: "",
      status: "",
    });
    setEditingFeedback({});
    setIsNew(true);
  };

  // Validate form
  const validate = () => {
    const newErrors = {
      rating: !newData.rating
        ? "Vui lòng nhập đánh giá"
        : newData.rating < 1 || newData.rating > 5
        ? "Đánh giá phải từ 1 đến 5"
        : "",
      content: !newData.content ? "Vui lòng nhập nội dung phản hồi" : "",
      feedback_type: !newData.feedback_type
        ? "Vui lòng chọn loại phản hồi"
        : "",
      status: !newData.status ? "Vui lòng chọn trạng thái" : "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Save changes (add or edit)
  const handleSave = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      if (isNew) {
        await FeedbackService.createFeedback(newData);
      } else {
        await FeedbackService.updateFeedback(editingFeedback._id, newData);
      }
      await fetchFeedbacks();
      setEditingFeedback(null);
      setIsNew(false);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể lưu phản hồi");
    } finally {
      setLoading(false);
    }
  };

  // Delete feedback
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await FeedbackService.deleteFeedback(id);
      await fetchFeedbacks();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể xóa phản hồi");
    } finally {
      setLoading(false);
    }
  };

  // Update status
  const handleStatusUpdate = async (id, status) => {
    try {
      setLoading(true);
      await FeedbackService.updateFeedbackStatus(id, { status });
      await fetchFeedbacks();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể cập nhật trạng thái");
    } finally {
      setLoading(false);
    }
  };

  // Filtered feedbacks
  const filteredFeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.user_id?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      feedback.user_id?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    feedbacks,
    loading,
    error,
    editingFeedback,
    setEditingFeedback,
    newData,
    setNewData,
    errors,
    setErrors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    feedbackToDelete,
    setFeedbackToDelete,
    filterType,
    setFilterType,
    searchTerm,
    setSearchTerm,
    filteredFeedbacks,
    fetchFeedbacks,
    handleEdit,
    handleNew,
    handleSave,
    handleDelete,
    handleStatusUpdate,
  };
};

export default useFeedbacks;
