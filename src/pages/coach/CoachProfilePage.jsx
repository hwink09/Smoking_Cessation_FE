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

  useEffect(() => {
    const checkIfProfileExists = async () => {
      if (!currentUser?.userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getCoachById(currentUser.userId);
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

    checkIfProfileExists();
  }, [currentUser, getCoachById, refreshKey]);

  const handleProfileCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (currentUser && currentUser.role !== "coach") {
    return (
      <Empty
        description="Bạn không có quyền truy cập trang này"
        className="py-16"
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Hồ sơ huấn luyện viên | Smoking Cessation</title>
      </Helmet>

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
            <Spin size="large">
              <div className="pt-12">
                <p className="text-center text-gray-500">Đang tải...</p>
              </div>
            </Spin>
          </div>
        ) : profileExists ? (
          <CoachProfile isEditable={true} />
        ) : (
          <CoachProfileForm mode="create" onSuccess={handleProfileCreated} />
        )}
      </div>
    </>
  );
};

export default CoachProfilePage;
