import { useEffect } from "react"
import { Modal, Form, Input, InputNumber, Select, Button, Space, Typography, DatePicker } from "antd"
import { Plus, Cigarette, DollarSign, Calendar, BarChart3 } from "lucide-react"
import dayjs from "dayjs"

const { Paragraph } = Typography
const { Option } = Select

export default function SmokingModal({ visible, editingRecord, onSubmit, onCancel }) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible && editingRecord) {
      form.setFieldsValue({
        frequency: editingRecord.frequency,
        cigarettes_per_day: editingRecord.cigarettes_per_day,
        cost_per_pack: editingRecord.cost_per_pack,
        start_date: dayjs(editingRecord.start_date),
      })
    } else if (visible) {
      form.resetFields()
    }
  }, [visible, editingRecord, form])

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  const handleSubmit = (values) => {
    onSubmit(values)
    form.resetFields()
  }

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
      <Paragraph style={{ color: "#666", marginBottom: "24px" }}>
        Vui lòng điền đầy đủ thông tin về thói quen hút thuốc của bạn
      </Paragraph>

      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item
          label={
            <Space>
              <BarChart3 size={14} />
              Tần suất hút thuốc
            </Space>
          }
          name="frequency"
          rules={[{ required: true, message: "Vui lòng chọn tần suất hút thuốc!" }]}
        >
          <Select placeholder="Chọn tần suất" size="large">
            <Option value="daily">
              <Space>
                <div style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: "#f5222d" 
                }}></div>
                Hàng ngày
              </Space>
            </Option>
            <Option value="weekly">
              <Space>
                <div style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: "#fa8c16" 
                }}></div>
                Hàng tuần
              </Space>
            </Option>
            <Option value="occasionally">
              <Space>
                <div style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: "#fadb14" 
                }}></div>
                Thỉnh thoảng
              </Space>
            </Option>
            <Option value="social">
              <Space>
                <div style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: "#52c41a" 
                }}></div>
                Chỉ khi giao tiếp
              </Space>
            </Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={
            <Space>
              <Cigarette size={14} />
              Số điếu/ngày
            </Space>
          }
          name="cigarettes_per_day"
          rules={[
            { required: true, message: "Vui lòng nhập số điếu mỗi ngày!" },
            { type: "number", min: 1, message: "Phải lớn hơn hoặc bằng 1!" },
          ]}
        >
          <InputNumber
            placeholder="VD: 10"
            size="large"
            min={1}
            style={{ width: "100%" }}
            prefix={<Cigarette size={14} style={{ color: "#d9d9d9" }} />}
          />
        </Form.Item>

        <Form.Item
          label={
            <Space>
              <DollarSign size={14} />
              Giá/vỉ (VNĐ)
            </Space>
          }
          name="cost_per_pack"
          rules={[
            { required: true, message: "Vui lòng nhập giá mỗi vỉ!" },
            { type: "number", min: 0, message: "Phải là số dương!" },
          ]}
        >
          <InputNumber
            placeholder="VD: 25000"
            size="large"
            min={0}
            step={1000}
            style={{ width: "100%" }}
            prefix={<DollarSign size={14} style={{ color: "#d9d9d9" }} />}
          />
        </Form.Item>

        <Form.Item
          label={
            <Space>
              <Calendar size={14} />
              Ngày bắt đầu
            </Space>
          }
          name="start_date"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            size="large"
            format="YYYY-MM-DD"
            placeholder="Chọn ngày bắt đầu"
            suffixIcon={<Calendar size={14} style={{ color: "#d9d9d9" }} />}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit" icon={<Plus size={14} />}>
              {editingRecord ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}