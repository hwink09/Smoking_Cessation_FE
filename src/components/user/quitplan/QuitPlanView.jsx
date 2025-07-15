import React from "react";
import { Card, Typography } from "antd";
import { DetailedCoachInfo } from "~/components/common/QuitPlanComponents";
import UserStageView from "./UserStageView";

const { Title, Text } = Typography;

const QuitPlanView = ({ userQuitPlan }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <Title level={1} className="text-4xl mb-2">
              Kế Hoạch Cai Thuốc Của Bạn
            </Title>
            <Text className="text-lg text-gray-600">
              Theo dõi tiến trình và hoàn thành mục tiêu của bạn
            </Text>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Container bên trái - Thông tin Coach */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg rounded-lg h-fit sticky top-4">
              <div className="text-center mb-6">
                <Title level={3} className="mb-4 text-gray-800">
                  Huấn Luyện Viên Của Bạn
                </Title>
              </div>
              <DetailedCoachInfo
                coach={userQuitPlan.coach_id}
                plan={userQuitPlan}
              />
            </Card>
          </div>

          {/* Container bên phải - Stage và Task */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg rounded-lg h-full">
              <Title level={3} className="mb-6 text-gray-800">
                Giai Đoạn Hiện Tại & Nhiệm Vụ
              </Title>
              <UserStageView quitPlan={userQuitPlan} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuitPlanView;
