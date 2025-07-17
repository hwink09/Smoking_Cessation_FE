import { Button, Typography, Checkbox } from "antd";

const { Title, Paragraph, Text } = Typography;

const TaskCard = ({ task, index, onComplete }) => {
  const isLocked = false; 

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

export default TaskCard;
