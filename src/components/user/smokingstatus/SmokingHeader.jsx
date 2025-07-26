import { Button } from "antd";
import { Plus } from "lucide-react";

export default function SmokingHeader({ onAddClick, hasData = false }) {
  if (!hasData) {
    return (
      <div className="text-center">
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={onAddClick}
          size="large"
          className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg px-8 py-2 h-12"
        >
          Thêm thông tin hút thuốc
        </Button>
      </div>
    );
  }

  return null;
}
