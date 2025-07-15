import React from "react";
import { Card, Typography, Button, Spin } from "antd";
import { CoachInfoDisplay } from "~/components/common/QuitPlanComponents";

const { Title, Text } = Typography;

const PendingRequestView = ({ pendingRequest, onRefresh, isRefreshing }) => {
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return <span className="text-orange-600">Đang chờ xác nhận</span>;
      case "approved":
        return (
          <span className="text-green-600">
            Đã được chấp nhận - Chờ tạo kế hoạch
          </span>
        );
      case "created":
        return (
          <span className="text-blue-600">
            Kế hoạch đã tạo - Chờ thiết lập chi tiết
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case "pending":
        return "Huấn luyện viên sẽ xem xét và phản hồi yêu cầu của bạn trong thời gian sớm nhất. Thời gian xử lý thường từ 1-24 giờ.";
      case "approved":
        return "Yêu cầu đã được chấp nhận! Huấn luyện viên đang tạo kế hoạch chi tiết phù hợp với tình trạng của bạn.";
      case "created":
        return "Kế hoạch đã được tạo! Huấn luyện viên đang thiết lập các giai đoạn và nhiệm vụ cụ thể cho hành trình cai thuốc của bạn.";
      default:
        return "Vui lòng chờ trong giây lát...";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 shadow-lg rounded-lg max-w-4xl w-full">
        <div className="text-center">
          <Title level={1} className="text-4xl mb-4 text-blue-600">
            Đang Chờ Xác Nhận
          </Title>
          <Text className="block text-lg mb-8 text-gray-600">
            Yêu cầu cai thuốc của bạn đang chờ huấn luyện viên xác nhận
          </Text>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-6">
            <div className="flex items-center justify-center mb-4">
              <Spin size="large" />
            </div>
            <Text className="text-blue-800 font-medium block mb-2">
              Trạng thái: {getStatusText(pendingRequest.status)}
            </Text>
            <Text className="text-gray-600 text-sm mb-4">
              {getStatusDescription(pendingRequest.status)}
            </Text>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={onRefresh}
                loading={isRefreshing}
                className="bg-blue-500 hover:bg-blue-600 border-blue-500 text-white"
                disabled={isRefreshing}
              >
                {isRefreshing ? "Đang kiểm tra..." : "🔄 Kiểm tra cập nhật"}
              </Button>
            </div>
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
