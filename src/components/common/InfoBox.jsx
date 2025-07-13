import { Typography } from "antd";

const { Text } = Typography;

const InfoBox = ({ label, value, color }) => (
  <div
    className={`bg-${color}-50 p-3 rounded-lg border border-${color}-100 flex justify-between items-center`}
  >
    <Text className={`text-${color}-800 text-sm`}>{label}</Text>
    <Text className={`text-${color}-600 font-bold`}>{value}</Text>
  </div>
);

export default InfoBox;
