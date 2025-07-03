import {
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Avatar,
  Typography,
} from "antd";

const { Title, Text } = Typography;

const QuitPlanModal = ({ visible, onCancel, onSubmit, coach }) => {
  const [form] = Form.useForm();

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
      styles={{ body: { padding: 0 } }}
    >
      <div className="bg-blue-500 p-8 text-white text-center">
        <Title level={2} className="mb-2">
          Tạo Kế Hoạch Cai Thuốc
        </Title>
        <Text>Bắt đầu hành trình cai thuốc cùng chuyên gia</Text>
      </div>

      <div className="p-8">
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

        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Tên kế hoạch"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên kế hoạch" }]}
          >
            <Input
              size="large"
              placeholder="Ví dụ: Kế hoạch cai thuốc 30 ngày"
              className="rounded-lg"
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="Ngày bắt đầu"
              name="start_date"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu" },
              ]}
            >
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Chọn ngày bắt đầu"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label="Ngày mục tiêu"
              name="target_quit_date"
              rules={[
                { required: true, message: "Vui lòng chọn ngày mục tiêu" },
              ]}
            >
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Chọn ngày mục tiêu"
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Lý do cai thuốc"
            name="reason"
            rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Chia sẻ lý do tại sao bạn muốn cai thuốc..."
              className="rounded-lg"
            />
          </Form.Item>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              onClick={onCancel}
              size="large"
              className="px-8 py-2 h-12 rounded-lg"
            >
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="px-8 py-2 h-12 rounded-lg bg-blue-500 hover:bg-blue-600 border-0 shadow-lg"
            >
              Gửi yêu cầu
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default QuitPlanModal;
