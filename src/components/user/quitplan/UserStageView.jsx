import { useCallback, useEffect, useState } from "react";
import {
  Typography,
  Tag,
  Alert,
  Button,
  message,
  Progress,
  Checkbox,
  Spin,
  Steps,
  Card,
} from "antd";
import {
  ReloadOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
} from "@ant-design/icons";
import { useUserQuitPlan } from "~/hooks/useUserQuitPlan";

const { Title, Text, Paragraph } = Typography;

const UserStageView = ({ quitPlan }) => {
  const [showStageCompletionAlert, setShowStageCompletionAlert] =
    useState(false);

  const {
    currentStage,
    myStages,
    stageTasks,
    loading,
    error,
    progress,
    completedCount,
    completeTask: completeTaskHook,
    moveToNextStage,
    refetch,
  } = useUserQuitPlan();

  // Fetch data lần đầu khi component mount
  useEffect(() => {
    refetch();
    setShowStageCompletionAlert(false); // Reset alert khi load trang
  }, [refetch]);

  const handleCompleteTask = useCallback(
    async (taskId) => {
      const result = await completeTaskHook(taskId);
      if (result.success) {
        if (result.allStagesCompleted) {
          message.success(result.message, 5);
        } else if (result.stageCompleted && result.hasNextStage) {
          message.success(
            "🎉 Chúc mừng! Bạn đã hoàn thành giai đoạn này. Nhấn nút 'Chuyển giai đoạn tiếp theo' để tiếp tục!",
            6
          );
        } else {
          message.success("Hoàn thành nhiệm vụ thành công!");
        }
      } else {
        message.error(
          result.error || "Không thể hoàn thành nhiệm vụ. Vui lòng thử lại."
        );
      }
    },
    [completeTaskHook]
  );

  const handleRefresh = useCallback(() => {
    message.loading("Đang tải lại dữ liệu...", 1);
    refetch();
  }, [refetch]);

  const handleMoveToNextStage = useCallback(async () => {
    const result = await moveToNextStage();
    if (result.success) {
      message.success(result.message, 3);
    } else {
      message.error(
        result.error || "Không thể chuyển giai đoạn. Vui lòng thử lại."
      );
    }
  }, [moveToNextStage]);

  if (loading)
    return <StageLoadingSkeleton text="Đang tải thông tin giai đoạn..." />;

  if (error)
    return <StageErrorCard message="Lỗi tải dữ liệu" description={error} />;

  if (!currentStage)
    return (
      <StageEmptyCard
        title="Chưa có giai đoạn nào được thiết lập"
        desc="Huấn luyện viên sẽ sớm thiết lập lộ trình cai thuốc."
      />
    );

  return (
    <div>
      {/* Tổng quan các giai đoạn */}
      {myStages && myStages.length > 0 && (
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <Title level={4} className="mb-4 text-gray-800">
            📋 Tổng quan hành trình cai thuốc
          </Title>
          <Steps
            current={myStages.findIndex(
              (stage) => stage._id === currentStage?._id
            )}
            size="small"
            items={myStages.map((stage, index) => ({
              title: `Giai đoạn ${stage.stage_number || index + 1}`,
              description: stage.title,
              status:
                stage.status === "completed"
                  ? "finish"
                  : stage._id === currentStage?._id
                  ? "process"
                  : "wait",
              icon:
                stage.status === "completed" ? (
                  <CheckCircleFilled style={{ color: "#52c41a" }} />
                ) : stage._id === currentStage?._id ? (
                  <ClockCircleFilled style={{ color: "#1890ff" }} />
                ) : undefined,
            }))}
          />
        </Card>
      )}

      <div className="mb-6">
        <div className="flex justify-between mb-4">
          <div className="flex-1">
            <Title
              level={3}
              className="mb-2 text-gray-800"
              ellipsis={{ rows: 2, tooltip: currentStage.title }}
            >
              {currentStage.title}
            </Title>
          </div>

          <div className="flex gap-2">
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
              className="h-fit"
            >
              Làm mới
            </Button>
            {/* Nút chuyển giai đoạn tiếp theo - luôn hiển thị */}
            <Button
              type="primary"
              icon="🚀"
              onClick={
                progress === 100
                  ? handleMoveToNextStage
                  : () => {
                      message.warning(
                        `Bạn còn ${
                          stageTasks.length - completedCount
                        } nhiệm vụ chưa hoàn thành. Hãy hoàn thành tất cả để chuyển giai đoạn tiếp theo!`,
                        4
                      );
                    }
              }
              loading={loading}
              disabled={progress < 100}
              className={`h-fit ${
                progress === 100 ? "bg-green-500 hover:bg-green-600" : ""
              }`}
            >
              Chuyển giai đoạn tiếp theo
            </Button>
          </div>
        </div>

        {currentStage.description && (
          <div className="bg-gray-50 p-4 rounded-lg border mb-4">
            <Paragraph
              ellipsis={{ rows: 3, expandable: true, symbol: "Xem thêm" }}
            >
              {currentStage.description}
            </Paragraph>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Giai đoạn hiện tại"
            value={`${currentStage.stage_number || 1}/${myStages.length}`}
            color="blue"
          />
          <ProgressCard
            percent={progress}
            completed={completedCount}
            total={stageTasks.length}
          />
          <StatCard
            label="Trạng thái"
            value={progress === 100 ? "Hoàn thành" : "Đang thực hiện"}
            color={progress === 100 ? "green" : "orange"}
          />
        </div>
      </div>

      <div>
        <Title level={4} className="mb-4 text-gray-800">
          Nhiệm vụ cần hoàn thành
        </Title>

        {/* Thông báo khi hoàn thành 100% */}
        {progress === 100 && stageTasks.length > 0 && (
          <Alert
            message="🎉 Chúc mừng! Bạn đã hoàn thành tất cả nhiệm vụ trong giai đoạn này!"
            description="Bạn có thể chuyển sang giai đoạn tiếp theo bằng cách nhấn nút ở phía trên."
            type="success"
            showIcon
            className="mb-4"
          />
        )}

        <div className="max-h-80 overflow-y-auto">
          {stageTasks.length ? (
            stageTasks.map((task, i) => (
              <TaskCard
                key={task._id}
                task={task}
                index={i}
                onComplete={handleCompleteTask}
              />
            ))
          ) : (
            <StageEmptyCard
              title="Chưa có nhiệm vụ nào"
              desc="Huấn luyện viên sẽ sớm thêm nhiệm vụ cho giai đoạn này."
            />
          )}
        </div>
      </div>
    </div>
  );
};

const StageLoadingSkeleton = ({ text }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <Spin size="large" />
      <Text className="mt-4 block text-gray-600">{text}</Text>
    </div>
  </div>
);

const StageErrorCard = ({ message: msg, description }) => (
  <div className="p-4">
    <Alert
      type="error"
      message={msg}
      description={description}
      showIcon
      className="rounded-lg border-0 bg-red-50"
    />
  </div>
);

const StageEmptyCard = ({ title, desc }) => (
  <div className="text-center p-8">
    <Title level={4} className="text-gray-600 mb-4">
      {title}
    </Title>
    <Paragraph className="text-gray-500 max-w-md mx-auto">{desc}</Paragraph>
  </div>
);

const SkeletonCard = ({ text }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-4xl w-full">
      <Card className="p-8 shadow-lg rounded-lg text-center py-20">
        <Spin size="large" />
        <Text className="mt-6 text-lg text-gray-600 font-medium">{text}</Text>
      </Card>
    </div>
  </div>
);

const ErrorCard = ({ message: msg, description }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-4xl w-full">
      <Card className="p-8 shadow-lg rounded-lg">
        <Alert
          type="error"
          message={msg}
          description={description}
          showIcon
          className="rounded-lg border-0 bg-red-50"
        />
      </Card>
    </div>
  </div>
);

const EmptyCard = ({ title, desc }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-4xl w-full">
      <Card className="p-8 shadow-lg rounded-lg text-center py-20">
        <Title level={3} className="text-gray-600 mb-4">
          {title}
        </Title>
        <Paragraph className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
          {desc}
        </Paragraph>
      </Card>
    </div>
  </div>
);

const StatCard = ({ label, value, color }) => (
  <div
    className={`bg-${color}-50 p-4 rounded-lg border border-${color}-100 flex justify-between items-center`}
  >
    <Text strong className={`text-${color}-800 text-sm`}>
      {label}
    </Text>
    <Text className={`text-2xl font-bold text-${color}-700`}>{value}</Text>
  </div>
);

const ProgressCard = ({ percent, completed, total }) => (
  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
    <div className="flex flex-col">
      <div className="flex justify-between mb-2">
        <Text strong className="text-green-800 text-sm">
          Tiến độ hoàn thành
        </Text>
        <Text className="text-2xl font-bold text-green-700">{percent}%</Text>
      </div>
      <Progress
        percent={percent}
        showInfo={false}
        strokeColor={{ "0%": "#10b981", "100%": "#059669" }}
        size="small"
        className="mb-1"
      />
      <Text type="secondary" className="text-xs">
        {completed}/{total} nhiệm vụ
      </Text>
    </div>
  </div>
);

const TaskCard = ({ task, index, onComplete }) => {
  const isLocked = false; // Trong tương lai có thể thêm logic lock task

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border transition-all duration-300 mb-3 ${
        task.is_completed
          ? "bg-green-50 border-green-200"
          : isLocked
          ? "bg-gray-50 border-gray-200 opacity-60"
          : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg"
      }`}
    >
      <div className="p-4 flex items-start gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              task.is_completed
                ? "bg-green-500 text-white"
                : isLocked
                ? "bg-gray-400 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {task.is_completed ? "✓" : isLocked ? "🔒" : index + 1}
          </div>
          <Checkbox checked={task.is_completed} disabled size="small" />
        </div>

        <div className="flex-1 min-w-0">
          <Title
            level={5}
            className={`${
              task.is_completed
                ? "line-through text-gray-500"
                : isLocked
                ? "text-gray-400"
                : "text-gray-800"
            } mb-1`}
            ellipsis={{ rows: 2, tooltip: task.title }}
            style={{ fontSize: "14px" }}
          >
            {task.title}
          </Title>
          <Paragraph
            className={`${
              task.is_completed
                ? "text-gray-400"
                : isLocked
                ? "text-gray-400"
                : "text-gray-600"
            } mb-2`}
            ellipsis={{ rows: 2 }}
          >
            {task.description}
          </Paragraph>
          {task.deadline && (
            <Text className="text-xs text-gray-500">
              Hạn: {new Date(task.deadline).toLocaleDateString("vi-VN")}
            </Text>
          )}
        </div>

        {!task.is_completed && !isLocked && (
          <Button
            size="small"
            onClick={() => onComplete(task._id)}
            className="ml-2 bg-green-500 hover:bg-green-600 border-0 shadow-md hover:shadow-lg text-white text-xs"
          >
            Hoàn thành
          </Button>
        )}

        {task.is_completed && (
          <div className="ml-2 text-green-500 text-xl">✅</div>
        )}
      </div>
    </div>
  );
};

export default UserStageView;
