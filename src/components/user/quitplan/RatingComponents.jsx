import React from "react";
import { Button, Typography, Card } from "antd";
import { StarOutlined, HeartOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const RatingPrompt = ({ onRateCoach, coachName }) => (
  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
    <div className="text-center py-4">
      <div className="mb-3">
        <HeartOutlined className="text-red-500 text-2xl mr-2" />
        <StarOutlined className="text-yellow-500 text-2xl" />
      </div>
      <Text className="block text-gray-700 mb-4">
        Bạn đã hoàn thành kế hoạch cai thuốc thành công! 🎉
        <br />
        Hãy chia sẻ trải nghiệm của bạn với huấn luyện viên{" "}
        <Text strong className="text-blue-600">
          {coachName}
        </Text>
      </Text>
      <Button
        type="primary"
        size="large"
        icon={<StarOutlined />}
        onClick={onRateCoach}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 shadow-lg hover:shadow-xl transition-all"
      >
        Đánh giá huấn luyện viên
      </Button>
    </div>
  </Card>
);

export const RatedIndicator = () => (
  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
    <div className="text-center py-3">
      <StarOutlined className="text-yellow-500 text-xl mr-2" />
      <Text className="text-green-700 font-medium">
        Cảm ơn bạn đã đánh giá huấn luyện viên! ✨
      </Text>
    </div>
  </Card>
);
