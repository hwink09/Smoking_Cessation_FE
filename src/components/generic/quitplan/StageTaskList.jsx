import { Typography, Alert } from "antd";
import TaskCard from "./TaskCard";
import { StageEmptyCard } from "./StateFallbacks";

const { Title } = Typography;

const StageTaskList = ({ tasks, progress, onComplete, currentStage }) => {
  return (
    <div>
      <Title level={4} className="mb-4 text-gray-800">
        Nhiệm vụ cần hoàn thành
      </Title>

      {progress === 100 && tasks.length > 0 && (
        <Alert
          message="🎉 Chúc mừng! Bạn đã hoàn thành tất cả nhiệm vụ!"
          type="success"
          showIcon
          className="mb-4"
        />
      )}

      <div className="max-h-80 overflow-y-auto">
        {tasks.length > 0 ? (
          tasks.map((task, i) => (
            <TaskCard
              key={task._id}
              task={task}
              index={i}
              onComplete={onComplete}
              currentStage={currentStage}
              stageTasks={tasks}
            />
          ))
        ) : (
          <StageEmptyCard
            title="Chưa có nhiệm vụ nào"
            desc="Huấn luyện viên sẽ sớm thêm nhiệm vụ."
          />
        )}
      </div>
    </div>
  );
};

export default StageTaskList;
