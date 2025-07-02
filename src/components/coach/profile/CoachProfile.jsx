import { useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Descriptions,
  Spin,
  Button,
  message,
  Rate,
  List,
  Flex,
} from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { useAuth } from "~/hooks/useAuth";
import useCoachData from "~/hooks/useCoachData";
import CoachProfileEditor from "./CoachProfileEditor";

const CoachProfile = ({ coachId, isEditable = false }) => {
  const { currentUser } = useAuth();
  const { getCoachById } = useCoachData();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const targetCoachId = coachId || currentUser?.userId;

  const handleProfileUpdated = async () => {
    try {
      setLoading(true);
      const updatedData = await getCoachById(targetCoachId);
      setProfile(updatedData);
      if (Array.isArray(updatedData.feedbacks)) {
        setFeedbacks(updatedData.feedbacks);
      }
    } catch (error) {
      message.error("Không thể tải lại thông tin hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!targetCoachId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCoachById(targetCoachId);
        if (!data) {
          setProfile({});
          return;
        }

        setProfile(data);
        if (Array.isArray(data.feedbacks)) {
          setFeedbacks(data.feedbacks);
        }
      } catch {
        message.error("Không thể tải thông tin huấn luyện viên");
        setProfile({});
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetCoachId, getCoachById]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large">
          <div className="pt-12">
            <p className="text-center text-gray-500">Đang tải thông tin...</p>
          </div>
        </Spin>
      </div>
    );
  }

  if (!profile || typeof profile !== "object") {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2 text-red-500">Lỗi dữ liệu</h3>
        <p className="mb-4">
          Không thể hiển thị hồ sơ do dữ liệu không hợp lệ.
        </p>
        <Button onClick={() => window.location.reload()}>Tải lại trang</Button>
      </div>
    );
  }

  const userInfo = profile.coach_id || {};

  return (
    <div className="max-w-4xl mx-auto">
      <Card
        className="shadow-md mb-6"
        extra={
          isEditable && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setIsEditModalVisible(true)}
            >
              Chỉnh sửa
            </Button>
          )
        }
      >
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-8">
            <Avatar
              size={120}
              src={userInfo.avatar_url}
              icon={<UserOutlined />}
              className="mb-3"
            />
            <h2 className="text-xl font-bold">{userInfo.name}</h2>
            <div className="flex items-center mt-1">
              <Rate
                disabled
                allowHalf
                value={Number(profile.rating_avg) || 0}
              />
              <span className="ml-2">({profile.rating_avg || 0})</span>
            </div>
          </div>

          <div className="flex-1">
            <Descriptions title="Thông tin huấn luyện viên" column={1} bordered>
              <Descriptions.Item label="Email">
                {userInfo.email}
              </Descriptions.Item>
              <Descriptions.Item label="Chuyên môn">
                {profile.specialization}
              </Descriptions.Item>
              <Descriptions.Item label="Kinh nghiệm">
                {profile.experience_years} năm
              </Descriptions.Item>
              <Descriptions.Item label="Số buổi đã thực hiện">
                {profile.total_sessions || 0}
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Giới thiệu</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
            </div>
          </div>
        </div>
      </Card>

      {feedbacks.length > 0 && (
        <Card title="Đánh giá từ người dùng" className="shadow-md">
          <List
            dataSource={feedbacks}
            itemLayout="horizontal"
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={item.user_id?.avatar_url}
                      icon={<UserOutlined />}
                    />
                  }
                  title={
                    <Flex align="center" justify="space-between">
                      <span>{item.user_id?.name || "Người dùng"}</span>
                      <span className="text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </Flex>
                  }
                  description={
                    <div>
                      <p className="mb-2">{item.content}</p>
                      <Rate disabled value={item.rating} />
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      <CoachProfileEditor
        mode="edit"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        profile={profile}
        onSuccess={handleProfileUpdated}
      />
    </div>
  );
};

export default CoachProfile;
