// Common UI components for quit plan functionality
import React from "react";
import { Card, Typography, Tag, Button, Avatar, Alert, Spin } from "antd";
import {
  CheckCircleFilled,
  ClockCircleFilled,
  ReloadOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

// ==================== LOADING COMPONENTS ====================

/**
 * Loading skeleton for stages
 */
export const StageLoadingSkeleton = ({ text = "Đang tải..." }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <Spin size="large" />
      <Text className="mt-4 block text-gray-600">{text}</Text>
    </div>
  </div>
);

/**
 * Full page loading skeleton
 */
export const FullPageLoadingSkeleton = ({ text = "Đang tải..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-4xl w-full">
      <Card className="p-8 shadow-lg rounded-lg text-center py-20">
        <Spin size="large" />
        <Text className="mt-6 text-lg text-gray-600 font-medium">{text}</Text>
      </Card>
    </div>
  </div>
);

// ==================== ERROR COMPONENTS ====================

/**
 * Error card for stages
 */
export const StageErrorCard = ({ message = "Đã xảy ra lỗi", description }) => (
  <div className="p-4">
    <Alert
      type="error"
      message={message}
      description={description}
      showIcon
      className="rounded-lg border-0 bg-red-50"
    />
  </div>
);

/**
 * Full page error card
 */
export const FullPageErrorCard = ({
  message = "Đã xảy ra lỗi",
  description,
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-4xl w-full">
      <Card className="p-8 shadow-lg rounded-lg">
        <Alert
          type="error"
          message={message}
          description={description}
          showIcon
          className="rounded-lg border-0 bg-red-50"
        />
      </Card>
    </div>
  </div>
);

// ==================== EMPTY STATE COMPONENTS ====================

/**
 * Empty state card for stages
 */
export const StageEmptyCard = ({
  title = "Chưa có dữ liệu",
  description = "Không có dữ liệu để hiển thị",
}) => (
  <div className="text-center p-8">
    <Title level={4} className="text-gray-600 mb-4">
      {title}
    </Title>
    <Paragraph className="text-gray-500 max-w-md mx-auto">
      {description}
    </Paragraph>
  </div>
);

/**
 * Full page empty state
 */
export const FullPageEmptyCard = ({
  title = "Chưa có dữ liệu",
  description = "Không có dữ liệu để hiển thị",
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-4xl w-full">
      <Card className="p-8 shadow-lg rounded-lg text-center py-20">
        <Title level={3} className="text-gray-600 mb-4">
          {title}
        </Title>
        <Paragraph className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
          {description}
        </Paragraph>
      </Card>
    </div>
  </div>
);

// ==================== COACH COMPONENTS ====================

/**
 * Coach info display component
 */
export const CoachInfoDisplay = ({ coach }) => (
  <div className="flex items-center space-x-4 bg-gray-50 p-6 rounded-lg border border-gray-100">
    {coach ? (
      <>
        <Avatar
          size={80}
          src={coach.avatar_url}
          className="border-4 border-white shadow-lg"
        />
        <div>
          <Title level={4} className="mb-2">
            {coach.name || "Ẩn danh"}
          </Title>
          <Tag color="blue">
            {coach.specialization || "Chuyên gia cai thuốc"}
          </Tag>
        </div>
      </>
    ) : (
      <Text>Chưa có huấn luyện viên</Text>
    )}
  </div>
);

/**
 * Detailed coach info component
 */
export const DetailedCoachInfo = ({ coach, plan }) => {
  if (!coach) {
    return <Text>Chưa có thông tin huấn luyện viên</Text>;
  }

  return (
    <div className="space-y-6">
      {/* Coach Avatar and Basic Info */}
      <div className="text-center">
        <Avatar
          size={120}
          src={coach.avatar_url}
          className="border-4 border-blue-100 shadow-lg mb-4"
        />
        <Title level={4} className="mb-2 text-gray-800">
          {coach.name || "Ẩn danh"}
        </Title>
        <Tag color="blue" className="mb-4">
          {coach.specialization || "Chuyên gia cai thuốc"}
        </Tag>
      </div>

      {/* Contact Info */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <Text strong className="text-blue-800 block mb-2">
          📧 Thông tin liên hệ
        </Text>
        <Text className="text-blue-600 text-sm">
          {coach.email || "Chưa cập nhật email"}
        </Text>
        {coach.phone && (
          <Text className="text-blue-600 text-sm block mt-1">
            📞 {coach.phone}
          </Text>
        )}
      </div>

      {/* Rating */}
      {coach.rating && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <Text strong className="text-yellow-800 block mb-2">
            ⭐ Đánh giá
          </Text>
          <div className="flex items-center gap-2">
            <Text className="text-yellow-600 text-sm">({coach.rating}/5)</Text>
          </div>
        </div>
      )}

      {/* Experience */}
      {coach.experience && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <Text strong className="text-green-800 block mb-2">
            💼 Kinh nghiệm
          </Text>
          <Text className="text-green-600 text-sm">
            {coach.experience} năm kinh nghiệm
          </Text>
        </div>
      )}

      {/* Bio */}
      {coach.bio && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <Text strong className="text-gray-800 block mb-2">
            📝 Giới thiệu
          </Text>
          <Paragraph
            className="text-gray-600 text-sm mb-0"
            ellipsis={{ rows: 4, expandable: true, symbol: "Xem thêm" }}
          >
            {coach.bio}
          </Paragraph>
        </div>
      )}

      {/* Plan Info */}
      {plan && (
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <Text strong className="text-purple-800 block mb-3">
            Thông tin kế hoạch
          </Text>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Text className="text-purple-600 text-sm">Tên kế hoạch:</Text>
              <Text className="text-purple-800 text-sm font-medium">
                {plan.name}
              </Text>
            </div>
            <div className="flex justify-between">
              <Text className="text-purple-600 text-sm">Ngày bắt đầu:</Text>
              <Text className="text-purple-800 text-sm font-medium">
                {new Date(plan.start_date).toLocaleDateString("vi-VN")}
              </Text>
            </div>
            <div className="flex justify-between">
              <Text className="text-purple-600 text-sm">Mục tiêu:</Text>
              <Text className="text-purple-800 text-sm font-medium">
                {new Date(plan.target_quit_date).toLocaleDateString("vi-VN")}
              </Text>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== PLAN COMPONENTS ====================

/**
 * Plan info display component
 */
export const PlanInfoDisplay = ({ plan }) => (
  <div className="space-y-4">
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
      <Text className="text-blue-800 font-semibold">Tên kế hoạch</Text>
      <Text className="text-blue-600 ml-2">{plan.name}</Text>
    </div>

    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
      <Text className="text-green-800 font-semibold">Ngày bắt đầu</Text>
      <Text className="text-green-600 ml-2">
        {new Date(plan.start_date).toLocaleDateString("vi-VN")}
      </Text>
    </div>

    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
      <Text className="text-purple-800 font-semibold">Ngày mục tiêu</Text>
      <Text className="text-purple-600 ml-2">
        {new Date(plan.target_quit_date).toLocaleDateString("vi-VN")}
      </Text>
    </div>

    <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">
      <Text className="text-cyan-800 font-semibold">Trạng thái</Text>
      <Tag color={plan.status === "active" ? "green" : "blue"} className="ml-2">
        {plan.status === "active" ? "Đang hoạt động" : "Đang thực hiện"}
      </Tag>
    </div>
  </div>
);

// ==================== PROGRESS COMPONENTS ====================

/**
 * Progress overview component - Horizontal slide layout
 */
export const ProgressOverview = ({ myStages, currentStage }) => {
  if (!myStages || myStages.length === 0) {
    return null;
  }

  const currentStageIndex = myStages.findIndex(
    (stage) => stage._id === currentStage?._id
  );

  // Kiểm tra xem tất cả stages đã hoàn thành chưa
  const allStagesCompleted = myStages.every((stage) => stage.is_completed);

  const stageItems = myStages.map((stage, index) => ({
    title: `Giai đoạn ${stage.stage_number || index + 1}`,
    description: stage.title,
    status: stage.is_completed
      ? "finish"
      : stage._id === currentStage?._id
      ? "process"
      : "wait",
    icon: stage.is_completed ? (
      <CheckCircleFilled style={{ color: "#52c41a" }} />
    ) : stage._id === currentStage?._id ? (
      <ClockCircleFilled style={{ color: "#1890ff" }} />
    ) : undefined,
  }));

  return (
    <Card
      className={`mb-6 ${
        allStagesCompleted
          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
          : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
      }`}
    >
      <Title level={4} className="mb-4 text-gray-800">
        {allStagesCompleted
          ? "🏆 Hành trình cai thuốc đã hoàn thành"
          : "📋 Tổng quan hành trình cai thuốc"}
      </Title>

      {/* Mobile version - vertical layout */}
      <div className="block md:hidden">
        <div className="space-y-3">
          {stageItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center p-3 rounded-lg border transition-all duration-300 ${
                item.status === "finish"
                  ? "bg-green-50 border-green-200"
                  : item.status === "process"
                  ? "bg-blue-50 border-blue-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="mr-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    item.status === "finish"
                      ? "bg-green-500 border-green-500 text-white"
                      : item.status === "process"
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {item.icon || (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <Title level={5} className="mb-1 text-sm">
                  {item.title}
                </Title>
                <Text className="text-xs text-gray-600">
                  {item.description}
                </Text>
              </div>
              <div>
                <Tag
                  size="small"
                  color={
                    item.status === "finish"
                      ? "green"
                      : item.status === "process"
                      ? "blue"
                      : "default"
                  }
                  className="text-xs"
                >
                  {item.status === "finish"
                    ? "✓"
                    : item.status === "process"
                    ? "▶"
                    : "○"}
                </Tag>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop version - horizontal layout */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200 z-0">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{
                width: `${
                  currentStageIndex >= 0
                    ? (currentStageIndex / Math.max(stageItems.length - 1, 1)) *
                      100
                    : 0
                }%`,
              }}
            />
          </div>

          {/* Stage items */}
          <div className="flex justify-between items-start relative z-10">
            {stageItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                style={{ maxWidth: `${100 / stageItems.length}%` }}
              >
                {/* Stage circle */}
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-4 mb-3 transition-all duration-300 ${
                    item.status === "finish"
                      ? "bg-green-500 border-green-500 text-white"
                      : item.status === "process"
                      ? "bg-blue-500 border-blue-500 text-white animate-pulse"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {item.icon || (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Stage info */}
                <div className="text-center px-2">
                  <Title
                    level={5}
                    className={`mb-1 text-xs ${
                      item.status === "finish"
                        ? "text-green-600"
                        : item.status === "process"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {item.title}
                  </Title>
                  <Text
                    className={`text-xs ${
                      item.status === "finish"
                        ? "text-green-500"
                        : item.status === "process"
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                    ellipsis={{ tooltip: item.description }}
                  >
                    {item.description.length > 15
                      ? `${item.description.substring(0, 15)}...`
                      : item.description}
                  </Text>
                </div>

                {/* Status badge */}
                <div className="mt-2">
                  <Tag
                    size="small"
                    color={
                      item.status === "finish"
                        ? "green"
                        : item.status === "process"
                        ? "blue"
                        : "default"
                    }
                    className="text-xs"
                  >
                    {item.status === "finish"
                      ? "Hoàn thành"
                      : item.status === "process"
                      ? "Đang thực hiện"
                      : "Chưa bắt đầu"}
                  </Tag>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
/**
 * Refresh button component
 */
export const RefreshButton = ({ onRefresh, loading = false }) => (
  <Button
    icon={<ReloadOutlined />}
    onClick={onRefresh}
    loading={loading}
    className="h-fit"
  >
    Làm mới
  </Button>
);

/**
 * Next stage button component
 */
export const NextStageButton = ({
  onClick,
  disabled = false,
  loading = false,
  progress = 0,
}) => (
  <Button
    type="primary"
    onClick={onClick}
    loading={loading}
    disabled={disabled}
    className={`h-fit ${
      progress === 100 ? "bg-green-500 hover:bg-green-600" : ""
    }`}
  >
    🚀 Chuyển giai đoạn tiếp theo
  </Button>
);

// ==================== UTILITY COMPONENTS ====================

/**
 * Status tag component
 */
export const StatusTag = ({ status, type = "default" }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "active":
        return { color: "green", text: "Đang hoạt động" };
      case "completed":
        return { color: "blue", text: "Hoàn thành" };
      case "pending":
        return { color: "orange", text: "Đang chờ" };
      case "approved":
        return { color: "green", text: "Đã duyệt" };
      case "rejected":
        return { color: "red", text: "Bị từ chối" };
      default:
        return { color: "default", text: status };
    }
  };

  const config = getStatusConfig(status);
  return <Tag color={config.color}>{config.text}</Tag>;
};

/**
 * Info box component
 */
export const InfoBox = ({ label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-100 text-blue-800",
    green: "bg-green-50 border-green-100 text-green-800",
    purple: "bg-purple-50 border-purple-100 text-purple-800",
    orange: "bg-orange-50 border-orange-100 text-orange-800",
    red: "bg-red-50 border-red-100 text-red-800",
  };

  return (
    <div
      className={`p-3 rounded-lg border ${
        colorClasses[color] || colorClasses.blue
      }`}
    >
      <Text className="font-semibold block">{label}</Text>
      <Text className="text-sm">{value}</Text>
    </div>
  );
};

export default {
  StageLoadingSkeleton,
  FullPageLoadingSkeleton,
  StageErrorCard,
  FullPageErrorCard,
  StageEmptyCard,
  FullPageEmptyCard,
  CoachInfoDisplay,
  DetailedCoachInfo,
  PlanInfoDisplay,
  ProgressOverview,
  RefreshButton,
  NextStageButton,
  StatusTag,
  InfoBox,
};
