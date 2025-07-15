import { useCallback, useEffect } from "react";
import { Typography, Alert, Button, message } from "antd";
import { useUserQuitPlan } from "~/hooks/useUserQuitPlan";
import TaskCard from "./TaskCard";
import ProgressCard from "~/components/common/ProgressCard";
import StatCard from "~/components/common/StatCard";
import {
  StageLoadingSkeleton,
  StageErrorCard,
  StageEmptyCard,
  ProgressOverview,
  RefreshButton,
  NextStageButton,
} from "~/components/common/QuitPlanComponents";

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

  // Kiểm tra nếu quit plan đã hoàn thành (tất cả stages đã completed)
  const allStagesCompleted =
    myStages.length > 0 && myStages.every((stage) => stage.is_completed);

  if (!currentStage) {
    if (allStagesCompleted) {
      return (
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6 shadow-2xl">
              <span className="text-4xl text-white">🏆</span>
            </div>
          </div>
          <Title level={2} className="text-green-700 mb-4">
            Chúc mừng! Bạn đã hoàn thành kế hoạch cai thuốc!
          </Title>
          <Text className="text-gray-600 text-lg mb-6">
            Bạn đã hoàn thành tất cả {myStages.length} giai đoạn trong kế hoạch
            cai thuốc. Hãy tiếp tục duy trì lối sống khỏe mạnh!
          </Text>

          {/* Tổng quan các giai đoạn đã hoàn thành */}
          <ProgressOverview myStages={myStages} currentStage={null} />

          <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
            <Text className="text-green-800 font-medium">
              🎉 Kế hoạch cai thuốc đã hoàn thành thành công!
            </Text>
          </div>
        </div>
      );
    } else {
      return (
        <StageEmptyCard
          title="Chưa có giai đoạn nào được thiết lập"
          desc="Huấn luyện viên sẽ sớm thiết lập lộ trình cai thuốc."
        />
      );
    }
  }

  return (
    <div>
      {/* Tổng quan các giai đoạn */}
      <ProgressOverview myStages={myStages} currentStage={currentStage} />

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
            <RefreshButton onRefresh={handleRefresh} loading={loading} />
            <NextStageButton
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
              disabled={progress < 100}
              loading={loading}
              progress={progress}
            />
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
              description="Huấn luyện viên sẽ sớm thêm nhiệm vụ cho giai đoạn này."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStageView;
