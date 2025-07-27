import React, { useState, useEffect } from "react";
import { Card, Avatar, Typography, Rate, Tag, Button, Space } from "antd";
import { Star, Calendar, User, Award } from "lucide-react";
import useCoachData from "~/hooks/useCoachData";

const { Title, Paragraph } = Typography;

const CoachCard = ({ coach, onSelectCoach }) => {
  const { getCoachRatingInfo } = useCoachData();
  const [ratingInfo, setRatingInfo] = useState({
    averageRating: 0,
    totalFeedbacks: 0,
  });

  // Lấy thông tin đánh giá chi tiết từ API
  useEffect(() => {
    const fetchRatingInfo = async () => {
      if (coach.coach_id?._id) {
        try {
          const data = await getCoachRatingInfo(coach.coach_id._id);
          setRatingInfo(data);
        } catch (error) {
          console.error("Error fetching coach rating:", error);
        }
      }
    };

    fetchRatingInfo();
  }, [coach.coach_id?._id, getCoachRatingInfo]);

  return (
    <Card
      hoverable
      className="rounded-2xl border-0 shadow-lg bg-white transition-all duration-300 ease-in-out group overflow-hidden flex flex-col hover:shadow-xl hover:scale-105"
      styles={{ body: { padding: 0, height: "100%" } }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex items-center min-h-[140px] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
        <Avatar
          size={80}
          src={coach.coach_id?.avatar_url}
          className="border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-300 relative z-10"
        />
        <div className="ml-4 relative z-10">
          <Title
            level={4}
            className="m-0 mb-3 text-white font-bold"
            ellipsis={{ rows: 2, tooltip: coach.coach_id?.name }}
          >
            {coach.coach_id?.name || "Ẩn danh"}
          </Title>
          <Tag className="bg-white/20 backdrop-blur-sm border-0 text-white text-sm px-3 py-1 rounded-full font-medium">
            {coach.specialization?.length > 25
              ? `${coach.specialization.slice(0, 25)}...`
              : coach.specialization}
          </Tag>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-white to-gray-50">
        <div className="space-y-4 mb-6">
          {/* Experience */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex justify-between items-center">
            <Space className="text-green-800">
              <Award size={16} className="text-green-600" />
              <span className="font-medium">Kinh nghiệm</span>
            </Space>
            <span className="text-green-700 font-bold text-lg">
              {coach.experience_years} năm
            </span>
          </div>

          {/* Sessions */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex justify-between items-center">
            <Space className="text-blue-800">
              <Calendar size={16} className="text-blue-600" />
              <span className="font-medium">Buổi hỗ trợ</span>
            </Space>
            <span className="text-blue-700 font-bold text-lg">
              {coach.total_sessions}
            </span>
          </div>

          {/* Rating */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex justify-between items-center">
            <Space className="text-yellow-800">
              <Star size={16} className="text-yellow-600" />
              <span className="font-medium">Đánh giá</span>
            </Space>
            <div className="flex items-center mt-1">
              <Rate
                disabled
                allowHalf
                value={Number(ratingInfo.averageRating) || 0}
              />
              <span className="ml-2">({ratingInfo.totalFeedbacks || 0})</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6 flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <User size={16} className="text-gray-600" />
            <span className="font-semibold text-gray-700">Giới thiệu:</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <Paragraph
              ellipsis={{ rows: 3 }}
              className="text-sm text-gray-600 m-0"
            >
              {coach.bio}
            </Paragraph>
          </div>
        </div>

        {/* Select button */}
        <Button
          type="primary"
          size="large"
          className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 border-0 hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg font-semibold"
          onClick={() => onSelectCoach(coach)}
        >
          💬 Chọn tư vấn
        </Button>
      </div>
    </Card>
  );
};

export default CoachCard;
