import { useEffect, useState } from "react";
import { Spin, Alert, Avatar, Button, message } from "antd"; // Import necessary components
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from "@ant-design/icons"; // Import icons for a better look

// Inherit the great child components you've created
import { AchievementsSection } from "~/components/user/userprofile/AchievementsSection";
import { EditProfileModal } from "~/components/user/userprofile/EditProfileModal";
import { ProfileHeader } from "~/components/user/userprofile/ProfileHeader";
import { StatsSection } from "~/components/user/userprofile/StatsSection";

// Import our "messenger"
import userService from "~/services/userService";

// Small component to display info, keeping the code clean
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start py-3">
    <span className="text-purple-500 mt-1">{icon}</span>
    <div className="ml-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">
        {value || <span className="italic text-gray-400">Not updated</span>}
      </p>
    </div>
  </div>
);

export default function UserProfilePage() {
  // --- State management ---
  const [userData, setUserData] = useState(null); // Initialize as null for easier checking
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // --- useEffect to fetch data, logic remains the same ---
  useEffect(() => {
    const loadMyProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getMyProfile();
        setUserData(response.data); // Get the correct data from the response
        setError(null);
      } catch (err) {
        console.error("Failed to fetch my profile:", err);
        setError("Could not load your profile.");
      } finally {
        setLoading(false);
      }
    };
    loadMyProfile();
  }, []);

  // --- Save handler logic, remains the same ---
  const handleSave = async (values) => {
    try {
      const response = await userService.updateMyProfile(values);
      setUserData(response.data.data); // Update with the latest data
      setIsEditModalOpen(false);
      message.success("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile", err);
      message.error("Failed to update profile.");
    }
  };

  // --- UI for handling loading, error states ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Spin tip="Loading profile..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Alert message="User data not found." type="warning" showIcon />
      </div>
    );
  }

  // --- THE MAIN UI, REVAMPED ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Personal Profile</h1>
          <p className="text-gray-500 mt-2">
            Manage your information for the best experience.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl shadow-gray-300/40 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Left column: Avatar and Name */}
            <div className="md:col-span-4 bg-[#26234e] p-8 flex flex-col items-center justify-center text-white">
              <Avatar
                size={120}
                src={userData.avatar_url}
                icon={<UserOutlined />}
                className="border-4 border-purple-400/50"
              />
              <h2 className="text-2xl font-bold mt-4">{userData.name}</h2>
              <span className="bg-white/20 text-xs font-bold uppercase px-3 py-1 rounded-full mt-2">
                {userData.role}
              </span>
              <Button
                type="primary"
                ghost
                className="mt-6"
                onClick={() => setIsEditModalOpen(true)}>
                Edit Profile
              </Button>
            </div>

            {/* Right column: Detailed info */}
            <div className="md:col-span-8 p-8">
              <InfoRow
                icon={<MailOutlined />}
                label="Email Address"
                value={userData.email}
              />
              <InfoRow
                icon={<PhoneOutlined />}
                label="Phone Number"
                value={userData.phoneNumber}
              />
              <InfoRow
                icon={<CalendarOutlined />}
                label="Member Since"
                value={new Date(userData.createdAt).toLocaleDateString("en-US")}
              />
              {/* Keep the commented out section so you can easily re-enable it */}
              {/*
                <div className="mt-6">
                    <h3 className="font-bold text-lg mb-2">Your Stats</h3>
                    <StatsSection stats={{ daysQuit: 10, moneySaved: 500000, healthScore: 85, }} />
                </div>
                <div className="mt-6">
                    <h3 className="font-bold text-lg mb-2">Achievements</h3>
                    <AchievementsSection achievements={[]} />
                </div>
              */}
            </div>
          </div>
        </div>
      </div>

      {/* The Modal remains unchanged */}
      <EditProfileModal
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        user={userData}
      />
    </div>
  );
}
