import { useEffect } from "react";
import {
  Modal,
  Form,
  InputNumber,
  Button,
  Space,
  Typography,
  Input,
} from "antd";
import { Plus, Cigarette, DollarSign } from "lucide-react";

const { Paragraph } = Typography;
const iconColor = "#d9d9d9";

export default function SmokingModal({
  visible,
  editingRecord,
  onSubmit,
  onCancel,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && editingRecord) {
      form.setFieldsValue({
        cigarettes_per_day: editingRecord.cigarettes_per_day,
        cost_per_pack: editingRecord.cost_per_pack,
        frequency: editingRecord.frequency || "daily",
      });
    } else if (visible) {
      form.resetFields();
      // Set default values when opening modal for new record
      form.setFieldsValue({
        frequency: "daily",
      });
    }
  }, [visible, editingRecord, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title={
        <Space>
          <Cigarette size={20} style={{ color: "#1890ff" }} />
          {editingRecord ? "Cập nhật thông tin" : "Thêm thông tin hút thuốc"}
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
    >
      <Paragraph style={{ color: "#666", marginBottom: 24 }}>
        Vui lòng điền đầy đủ thông tin về thói quen hút thuốc của bạn
      </Paragraph>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item
          label={
            <Space>
              <Cigarette size={14} />
              Số điếu trung bình / ngày
            </Space>
          }
          name="cigarettes_per_day"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số điếu trung bình mỗi ngày!",
            },
            {
              type: "number",
              min: 1,
              max: 1000,
              message: "Từ 1 đến 1000 điếu mỗi ngày!",
            },
          ]}
        >
          <InputNumber
            placeholder="VD: 10"
            size="large"
            min={1}
            max={1000}
            style={{ width: "100%" }}
            prefix={<Cigarette size={14} style={{ color: iconColor }} />}
          />
        </Form.Item>

        <Form.Item
          label={
            <Space>
              <DollarSign size={14} />
              Giá tiền / bao thuốc (20 điếu / bao)
            </Space>
          }
          name="cost_per_pack"
          rules={[
            { required: true, message: "Vui lòng nhập giá mỗi bao!" },
            {
              type: "number",
              min: 0,
              max: 100000,
              message: "Giá tối đa 100,000 VND!",
            },
          ]}
        >
          <InputNumber
            placeholder="VD: 25000"
            size="large"
            min={0}
            max={100000}
            step={1000}
            style={{ width: "100%" }}
            prefix={<DollarSign size={14} style={{ color: iconColor }} />}
          />
        </Form.Item>

        <Form.Item
          name="frequency"
          initialValue="daily"
          style={{ display: "none" }}
        >
          <Input />
        </Form.Item>

        <Form.Item style={{ marginTop: 24 }}>
          <Space style={{ justifyContent: "flex-end", width: "100%" }}>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit" icon={<Plus size={14} />}>
              {editingRecord ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
