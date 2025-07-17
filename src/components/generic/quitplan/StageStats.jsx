import { Typography, Progress } from "antd";

const { Text } = Typography;

const StatCard = ({ label, value, color }) => (
  <div className={`bg-${color}-50 p-4 rounded-lg border border-${color}-100`}>
    <Text strong className={`text-${color}-800 text-sm`}>{label}</Text>
    <Text className={`text-2xl font-bold text-${color}-700`}>{value}</Text>
  </div>
);

const ProgressCard = ({ percent, completed, total }) => (
  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
    <div className="flex flex-col">
      <div className="flex justify-between mb-2">
        <Text strong className="text-green-800 text-sm">Tiến độ hoàn thành</Text>
        <Text className="text-2xl font-bold text-green-700">{percent}%</Text>
      </div>
      <Progress percent={percent} size="small" showInfo={false} />
      <Text type="secondary" className="text-xs">
        {completed}/{total} nhiệm vụ
      </Text>
    </div>
  </div>
);

const StageStats = ({ currentStage, myStages, progress, completedCount, totalTasks }) => (
  <div className="grid md:grid-cols-3 gap-4 mb-6">
    <StatCard
      label="Giai đoạn hiện tại"
      value={`${currentStage.stage_number || 1}/${myStages.length}`}
      color="blue"
    />
    <ProgressCard percent={progress} completed={completedCount} total={totalTasks} />
    <StatCard
      label="Trạng thái"
      value={progress === 100 ? "Hoàn thành" : "Đang thực hiện"}
      color={progress === 100 ? "green" : "orange"}
    />
  </div>
);

export default StageStats;
