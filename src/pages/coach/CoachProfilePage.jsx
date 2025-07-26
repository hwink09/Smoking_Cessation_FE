import { useState, useEffect } from "react";
import { Spin, Empty, message } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { useAuth } from "~/hooks/useAuth";
import useCoachData from "~/hooks/useCoachData";
import CoachProfile from "~/components/coach/profile/CoachProfile";
import CoachProfileForm from "~/components/coach/profile/CoachProfileEditor";

const CoachProfilePage = () => {
  const { currentUser } = useAuth();
  const { getCoachById } = useCoachData();

  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const isCoach = currentUser?.role === "coach";
  const userId = currentUser?.userId;

  useEffect(() => {
    const checkProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getCoachById(userId);
        setProfileExists(Boolean(data));
      } catch (error) {
        if (error?.response?.status === 404) {
          setProfileExists(false);
        } else {
          message.error("Không thể kiểm tra thông tin hồ sơ");
        }
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [userId, getCoachById, refreshKey]);

  const handleProfileCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (!isCoach) {
    return (
      <Empty
        description="Bạn không có quyền truy cập trang này"
        className="py-16"
      />
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        className="p-0 mb-6"
        title="Hồ sơ huấn luyện viên"
        subTitle={
          profileExists ? "Thông tin của bạn" : "Tạo hồ sơ huấn luyện viên"
        }
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Đang tải...">
            <div />
          </Spin>
        </div>
      ) : profileExists ? (
        <CoachProfile isEditable />
      ) : (
        <CoachProfileForm mode="create" onSuccess={handleProfileCreated} />
      )}
    </div>
  );
};

export default CoachProfilePage;
