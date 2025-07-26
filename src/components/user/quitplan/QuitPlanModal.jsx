import {
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Avatar,
  Typography,
  Space,
  Alert,
} from "antd";
import { quitPlanValidationRules } from "~/utils/userValidation";
import { useUserSubscription } from "~/hooks/useUserSubscription";
import { Calendar, User, FileText } from "lucide-react";

const { Title, Text, Paragraph } = Typography;

const QuitPlanModal = ({ visible, onCancel, onSubmit, coach }) => {
  const [form] = Form.useForm();
  const { canAccessCoach, subscription } = useUserSubscription();

  const handleFinish = (values) => {
    const formatted = {
      ...values,
      start_date: values.start_date?.format("YYYY-MM-DD"),
      target_quit_date: values.target_quit_date?.format("YYYY-MM-DD"),
    };
    onSubmit(formatted);
    form.resetFields();
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      className="quit-plan-modal"
      title={
        <div className="flex items-center gap-3 py-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
              Tạo kế hoạch cai thuốc
            </h3>
            <p className="text-sm text-gray-500">
              Bắt đầu hành trình cai thuốc cùng chuyên gia
            </p>
          </div>
        </div>
      }
      styles={{
        header: {
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          borderBottom: "1px solid #e2e8f0",
          borderRadius: "16px 16px 0 0",
        },
        body: {
          background: "linear-gradient(to bottom right, #ffffff, #f9fafb)",
          padding: "32px",
        },
      }}
    >
      <Paragraph className="text-gray-600 mb-6 text-center bg-blue-50 p-4 rounded-lg border border-blue-200">
        Vui lòng điền đầy đủ thông tin để tạo kế hoạch cai thuốc phù hợp với bạn
      </Paragraph>

      {/* Cảnh báo về gói thành viên */}
      {!canAccessCoach() && (
        <Alert
          message="Lưu ý về gói thành viên"
          description="Bạn đang sử dụng gói Free. Yêu cầu này sẽ được gửi nhưng cần nâng cấp lên gói Plus hoặc Premium để huấn luyện viên có thể phản hồi và tạo kế hoạch."
          type="warning"
          showIcon
          className="mb-6"
        />
      )}

      {coach && (
        <div className="bg-gray-50 p-6 rounded-lg border mb-8 flex items-center">
          <Avatar
            size={64}
            src={coach.coach_id?.avatar_url}
            className="border-4 shadow-lg"
          />
          <div className="ml-4">
            <Text className="text-sm">Huấn luyện viên đã chọn</Text>
            <Title level={4} className="mb-1">
              {coach.coach_id?.name || "Ẩn danh"}
            </Title>
            <Text className="text-blue-600">
              {coach.specialization || "Chuyên gia cai thuốc"}
            </Text>
          </div>
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
        className="space-y-6"
      >
        <Form.Item
          label={
            <Space className="font-medium text-gray-700">
              <FileText size={16} className="text-blue-500" />
              Tên kế hoạch
            </Space>
          }
          name="name"
          rules={quitPlanValidationRules.planName}
        >
          <Input
            size="large"
            placeholder="Ví dụ: Kế hoạch cai thuốc 30 ngày"
            className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition"
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            label={
              <Space className="font-medium text-gray-700">
                <Calendar size={16} className="text-green-500" />
                Ngày bắt đầu
              </Space>
            }
            name="start_date"
            rules={quitPlanValidationRules.startDate}
          >
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              placeholder="Chọn ngày bắt đầu"
              className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition"
            />
          </Form.Item>

          <Form.Item
            label={
              <Space className="font-medium text-gray-700">
                <Calendar size={16} className="text-red-500" />
                Ngày mục tiêu
              </Space>
            }
            name="target_quit_date"
            rules={quitPlanValidationRules.targetQuitDate}
          >
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              placeholder="Chọn ngày mục tiêu"
              className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition"
            />
          </Form.Item>
        </div>

        <Form.Item
          label={
            <Space className="font-medium text-gray-700">
              <User size={16} className="text-purple-500" />
              Lý do cai thuốc
            </Space>
          }
          name="reason"
          rules={quitPlanValidationRules.reason}
        >
          <Input.TextArea
            rows={4}
            placeholder="Chia sẻ lý do tại sao bạn muốn cai thuốc..."
            className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition"
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item className="mt-8 mb-0">
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              onClick={onCancel}
              size="large"
              className="px-8 py-2 h-12 rounded-lg border-gray-300 hover:border-gray-400 transition"
            >
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="px-8 py-2 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition"
            >
              Gửi yêu cầu
            </Button>
          </div>
        </Form.Item>
      </Form>

      <style>
        {`
        .quit-plan-modal .ant-modal-content {
          border-radius: 16px !important;
          overflow: hidden !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        }
        `}
      </style>
    </Modal>
  );
};

export default QuitPlanModal;
