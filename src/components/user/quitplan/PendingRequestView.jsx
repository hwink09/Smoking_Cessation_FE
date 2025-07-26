import React from "react";
import { Card, Button, Spin, Typography } from "antd";
import { CoachInfoDisplay } from "~/components/common/QuitPlanComponents";
import QuitPlanHeader from "./QuitPlanHeader";

const { Text } = Typography;

const statusMap = {
  pending: {
    color: "text-orange-600",
    text: "Đang chờ xác nhận",
    description:
      "Huấn luyện viên sẽ xem xét và phản hồi yêu cầu của bạn trong thời gian sớm nhất. Thời gian xử lý thường từ 1-24 giờ.",
  },
  approved: {
    color: "text-green-600",
    text: "Đã được chấp nhận - Chờ tạo kế hoạch",
    description:
      "Yêu cầu đã được chấp nhận! Huấn luyện viên đang tạo kế hoạch chi tiết phù hợp với tình trạng của bạn.",
  },
  created: {
    color: "text-blue-600",
    text: "Kế hoạch đã tạo - Chờ thiết lập chi tiết",
    description:
      "Kế hoạch đã được tạo! Huấn luyện viên đang thiết lập các giai đoạn và nhiệm vụ cụ thể cho hành trình cai thuốc của bạn.",
  },
};

const PendingRequestView = ({ pendingRequest, onRefresh, isRefreshing }) => {
  const status = statusMap[pendingRequest.status] || {
    color: "text-gray-600",
    text: pendingRequest.status,
    description: "Vui lòng chờ trong giây lát...",
  };

  return (
    <div className="min-h-screen text-slate-800 p-4 max-w-6xl mx-auto">
      <QuitPlanHeader />

      <Card
        className="border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
        title={
          <div className="flex items-center gap-3 py-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg
                className="w-5 h-5 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent mb-1">
                Trạng thái yêu cầu
              </h3>
              <p className="text-sm text-gray-500">
                Yêu cầu cai thuốc của bạn đang chờ huấn luyện viên xác nhận
              </p>
            </div>
          </div>
        }
        styles={{
          header: {
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            borderBottom: "1px solid #e2e8f0",
          },
          body: { padding: 32 },
        }}
      >
        <div className="text-center">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-6">
            <div className="flex items-center justify-center mb-4">
              <Spin size="large" />
            </div>
            <Text className={`font-medium block mb-2 ${status.color}`}>
              Trạng thái: {status.text}
            </Text>
            <Text className="text-gray-600 text-sm mb-4 block">
              {status.description}
            </Text>
            <Button
              onClick={onRefresh}
              loading={isRefreshing}
              disabled={isRefreshing}
              className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
            >
              {isRefreshing ? "Đang kiểm tra..." : "🔄 Kiểm tra cập nhật"}
            </Button>
          </div>

          {pendingRequest.coach_id && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <Text strong className="text-gray-800 block mb-4">
                Huấn luyện viên được chọn:
              </Text>
              <CoachInfoDisplay coach={pendingRequest.coach_id} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PendingRequestView;
