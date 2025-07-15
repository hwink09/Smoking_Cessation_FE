import { Card, Avatar, Typography, Rate, Tag, Button } from "antd";
import InfoBox from "~/components/common/InfoBox";
// Thêm các dòng import này vào đầu file CoachCard.jsx
import React, { useState } from "react";
import FeedbackModal from "./FeedbackModal"; // Import Modal vừa tạo
import { useAuth } from "~/hooks/useAuth"; // Import hook để lấy thông tin user

const { Title, Paragraph, Text } = Typography;

const CoachCard = ({ coach, onSelectCoach }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <Card
      hoverable
      className="rounded-lg border-0 shadow-lg bg-white transition-all group overflow-hidden flex flex-col"
      styles={{ body: { padding: 0, height: "100%" } }}>
      <div className="bg-blue-500 p-4 text-white flex items-center min-h-[120px]">
        <Avatar
          size={64}
          src={coach.coach_id?.avatar_url}
          className="border-3 border-white shadow-lg group-hover:scale-110 transition-transform"
        />
        <div className="ml-3">
          <Title
            level={5}
            className="m-0 mb-2 text-white"
            ellipsis={{ rows: 2, tooltip: coach.coach_id?.name }}>
            {coach.coach_id?.name || "Ẩn danh"}
          </Title>
          <Tag className="bg-white bg-opacity-20 border-0 text-white text-xs">
            {coach.specialization?.length > 20
              ? `${coach.specialization.slice(0, 20)}...`
              : coach.specialization}
          </Tag>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="space-y-3 mb-4">
          <InfoBox
            label="Kinh nghiệm"
            value={`${coach.experience_years} năm`}
            color="green"
          />
          <InfoBox
            label="Buổi hỗ trợ"
            value={coach.total_sessions}
            color="blue"
          />
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex justify-between items-center">
            <Text className="text-yellow-800 text-sm">Đánh giá</Text>
            <div className="flex items-center gap-1">
              <Rate
                disabled
                allowHalf
                defaultValue={coach.rating_avg}
                style={{ fontSize: "12px" }}
              />
              <Text className="text-yellow-600 text-xs">
                ({coach.rating_avg})
              </Text>
            </div>
          </div>
        </div>

        <div className="mb-4 flex-1">
          <Text strong className="block mb-2 text-sm">
            Giới thiệu:
          </Text>
          <Paragraph ellipsis={{ rows: 3 }} className="text-xs text-gray-600">
            {coach.bio}
          </Paragraph>
        </div>

        <Button
          type="primary"
          size="large"
          className="w-full bg-pink-500 hover:bg-pink-600"
          onClick={() => onSelectCoach(coach)}>
          Chọn làm huấn luyện viên
        </Button>

        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Đánh giá
        </Button>
      </div>
      {/* Đặt Modal ở đây, nó sẽ tự động ẩn/hiện */}
      <FeedbackModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        coachId={coach?._id} // Truyền ID của Coach vào Modal
        userId={user?._id} // Truyền ID của User vào Modal
        onSuccess={() => {
          setIsModalOpen(false); // Đóng modal sau khi gửi thành công
        }}
      />
    </Card>
  );
};

export default CoachCard;
