import { Card, Steps, Typography } from "antd";
import {
  CheckCircleFilled,
  ClockCircleFilled,
} from "@ant-design/icons";

const { Title } = Typography;

const StageOverview = ({ myStages, currentStage }) => {
  if (!myStages?.length) return null;

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <Title level={4} className="mb-4 text-gray-800">
        📋 Tổng quan hành trình cai thuốc
      </Title>
      <Steps
        current={myStages.findIndex((s) => s._id === currentStage?._id)}
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
  );
};

export default StageOverview;
