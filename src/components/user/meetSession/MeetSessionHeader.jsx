import { Button } from "antd";
import { Plus, Calendar } from "lucide-react";

export default function MeetSessionHeader({ onAddClick, hasData = false }) {
  const AddButton = ({ label = "Đặt lịch tư vấn", size = "large" }) => (
    <Button
      type="primary"
      icon={<Plus size={16} />}
      onClick={onAddClick}
      size={size}
      className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg px-6 h-12 font-semibold"
    >
      {label}
    </Button>
  );

  if (!hasData) {
    return (
      <div className="text-center">
        <AddButton />
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calendar size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-1">
            Lịch tư vấn
          </h3>
          <p className="text-sm text-gray-500 m-0">
            Quản lý các buổi tư vấn với huấn luyện viên
          </p>
        </div>
      </div>

      <AddButton label="Đặt lịch mới" size="middle" />
    </div>
  );
}
