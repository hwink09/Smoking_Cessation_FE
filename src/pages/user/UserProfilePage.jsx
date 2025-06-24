
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AchievementsSection } from '~/components/user/userprofile/AchievementsSection';
import { EditProfileModal } from '~/components/user/userprofile/EditProfileModal';
import { ProfileHeader } from '~/components/user/userprofile/ProfileHeader';
import { StatsSection } from '~/components/user/userprofile/StatsSection';
import { useProfileData } from '~/hooks/useProfileData';

export default function UserProfilePage() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    achievements,
    isEditModalVisible,
    form,
    handleEditProfile,
    handleCancel,
    handleAvatarUpload,
    avatarPreviewUrl,
    fetchUserById,
    handleSaveProfile,
  } = useProfileData();

  // Load user data từ API
  const loadUserData = async () => {
    try {
      setLoading(true);
      const data = await fetchUserById(id);
      setUserData(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError('Không thể tải hồ sơ người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadUserData();
    }
  }, [id]);

  const handleSave = async (values) => {
    await handleSaveProfile(values);
    await loadUserData(); // <== cập nhật lại UI sau khi lưu
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">No user data found</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <ProfileHeader
          user={userData}
          onEditProfile={handleEditProfile}
        />

        <div className="mt-6">
          <StatsSection stats={userData.stats || {
            daysQuit: 0,
            moneySaved: 0,
            healthScore: 0,
          }} />
        </div>

        <div className="mt-6">
          <AchievementsSection achievements={achievements} />
        </div>

        <EditProfileModal
          isVisible={isEditModalVisible}
          onCancel={handleCancel}
          onSave={handleSave} 
          user={userData}
          form={form}
          handleAvatarUpload={handleAvatarUpload}
          avatarPreviewUrl={avatarPreviewUrl}
        />
      </div>
    </div>
  );
}
