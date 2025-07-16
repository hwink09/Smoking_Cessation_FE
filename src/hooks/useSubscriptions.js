import { useState, useEffect } from 'react';
import PackageService from '~/services/packageService';
import SubscriptionService from '~/services/subscriptionService';
import userService from '~/services/userService';

const useSubscriptions = () => {
  // State cho subscriptions và packages
  const [subscriptions, setSubscriptions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  // State cho modal/form
  const [selectedSub, setSelectedSub] = useState(null);
  const [editedSub, setEditedSub] = useState({
    package_id: '',
    user_id: '',
    start_date: '',
    end_date: '',
    status: 'pending',
    price: '',
    name: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    price: '',
    start_date: '',
    end_date: '',
    package_id: '',
    status: '',
  });
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [subToDelete, setSubToDelete] = useState(null);

  const fetchUsers = async () => {
    try{
      const data = await userService.getAllUser();
      console.log("users from API", data);
      setUsers(data.users);
    }catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách người dùng');
    }
  }

  // Fetch packages
  const fetchPackages = async () => {
    try {
      const data = await PackageService.getAllPackages();
      console.log(data);
      setPackages(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách gói');
    }
  };

  // Fetch subscriptions
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SubscriptionService.getAllSubscriptions();
      console.log("subscriptions from API", data); // log dữ liệu subscriptions
      setSubscriptions(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách đăng ký');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchPackages();
    fetchUsers();
  }, []);

  // Modal handlers
  const openEditModal = (sub) => {
    setSelectedSub(sub);
    setIsNew(false);
    setEditedSub({
      name: sub.name,
      price: sub.price,
      start_date: sub.start_date ? new Date(sub.start_date).toISOString().split('T')[0] : '',
      end_date: sub.end_date ? new Date(sub.end_date).toISOString().split('T')[0] : '',
      status: sub.status,
      package_id: sub.package_id,
    });
  };

  const openNewModal = () => {
    setIsNew(true);
    setEditedSub({
      name: '',
      price: '',
      start_date: '',
      end_date: '',
      status: 'pending',
      package_id: '',
    });
    setSelectedSub({});
  };

  // Validate form
  const validate = () => {
    const newErrors = {
      name: !editedSub.name ? 'Vui lòng nhập tên đăng ký' : '',
      price: !editedSub.price ? 'Vui lòng nhập giá' : '',
      start_date: !editedSub.start_date ? 'Vui lòng chọn ngày bắt đầu' : '',
      end_date: !editedSub.end_date ? 'Vui lòng chọn ngày kết thúc' : '',
      package_id: !editedSub.package_id ? 'Vui lòng chọn gói' : '',
      status: !editedSub.status ? 'Vui lòng chọn trạng thái' : '',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  // Save changes (add or edit)
  const handleSaveChanges = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      if (isNew) {
        await SubscriptionService.createSubscription(editedSub);
      } else {
        await SubscriptionService.updateSubscription(selectedSub._id, editedSub);
      }
      await fetchSubscriptions();
      setSelectedSub(null);
      setIsNew(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể lưu đăng ký');
    } finally {
      setLoading(false);
    }
  };

  // Delete subscription
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await SubscriptionService.deleteSubscription(id);
      await fetchSubscriptions();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể xóa đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    subscriptions,
    packages,
    loading,
    error,
    selectedSub,
    setSelectedSub,
    editedSub,
    setEditedSub,
    errors,
    setErrors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    subToDelete,
    setSubToDelete,
    openEditModal,
    openNewModal,
    handleSaveChanges,
    handleDelete,
    fetchSubscriptions,
    fetchPackages,
  };
};

export default useSubscriptions; 