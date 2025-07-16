import { Row } from "antd";
import { Calendar, DollarSign, Activity } from "lucide-react";
import { StatCard } from "./StatCard";

export function StatsSection({ stats }) {
  const formatMoney = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    return amount.toLocaleString("vi-VN");
  };

  return (
    <Row gutter={[8, 8]} style={{ marginBottom: "16px" }}>
      <StatCard
        icon={Calendar}
        value={stats.daysQuit}
        label="Ngày cai thuốc"
        color="#1890ff"
        backgroundColor="#e6f7ff"
        borderColor="#91d5ff"
      />
      <StatCard
        icon={DollarSign}
        value={formatMoney(stats.moneySaved)}
        label="Tiền tiết kiệm"
        color="#52c41a"
        backgroundColor="#f6ffed"
        borderColor="#b7eb8f"
      />
      <StatCard
        icon={Activity}
        value={`${stats.healthScore}%`}
        label="Sức khỏe"
        color="#f5222d"
        backgroundColor="#fff2f0"
        borderColor="#ffadd2"
      />
    </Row>
  );
}
