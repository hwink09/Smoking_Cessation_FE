import { useState, useEffect } from 'react';
import NotificationService from '~/services/notificationService';
import { getAllProgress } from '~/services/progressService';

const useNotifications = () => {
  // Data state
  const [notifications, setNotifications] = useState([]);
  const [progresses, setProgresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal/form state
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [editedNotification, setEditedNotification] = useState({
    progress_id: '',
    message: '',
    type: 'daily',
    schedule: '',
    is_sent: false,
  });
  const [errors, setErrors] = useState({
    progress_id: '',
    message: '',
    type: '',
    schedule: '',
    is_sent: '',
  });
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  // Fetch progresses
  const fetchProgresses = async () => {
    try {
      const data = await getAllProgress();
      setProgresses(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể lấy danh sách tiến độ');
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await NotificationService.getAllNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể lấy danh sách thông báo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchProgresses();
  }, []);

  // Modal handlers
  const openEditModal = (notification) => {
    setSelectedNotification(notification);
    setIsNew(false);
    setEditedNotification({
      progress_id: notification.progress_id,
      message: notification.message,
      type: notification.type,
      schedule: notification.schedule,
      is_sent: notification.is_sent,
    });
  };

  const openNewModal = () => {
    setIsNew(true);
    setEditedNotification({
      progress_id: '',
      message: '',
      type: 'daily',
      schedule: '',
      is_sent: false,
    });
    setSelectedNotification({});
  };

  // Validate form
  const validate = () => {
    const newErrors = {
      progress_id: !editedNotification.progress_id ? 'Vui lòng chọn tiến độ' : '',
      message: !editedNotification.message ? 'Vui lòng nhập thông điệp' : '',
      type: !editedNotification.type ? 'Vui lòng chọn loại thông báo' : '',
      schedule: !editedNotification.schedule ? 'Vui lòng nhập thời gian gửi' : '',
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
        await NotificationService.createNotification(editedNotification);
      } else {
        await NotificationService.updateNotification(selectedNotification._id, editedNotification);
      }
      await fetchNotifications();
      setSelectedNotification(null);
      setIsNew(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể lưu thông báo');
    } finally {
      setLoading(false);
    }
  };

  // Delete notification
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await NotificationService.deleteNotification(id);
      await fetchNotifications();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể xóa thông báo');
    } finally {
      setLoading(false);
    }
  };

  return {
    notifications,
    progresses,
    loading,
    error,
    selectedNotification,
    setSelectedNotification,
    editedNotification,
    setEditedNotification,
    errors,
    setErrors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    notificationToDelete,
    setNotificationToDelete,
    openEditModal,
    openNewModal,
    handleSaveChanges,
    handleDelete,
    fetchNotifications,
    fetchProgresses,
  };
};

export default useNotifications; 