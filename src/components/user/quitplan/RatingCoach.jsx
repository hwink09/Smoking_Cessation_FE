import React, { useState, useEffect } from "react";
import {
  Modal,
  Rate,
  Input,
  Button,
  Card,
  Avatar,
  Typography,
  message,
  Tag,
  Divider,
  Spin,
  Result,
} from "antd";
import {
  StarFilled,
  StarOutlined,
  HeartFilled,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import FeedbackService from "~/services/feedbackService";
import useCoachRating from "~/hooks/useCoachRating";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Rating descriptions
const ratingDescriptions = {
  1: "Rất không hài lòng",
  2: "Không hài lòng",
  3: "Bình thường",
  4: "Hài lòng",
  5: "Rất hài lòng",
};

const RatingCoach = ({
  isVisible,
  onClose,
  coachInfo,
  planInfo,
  userId,
  onRatingSubmitted,
}) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    hasRated,
    loading: checkingRating,
    error: ratingError,
    setHasRated,
  } = useCoachRating(coachInfo?._id, planInfo?._id, userId);

  useEffect(() => {
    if (isVisible) {
      setRating(0);
      setContent("");
    }
  }, [isVisible]);

  const handleSubmit = async () => {
    if (hasRated) {
      message.warning("Bạn đã đánh giá huấn luyện viên này rồi!");
      return;
    }

    if (rating === 0) {
      message.warning("Vui lòng chọn số sao đánh giá!");
      return;
    }

    if (!content.trim()) {
      message.warning("Vui lòng nhập nội dung đánh giá!");
      return;
    }

    if (!coachInfo?._id) {
      message.error("Không tìm thấy thông tin huấn luyện viên!");
      return;
    }

    if (!planInfo?._id) {
      message.error("Không tìm thấy thông tin kế hoạch!");
      return;
    }

    setLoading(true);
    try {
      const feedbackData = {
        plan_id: planInfo._id,
        coach_id: coachInfo._id,
        rating,
        feedback_type: "user_to_coach",
        content: content.trim(),
      };

      await FeedbackService.createFeedback(feedbackData);
      message.success("Đánh giá của bạn đã được gửi thành công!");
      setHasRated(true); // Update the local state
      onRatingSubmitted?.();
      onClose();
    } catch (error) {
      const status = error.response?.status;
      const messageText = error.response?.data?.message || error.message;

      if (status === 401) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      } else if (status === 400) {
        if (
          messageText.includes("already rated") ||
          messageText.includes("đã đánh giá")
        ) {
          message.warning("Bạn đã đánh giá huấn luyện viên này rồi!");
          setHasRated(true);
        } else {
          message.error(`Dữ liệu không hợp lệ: ${messageText}`);
        }
      } else if (status === 500) {
        message.error("Lỗi server. Vui lòng thử lại sau!");
      } else {
        message.error("Không thể gửi đánh giá. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      className="rating-coach-modal"
      zIndex={1000}
      maskClosable={false}
      destroyOnHidden
    >
      <div className="p-6">
        {checkingRating ? (
          // Loading state while checking rating status
          <div className="text-center py-12">
            <Spin size="large" />
            <Text className="block mt-4 text-gray-600">
              Đang kiểm tra trạng thái đánh giá...
            </Text>
          </div>
        ) : hasRated ? (
          // Already rated view
          <div className="text-center">
            <CheckCircleOutlined style={{ fontSize: 64, color: "#52c41a" }} />
            <Title level={2} className="mb-2 text-green-600">
              Đã đánh giá! ✅
            </Title>
            <Text className="text-lg text-gray-600 block mb-6">
              Bạn đã đánh giá huấn luyện viên này rồi
            </Text>

            <Card className="mb-6 bg-green-50 border-green-200">
              <div className="flex items-center space-x-4">
                <Avatar
                  size={64}
                  src={coachInfo?.avatar_url}
                  className="border-2 border-green-300"
                />
                <div className="flex-1">
                  <Title level={4} className="mb-1 text-green-800">
                    {coachInfo?.name || "Huấn luyện viên"}
                  </Title>
                  <Tag color="green" className="mb-2">
                    Đã được đánh giá
                  </Tag>
                  <Text className="block text-gray-600 text-sm">
                    Cảm ơn bạn đã chia sẻ đánh giá về huấn luyện viên
                  </Text>
                </div>
                <CheckCircleOutlined className="text-green-500 text-2xl" />
              </div>
            </Card>

            <Result
              icon={<InfoCircleOutlined style={{ color: "#1890ff" }} />}
              title="Đánh giá đã được ghi nhận"
              subTitle="Phản hồi của bạn sẽ giúp cải thiện chất lượng dịch vụ và hỗ trợ những người dùng khác"
              extra={
                <Button type="primary" onClick={onClose}>
                  Đóng
                </Button>
              }
            />
          </div>
        ) : (
          // Rating form view
          <>
            <div className="text-center mb-6">
              <CheckCircleOutlined style={{ fontSize: 64, color: "#52c41a" }} />
              <Title level={2} className="mb-2 text-green-600">
                Chúc Mừng! 🎉
              </Title>
              <Text className="text-lg text-gray-600">
                Bạn đã hoàn thành kế hoạch cai thuốc thành công!
              </Text>
            </div>

            <Divider />

            <Card className="mb-6 bg-blue-50 border-blue-200">
              <div className="flex items-center space-x-4">
                <Avatar
                  size={64}
                  src={coachInfo?.avatar_url}
                  className="border-2 border-blue-300"
                />
                <div className="flex-1">
                  <Title level={4} className="mb-1 text-blue-800">
                    {coachInfo?.name || "Huấn luyện viên"}
                  </Title>
                  <Tag color="blue" className="mb-2">
                    Huấn luyện viên hỗ trợ
                  </Tag>
                  <Text className="block text-gray-600 text-sm">
                    Đã đồng hành cùng bạn trong hành trình cai thuốc
                  </Text>
                </div>
                <HeartFilled className="text-red-500 text-2xl" />
              </div>
            </Card>

            <div className="mb-6">
              <Title level={4} className="mb-4 text-center">
                Hãy đánh giá huấn luyện viên của bạn
              </Title>

              <div className="text-center mb-4">
                <Rate
                  value={rating}
                  onChange={setRating}
                  style={{ fontSize: 32 }}
                  character={({ index, value }) =>
                    index < value ? (
                      <StarFilled style={{ color: "#fadb14" }} />
                    ) : (
                      <StarOutlined style={{ color: "#d9d9d9" }} />
                    )
                  }
                />
                {rating > 0 && (
                  <div className="mt-2">
                    <Text className="text-lg font-medium text-orange-500">
                      {ratingDescriptions[rating]}
                    </Text>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <Text strong className="block mb-2 text-sm">
                  Tiêu chí đánh giá:
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>• Sự hỗ trợ và tận tâm</div>
                  <div>• Chuyên môn và kinh nghiệm</div>
                  <div>• Giao tiếp và thái độ</div>
                  <div>• Hiệu quả của lời khuyên</div>
                </div>
              </div>

              <div className="mb-4">
                <Text strong className="block mb-2">
                  Chia sẻ cảm nhận của bạn về huấn luyện viên: *
                </Text>
                <TextArea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Hãy chia sẻ trải nghiệm của bạn với huấn luyện viên..."
                  rows={4}
                  maxLength={500}
                  showCount
                  className="mb-2"
                />
                <Text type="secondary" className="text-xs">
                  Đánh giá của bạn sẽ giúp huấn luyện viên cải thiện chất lượng
                  hỗ trợ
                </Text>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button size="large" onClick={onClose} disabled={loading}>
                Để sau
              </Button>
              <Button
                type="primary"
                size="large"
                loading={loading}
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600"
                disabled={rating === 0 || !content.trim()}
              >
                Gửi đánh giá
              </Button>
            </div>
          </>
        )}

        {ratingError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <Text className="text-red-600 text-sm">Lỗi: {ratingError}</Text>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RatingCoach;
