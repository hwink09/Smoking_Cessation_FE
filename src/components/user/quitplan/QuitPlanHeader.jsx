import { Typography } from "antd";
import ColourfulText from "~/components/ui/colourful-text";

const { Text } = Typography;

export default function QuitPlanHeader() {
  return (
    <div className="text-center mb-8 p-8 rounded-2xl border border-blue-200 bg-gradient-to-br from-purple-50 via-white to-blue-50 shadow-sm">
      <div className="relative mb-10">
        {/* Decorative line above heading */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-gradient-to-r from-purple-400 to-blue-500" />

        {/* Main heading */}
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4 inline-block border-b-2 border-blue-200 pb-2">
          Kế hoạch <ColourfulText text="cai thuốc" />
        </h1>

        {/* Subheading */}
        <Text className="block text-lg text-gray-600 max-w-2xl mx-auto">
          Chọn huấn luyện viên phù hợp để bắt đầu hành trình cai thuốc của bạn!
        </Text>
      </div>
    </div>
  );
}
