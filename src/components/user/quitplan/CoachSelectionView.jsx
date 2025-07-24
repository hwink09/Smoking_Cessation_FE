import React from "react";
import { Card, Typography } from "antd";
import CoachCard from "./CoachCard";
import QuitPlanModal from "./QuitPlanModal";

const { Title, Text } = Typography;

const CoachSelectionView = ({
  coaches,
  selectedCoach,
  onSelectCoach,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 shadow-lg rounded-lg max-w-6xl w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Title level={1} className="text-center text-3xl mb-4">
              Chọn Huấn Luyện Viên
            </Title>
            <Text className="block text-center text-lg mb-8">
              Chọn một huấn luyện viên phù hợp để bắt đầu hành trình cai thuốc
            </Text>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {coaches.length ? (
            coaches.map((coach) => (
              <CoachCard
                key={coach._id}
                coach={coach}
                onSelectCoach={onSelectCoach}
              />
            ))
          ) : (
            <Text className="text-center col-span-full">
              Hiện tại chưa có huấn luyện viên khả dụng
            </Text>
          )}
        </div>

        <QuitPlanModal
          visible={!!selectedCoach}
          onCancel={onCancel}
          onSubmit={onSubmit}
          coach={selectedCoach}
        />
      </Card>
    </div>
  );
};

export default CoachSelectionView;
