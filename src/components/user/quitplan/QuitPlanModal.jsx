import { Modal, Form, Input, DatePicker, Button, Space } from 'antd';

const QuitPlanModal = ({ visible, onCancel, onSubmit, coach }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log("Form values gửi lên:", values);
    const formatted = {
      ...values,
      start_date: values.start_date ? values.start_date.format('YYYY-MM-DD') : undefined,
      target_quit_date: values.target_quit_date ? values.target_quit_date.format('YYYY-MM-DD') : undefined,
    };
    console.log("Formatted gửi đi:", formatted);
    onSubmit(formatted);
    form.resetFields();
  };

  return (
    <Modal
      title="Yêu cầu kế hoạch mới"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      {coach && (
        <div style={{ marginBottom: 16 }}>
          <strong>Huấn luyện viên đã chọn:</strong>{' '}
          <span style={{ color: '#1890ff' }}>{coach.coach_id?.name || 'Ẩn danh'}</span>
        </div>
      )}

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Tên kế hoạch"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên kế hoạch' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Ngày bắt đầu"
          name="start_date"
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Ngày kết thúc"
          name="target_quit_date"
          rules={[{ required: true, message: 'Vui lòng chọn ngày mục tiêu' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Lý do"
          name="reason"
          rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Gửi yêu cầu
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuitPlanModal;
