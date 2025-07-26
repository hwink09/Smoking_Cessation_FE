import { Typography, Button, Checkbox, Tooltip } from "antd";

const { Title, Paragraph, Text } = Typography;

const TaskCard = ({ task, index, onComplete, currentStage, stageTasks }) => {
  const isLastTask = stageTasks && index === stageTasks.length - 1;

  const isEndDateReached = () => {
    if (!currentStage?.end_date || !isLastTask) return true;
    const today = new Date();
    const endDate = new Date(currentStage.end_date);
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    return today >= endDate;
  };

  const canCompleteTask =
    !task.is_completed && (!isLastTask || isEndDateReached());
  const isLocked = !canCompleteTask;

  const containerClass = [
    "group relative overflow-hidden rounded-lg border transition-all duration-300 mb-3",
    task.is_completed
      ? "bg-green-50 border-green-200"
      : isLocked && isLastTask
      ? "bg-orange-50 border-orange-200"
      : isLocked
      ? "bg-gray-50 border-gray-200 opacity-60"
      : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg",
  ].join(" ");

  const iconClass = [
    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
    task.is_completed
      ? "bg-green-500 text-white"
      : isLocked && isLastTask
      ? "bg-orange-500 text-white"
      : isLocked
      ? "bg-gray-400 text-white"
      : "bg-blue-500 text-white",
  ].join(" ");

  const titleClass = [
    "mb-1",
    task.is_completed
      ? "line-through text-gray-500"
      : isLocked && isLastTask
      ? "text-orange-600"
      : isLocked
      ? "text-gray-400"
      : "text-gray-800",
  ].join(" ");

  const descClass = [
    "mb-2",
    task.is_completed || isLocked ? "text-gray-400" : "text-gray-600",
  ].join(" ");

  return (
    <div className={containerClass}>
      <div className="p-4 flex items-start gap-3">
        <div className="flex items-center gap-2">
          <div className={iconClass}>
            {task.is_completed
              ? "✓"
              : isLocked && isLastTask
              ? "🔒"
              : isLocked
              ? "⏸"
              : index + 1}
          </div>
          <Checkbox checked={task.is_completed} disabled size="small" />
        </div>

        <div className="flex-1 min-w-0">
          <Title
            level={5}
            className={titleClass}
            ellipsis={{ rows: 2, tooltip: task.title }}
            style={{ fontSize: "14px" }}
          >
            {isLastTask && !task.is_completed && !isEndDateReached() && "🔒 "}
            {task.title}
          </Title>

          <Paragraph className={descClass} ellipsis={{ rows: 2 }}>
            {task.description}
          </Paragraph>

          {(task.deadline || (isLastTask && currentStage?.end_date)) && (
            <Text className="text-xs text-gray-500">
              Hạn:{" "}
              {isLastTask && currentStage?.end_date
                ? new Date(currentStage.end_date).toLocaleDateString("vi-VN")
                : task.deadline
                ? new Date(task.deadline).toLocaleDateString("vi-VN")
                : "Chưa có"}
              {isLastTask && currentStage?.end_date && (
                <span className="text-orange-600 ml-1">
                  (Ngày kết thúc giai đoạn)
                </span>
              )}
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

        {!task.is_completed && isLocked && isLastTask && (
          <Tooltip
            title={`Nhiệm vụ này chỉ có thể hoàn thành vào ngày ${new Date(
              currentStage.end_date
            ).toLocaleDateString("vi-VN")}`}
          >
            <Button
              size="small"
              disabled
              className="ml-2 bg-gray-400 border-0 text-white text-xs cursor-not-allowed"
            >
              Chờ đến hạn
            </Button>
          </Tooltip>
        )}

        {task.is_completed && (
          <div className="ml-2 text-green-500 text-xl">✅</div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
