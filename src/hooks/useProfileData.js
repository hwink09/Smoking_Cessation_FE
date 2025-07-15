import { useState } from "react";
import { Form, message } from "antd";
import { Trophy, Coins, Heart } from "lucide-react";

import userService from "../services/userService";
import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "./useAuth";

const {
  fetchUserById,
  updateUserProfile,
  changeUserPassword,
  deleteUserAccount,
} = userService;

export function useProfileData() {
  const { currentUser, setUser } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null);

  const achievements = [
    {
      id: 1,
      title: "1 tháng không hút thuốc",
      icon: Trophy,
      color: "#1890ff",
      bgColor: "#e6f7ff",
      completed: true,
    },
    {
      id: 2,
      title: "Tiết kiệm 5 triệu",
      icon: Coins,
      color: "#52c41a",
      bgColor: "#f6ffed",
      completed: true,
    },
    {
      id: 3,
      title: "Sức khỏe cải thiện",
      icon: Heart,
      color: "#f5222d",
      bgColor: "#fff2f0",
      completed: true,
    },
  ];

  const getUserId = (user) => user?.userId || user?._id || user?.id;

  const handleEditProfile = () => {
    setAvatarPreviewUrl(null);
    form.setFieldsValue({
      name: currentUser.name,
      email: currentUser.email,
      avatar_url: currentUser.avatar_url,
    });
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async (values) => {
    try {
      const profileData = {
        name: values.name,
        email: values.email,
        avatar_url: values.avatar_url,
      };

      const updated = await updateUserProfile(
        getUserId(currentUser),
        profileData
      );

      const updatedUser = updated?.user
        ? { ...currentUser, ...updated.user }
        : { ...currentUser, ...profileData };

      setUser(updatedUser);
      setIsEditModalVisible(false);
      message.success("Cập nhật hồ sơ thành công!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật hồ sơ!";
      message.error(errorMessage);
      console.error("Lỗi cập nhật:", error);
    }
  };

  const handleAvatarUpload = async (file) => {
    if (!file) {
      message.error("Vui lòng chọn một tệp ảnh.");
      return;
    }

    const imageRef = ref(storage, `avatars/${uuidv4()}_${file.name}`);

    try {
      message.loading({ content: "Đang xử lý ảnh...", key: "upload" });

      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      form.setFieldsValue({ avatar_url: downloadURL });
      setAvatarPreviewUrl(downloadURL);

      message.success({
        content: 'Ảnh đã sẵn sàng. Nhấn "Lưu thay đổi" để hoàn tất.',
        key: "upload",
        duration: 4,
      });
    } catch (error) {
      message.error({ content: "Lỗi khi tải ảnh lên!", key: "upload" });
      console.error("Error uploading avatar:", error);
    }
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
    setAvatarPreviewUrl(null);
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      await changeUserPassword(oldPassword, newPassword);
      message.success("Đổi mật khẩu thành công!");
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi đổi mật khẩu");
      console.error("Lỗi đổi mật khẩu:", error);
      throw error;
    }
  };

  const deleteUser = async () => {
    try {
      await deleteUserAccount(getUserId(currentUser));
      message.success("Tài khoản đã được xóa!");
      localStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      message.error("Lỗi khi xóa tài khoản");
      console.error("Lỗi xóa tài khoản:", error);
    }
  };

  return {
    currentUser,
    achievements,
    isEditModalVisible,
    form,
    avatarPreviewUrl,
    handleEditProfile,
    handleSaveProfile,
    handleCancel,
    handleAvatarUpload,
    fetchUserById, // export nguyên hàm service để dùng ngoài
    changePassword,
    deleteUser,
  };
}
