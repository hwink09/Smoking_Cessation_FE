import { useCallback, useEffect } from "react";
import { Typography, Alert, Button, message, Spin, Steps, Card } from "antd";
import {
  ReloadOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
} from "@ant-design/icons";
import { useUserQuitPlan } from "~/hooks/useUserQuitPlan";
import TaskCard from "./TaskCard";
import ProgressCard from "~/components/common/ProgressCard";
import StatCard from "~/components/common/StatCard";

const { Title, Text, Paragraph } = Typography;

const UserStageView = () => {
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

export default UserStageView;
