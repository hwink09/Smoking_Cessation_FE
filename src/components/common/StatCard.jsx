import { Typography } from "antd";

const { Text } = Typography;

const StatCard = ({ label, value, color }) => (
  <div
    className={`bg-${color}-50 p-4 rounded-lg border border-${color}-100 flex justify-between items-center`}>
    <Text strong className={`text-${color}-800 text-sm`}>
      {label}
    </Text>
    <Text className={`text-2xl font-bold text-${color}-700`}>{value}</Text>
  </div>
);

export default StatCard;
