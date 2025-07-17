import { Form, InputNumber, Button, Alert, Input, Card } from "antd";
import { PlusOutlined, BookOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
const { TextArea } = Input;

const JournalForm = ({
  form,
  handleSubmit,
  submitting,
  selectedDate,
  setSelectedDate,
  smokingStatus,
  existingEntryForDate,
}) => {
  return (
    <Card
      title={
        <div className="flex items-center">
          <BookOutlined className="text-2xl text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
            Nhật Ký Hàng Ngày
          </h2>
        </div>
      }
      className="bg-gradient-to-br from-white to-purple-50 border border-purple-200 shadow-md rounded-xl"
    >
      {existingEntryForDate && (
        <Alert
          message={`Sửa nhật ký ngày ${dayjs(selectedDate).format(
            "DD/MM/YYYY"
          )}`}
          description={`Đã có nhật ký cho ngày này (${
            existingEntryForDate.cigarettes_smoked || 0
          } điếu). Bạn đang chỉnh sửa nhật ký hiện có.`}
          type="warning"
          showIcon
          className="mb-6"
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item label="Ngày">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={dayjs().format("YYYY-MM-DD")}
              className="w-full px-3 py-2 border border-purple-200 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="cigarettes"
            label="Số điếu thuốc đã hút"
            rules={[
              { required: true, message: "Vui lòng nhập số điếu thuốc" },
              {
                type: "number",
                min: 0,
                max: smokingStatus?.cigarettesPerDay || 100,
                message: `Tối đa ${
                  smokingStatus?.cigarettesPerDay || 100
                } điếu`,
              },
            ]}
            initialValue={0}
          >
            <InputNumber
              min={0}
              max={smokingStatus?.cigarettesPerDay || 100}
              placeholder="Ví dụ: 5"
              className="w-full"
            />
          </Form.Item>
        </div>

        <Form.Item name="symptoms" label="Triệu chứng sức khỏe">
          <TextArea
            rows={4}
            placeholder="Mô tả cảm giác, triệu chứng..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            icon={<PlusOutlined />}
            size="large"
            className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-blue-600"
          >
            {existingEntryForDate ? "Cập nhật nhật ký" : "Ghi nhật ký"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default JournalForm;
