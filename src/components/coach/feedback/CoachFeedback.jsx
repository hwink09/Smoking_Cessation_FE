import { useState, useEffect } from "react";
import { Card, Avatar, Spin, message, Rate, List, Flex, Empty } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAuth } from "~/hooks/useAuth";
import FeedbackService from "~/services/feedbackService";

const CoachFeedback = ({ coachId }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);

  const targetCoachId = coachId || currentUser?.userId;

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!targetCoachId) {
        setLoading(false);
        return;
      }

      try {
        const data = await FeedbackService.getCoachFeedback(targetCoachId);
        const approvedFeedbacks = Array.isArray(data)
          ? data.filter((item) => item.status === "approved")
          : [];
        setFeedbacks(approvedFeedbacks);
      } catch (error) {
        message.error("Không thể tải thông tin đánh giá");
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [targetCoachId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large">
          <div className="pt-12">
            <p className="text-center text-gray-500">Đang tải đánh giá...</p>
          </div>
        </Spin>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card title="Đánh giá từ người dùng" className="shadow-md">
        {feedbacks.length === 0 ? (
          <Empty
            description="Chưa có đánh giá nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            dataSource={feedbacks}
            itemLayout="horizontal"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showQuickJumper: true,
            }}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={
                        item.user_id?.avatar_url ||
                        item.user_avatar ||
                        item.userAvatar ||
                        item.user?.avatar_url
                      }
                      icon={<UserOutlined />}
                    />
                  }
                  title={
                    <Flex align="center" justify="space-between">
                      <span>
                        {item.user_id?.name ||
                          item.user_name ||
                          item.userName ||
                          item.user?.name ||
                          "Người dùng"}
                      </span>
                      <span className="text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </Flex>
                  }
                  description={
                    <div>
                      <div className="mb-2">
                        <Rate disabled value={item.rating} />
                        <span className="ml-2 text-gray-600">
                          ({item.rating}/5 sao)
                        </span>
                      </div>
                      <p className="text-gray-700">{item.content}</p>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default CoachFeedback;
