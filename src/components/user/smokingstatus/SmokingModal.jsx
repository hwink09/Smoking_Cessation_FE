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
import { Plus, Cigarette, DollarSign, Save } from "lucide-react";

const { Paragraph } = Typography;

export default function SmokingModal({
  visible,
  editingRecord,
  onSubmit,
  onCancel,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(
        editingRecord
          ? {
              cigarettes_per_day: editingRecord.cigarettes_per_day,
              cost_per_pack: editingRecord.cost_per_pack,
              frequency: editingRecord.frequency || "daily",
            }
          : { frequency: "daily" }
      );
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
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      className="smoking-modal"
      title={
        <div className="flex items-center gap-3 py-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Cigarette size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-1">
              {editingRecord
                ? "Cập nhật thông tin"
                : "Thêm thông tin hút thuốc"}
            </h3>
            <p className="text-sm text-gray-500">
              Điền thông tin chi tiết về thói quen hút thuốc
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
        Vui lòng điền đầy đủ thông tin về thói quen hút thuốc của bạn để có kế
        hoạch bỏ thuốc phù hợp
      </Paragraph>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        className="space-y-6"
      >
        <Form.Item
          label={
            <Space className="font-medium text-gray-700">
              <Cigarette size={16} className="text-orange-500" />
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
            className="w-full rounded-lg border border-gray-300 hover:border-blue-400 focus:border-blue-500 transition"
            prefix={<Cigarette size={14} className="text-gray-400" />}
          />
        </Form.Item>

        <Form.Item
          label={
            <Space className="font-medium text-gray-700">
              <DollarSign size={16} className="text-green-500" />
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
            className="w-full rounded-lg border border-gray-300 hover:border-blue-400 focus:border-blue-500 transition"
            prefix={<DollarSign size={14} className="text-gray-400" />}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item
          name="frequency"
          initialValue="daily"
          style={{ display: "none" }}
        >
          <Input />
        </Form.Item>

        <Form.Item className="mt-8 mb-0">
          <div className="flex justify-end gap-3">
            <Button
              onClick={handleCancel}
              size="large"
              className="h-12 px-6 rounded-lg border border-gray-300 hover:border-gray-400 transition"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={editingRecord ? <Save size={16} /> : <Plus size={16} />}
              size="large"
              className="h-12 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition"
            >
              {editingRecord ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form.Item>
      </Form>

      <style>
        {`
          .smoking-modal .ant-modal-content {
            border-radius: 16px !important;
            overflow: hidden !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          }

          .smoking-modal .ant-form-item-label > label {
            font-weight: 600 !important;
            color: #374151 !important;
          }

          .smoking-modal .ant-input-number {
            border-radius: 8px !important;
          }

          .smoking-modal .ant-input-number:hover {
            border-color: #3b82f6 !important;
          }

          .smoking-modal .ant-input-number:focus,
          .smoking-modal .ant-input-number-focused {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
          }
        `}
      </style>
    </Modal>
  );
}
