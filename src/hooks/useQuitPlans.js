import { useState, useEffect } from 'react';
import api from '~/services/api';
import QuitPlanServiceAdmin from '~/services/quitPlanServiceAdmin';

const useQuitPlans = () => {
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [dateError, setDateError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    user: "",
    reason: "",
    name: "",
    start_date: "",
    target_quit_date: "",
  });
  const [errors, setErrors] = useState({
    user: "",
    reason: "",
    name: "",
    start_date: "",
    target_quit_date: "",
  });

  useEffect(() => {
    fetchPlans();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/user');
      if (response.data.users) {
        setUsers(response.data.users);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Không thể lấy danh sách người dùng");
    }
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await QuitPlanServiceAdmin.getAllQuitPlans();
      setPlans(data);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể lấy danh sách kế hoạch cai thuốc");
    } finally {
      setLoading(false);
    }
  };

  const validateDates = (start, end) => {
    if (!start || !end) return true;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return startDate < endDate;
  };

  const handleDateChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    if (field === 'start_date' || field === 'target_quit_date') {
      const start = field === 'start_date' ? value : formData.start_date;
      const end = field === 'target_quit_date' ? value : formData.target_quit_date;
      if (!validateDates(start, end)) {
        setDateError("Ngày mục tiêu phải sau ngày bắt đầu");
      } else {
        setDateError("");
      }
    }
  };

  const handleNew = () => {
    setIsNew(true);
    setEditingPlan({});
    setFormData({
      user: "",
      reason: "",
      name: "",
      start_date: "",
      target_quit_date: "",
    });
    setDateError("");
  };

  const handleEdit = (plan) => {
    setIsNew(false);
    setEditingPlan(plan);
    const user = users.find(u => u.id === plan.user_id);
    setSelectedUser(user);
    setFormData({
      user: plan.user_id,
      reason: plan.reason,
      name: plan.name,
      start_date: plan.start_date.split('T')[0],
      target_quit_date: plan.target_quit_date.split('T')[0],
    });
    setDateError("");
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setFormData({ ...formData, user: userId });
  };

  // Validate form
  const validate = () => {
    const newErrors = {
      user: !formData.user ? "Vui lòng chọn người dùng" : "",
      reason: !formData.reason ? "Vui lòng nhập lý do" : "",
      name: !formData.name ? "Vui lòng nhập tên kế hoạch" : "",
      start_date: !formData.start_date ? "Vui lòng chọn ngày bắt đầu" : "",
      target_quit_date: !formData.target_quit_date ? "Vui lòng chọn ngày mục tiêu" : "",
    };
    if (!validateDates(formData.start_date, formData.target_quit_date)) {
      newErrors.target_quit_date = "Ngày mục tiêu phải sau ngày bắt đầu";
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const dataToSend = {
        ...formData,
        user_id: formData.user,
        start_date: new Date(formData.start_date).toISOString(),
        target_quit_date: new Date(formData.target_quit_date).toISOString(),
      };
      if (isNew) {
        await QuitPlanServiceAdmin.createQuitPlan(dataToSend);
      } else {
        await QuitPlanServiceAdmin.updateQuitPlan(editingPlan._id, dataToSend);
      }
      await fetchPlans();
      setEditingPlan(null);
      setIsNew(false);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể lưu kế hoạch cai thuốc");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await QuitPlanServiceAdmin.deleteQuitPlan(id);
      await fetchPlans();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể xóa kế hoạch cai thuốc");
    } finally {
      setLoading(false);
    }
  };

  return {
    plans,
    users,
    loading,
    error,
    editingPlan,
    setEditingPlan,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    planToDelete,
    setPlanToDelete,
    dateError,
    setDateError,
    selectedUser,
    setSelectedUser,
    formData,
    setFormData,
    errors,
    setErrors,
    fetchPlans,
    fetchUsers,
    handleNew,
    handleEdit,
    handleUserChange,
    handleDateChange,
    handleSave,
    handleDelete,
  };
};

export default useQuitPlans;
