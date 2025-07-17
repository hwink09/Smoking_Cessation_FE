import { Typography, Button,  message } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const StageHeader = ({
  currentStage,
  stageTasks,
  progress,
  completedCount,
  loading,
  onRefresh,
  onMoveToNextStage,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-4">
        <Title
          level={3}
          className="text-gray-800"
          ellipsis={{ rows: 2, tooltip: currentStage.title }}
        >
          {currentStage.title}
        </Title>
        <div className="flex gap-2">
          <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
            Làm mới
          </Button>
          <Button
            type="primary"
            icon="🚀"
            onClick={
              progress === 100
                ? onMoveToNextStage
                : () => {
                    message.warning(
                      `Bạn còn ${stageTasks.length - completedCount} nhiệm vụ chưa hoàn thành.`,
                      4
                    );
                  }
            }
            disabled={progress < 100}
            loading={loading}
          >
            Chuyển giai đoạn tiếp theo
          </Button>
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
    </div>
  );
};

export default StageHeader;
