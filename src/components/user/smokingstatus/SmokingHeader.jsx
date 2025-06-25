import { Button, Typography } from "antd";
import { Plus, Cigarette } from "lucide-react";
import ColourfulText from "~/components/ui/colourful-text";

const { Paragraph } = Typography;

export default function SmokingHeader({ onAddClick, hasData = false }) {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4 flex items-center">
          <Cigarette size={32} style={{ color: "#1890ff" }} />
          Smoking <ColourfulText text=" Information" />
        </h2>
        <Paragraph style={{ margin: 0, color: "#666" }}>
          Track and manage your smoking habits
        </Paragraph>
      </div>
      {!hasData && (
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={onAddClick}
          size="large"
        >
          Add Information
        </Button>
      )}
    </div>
  );
}
