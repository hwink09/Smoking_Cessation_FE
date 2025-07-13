import { Typography, Progress } from "antd";

const { Text } = Typography;

const ProgressCard = ({
  percent,
  completed,
  total,
  title = "Tiến độ hoàn thành",
}) => (
  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
    <div className="flex flex-col">
      <div className="flex justify-between mb-2">
        <Text strong className="text-green-800 text-sm">
          {title}
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

export default ProgressCard;
