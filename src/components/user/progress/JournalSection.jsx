import React, { useState } from "react";
import {
  Form,
  InputNumber,
  Rate,
  Select,
  Button,
  DatePicker,
  List,
  Card,
  Input,
  message,
  Empty,
  Badge,
  Divider,
} from "antd";
import dayjs from "dayjs";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  EditOutlined,
  SaveOutlined,
  SmileOutlined,
  HeartOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Clock, Cigarette, PenLine } from "lucide-react";

const { TextArea } = Input;

function JournalSection({ entries, onSubmit, isLoading }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [showCigarettesField, setShowCigarettesField] = useState(false);

  const initialValues = {
    date: dayjs(),
    smoked: false,
    cigarettes: 0,
    mood: 5,
    health: 5,
    symptoms: "",
  };

  const handleFinish = async (values) => {
    setSubmitting(true);
    const entry = {
      ...values,
      date: values.date.format("YYYY-MM-DD"),
      cigarettes: values.smoked ? values.cigarettes : 0,
      id: Date.now().toString(),
    };

    try {
      await onSubmit(entry);
      form.resetFields();
      message.success("Đã lưu nhật ký thành công");
      setShowCigarettesField(false);
    } catch (error) {
      message.error("Không thể lưu nhật ký");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const disabledDate = (current) => current && current > dayjs().endOf("day");

  const handleSmokedChange = (value) => {
    setShowCigarettesField(value);
    if (!value) {
      form.setFieldValue("cigarettes", 0);
    }
  };
  return (
    <>
      {" "}
      <div className="bg-gradient-to-b from-white to-purple-50 shadow-md border border-blue-200 p-8 rounded-xl mb-10">
        <div className="flex items-center mb-6 border-b border-purple-200 pb-4">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <PenLine className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
            Nhật Ký Hàng Ngày
          </h2>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={initialValues}
          className="mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Form.Item
              name="date"
              label="Ngày"
              rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
            >
              {" "}
              <DatePicker
                className="w-full text-lg"
                disabledDate={disabledDate}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày"
                suffixIcon={<CalendarOutlined className="text-purple-500" />}
                style={{ height: "44px" }}
              />
            </Form.Item>

            <Form.Item
              name="smoked"
              label="Hôm nay bạn có hút thuốc không?"
              rules={[
                { required: true, message: "Vui lòng chọn một tùy chọn" },
              ]}
            >
              <Select
                onChange={handleSmokedChange}
                className="text-lg"
                placeholder="Chọn câu trả lời"
                style={{ height: "44px" }}
              >
                <Select.Option value={false}>
                  <div className="flex items-center">
                    <CheckCircleOutlined className="text-green-500 mr-2" />
                    <span>Không</span>
                  </div>
                </Select.Option>
                <Select.Option value={true}>
                  <div className="flex items-center">
                    <CloseCircleOutlined className="text-red-500 mr-2" />
                    <span>Có</span>
                  </div>
                </Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item noStyle shouldUpdate>
            {" "}
            {({ getFieldValue }) =>
              getFieldValue("smoked") && (
                <Form.Item
                  name="cigarettes"
                  label="Số điếu thuốc đã hút"
                  rules={[
                    {
                      required: true,
                      type: "number",
                      min: 1,
                      message: "Vui lòng nhập số lượng điếu thuốc",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    className="w-full"
                    placeholder="Nhập số điếu"
                    style={{ height: "44px" }}
                    addonBefore={
                      <div className="bg-red-50 py-1 px-2 flex items-center">
                        <Cigarette className="w-5 h-5 text-red-500" />
                      </div>
                    }
                  />
                </Form.Item>
              )
            }
          </Form.Item>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
            <Form.Item
              name="mood"
              label={
                <div className="flex items-center">
                  <SmileOutlined className="mr-2 text-yellow-500" />
                  <span>Tâm trạng (1-10)</span>
                </div>
              }
              rules={[
                { required: true, message: "Vui lòng đánh giá tâm trạng" },
              ]}
            >
              <Rate count={10} className="text-yellow-500" />
            </Form.Item>

            <Form.Item
              name="health"
              label={
                <div className="flex items-center">
                  <HeartOutlined className="mr-2 text-red-500" />
                  <span>Sức khỏe (1-10)</span>
                </div>
              }
              rules={[
                { required: true, message: "Vui lòng đánh giá sức khỏe" },
              ]}
            >
              <Rate count={10} className="text-red-500" />
            </Form.Item>
          </div>
          <Form.Item
            name="symptoms"
            label={
              <div className="flex items-center">
                <MessageOutlined className="mr-2 text-blue-500" />
                <span>Triệu chứng / Ghi chú</span>
              </div>
            }
          >
            <TextArea
              rows={3}
              placeholder="VD: căng thẳng, đau đầu, v.v."
              className="text-base"
            />
          </Form.Item>{" "}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-none shadow-md hover:shadow-lg"
              loading={submitting || isLoading}
              size="large"
              icon={<SaveOutlined />}
            >
              Lưu Nhật Ký
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="bg-gradient-to-b from-white to-green-50 shadow-md border border-green-200 p-8 rounded-xl">
        <div className="flex items-center mb-6 border-b border-green-200 pb-4">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-green-800">
            Nhật Ký Trước Đây
          </h3>
        </div>{" "}
        {entries.length === 0 ? (
          <Empty
            description={
              <span className="text-lg text-gray-500">
                Chưa có bản ghi nhật ký
              </span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="my-10 bg-white p-8 rounded-lg border border-gray-200 shadow-sm"
          />
        ) : (
          <List
            dataSource={entries}
            grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
            pagination={{
              pageSize: 6,
              hideOnSinglePage: true,
              className: "mt-6",
            }}
            renderItem={(item) => (
              <List.Item>
                <Card
                  title={
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-gray-800 font-medium">
                        <CalendarOutlined className="mr-2 text-blue-500" />
                        {dayjs(item.date).format("DD/MM/YYYY")}
                      </span>
                      {item.smoked ? (
                        <Badge.Ribbon text="Đã hút" color="red">
                          <div className="w-6"></div>
                        </Badge.Ribbon>
                      ) : (
                        <Badge.Ribbon text="Không hút" color="green">
                          <div className="w-6"></div>
                        </Badge.Ribbon>
                      )}
                    </div>
                  }
                  className="bg-white border border-gray-200 text-gray-800 w-full mb-4 hover:shadow-lg transition-all rounded-lg overflow-hidden transform hover:-translate-y-1 hover:border-blue-300"
                  styles={{
                    header: {
                      borderBottom: "1px solid #e6e6e6",
                      padding: "12px 16px",
                      backgroundColor: item.smoked ? "#FFF5F5" : "#F0FFF4",
                    },
                  }}
                >
                  {" "}
                  <div className="p-2">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div
                        className={`p-3 rounded-lg ${
                          item.smoked
                            ? "bg-red-50 border border-red-200"
                            : "bg-green-50 border border-green-200"
                        }`}
                      >
                        <p className="text-xs text-gray-500 uppercase mb-1 font-medium">
                          Trạng thái
                        </p>
                        <p
                          className={`font-semibold text-base ${
                            item.smoked ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {item.smoked ? "Đã hút thuốc" : "Không hút thuốc"}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                        <p className="text-xs text-gray-500 uppercase mb-1 font-medium">
                          Tâm trạng
                        </p>
                        <div className="flex items-center">
                          <span className="font-semibold text-base text-yellow-600 mr-1">
                            {item.mood}
                          </span>
                          <span className="text-yellow-500 text-xs">/10</span>
                          <Rate
                            count={1}
                            value={1}
                            disabled
                            className="ml-1 text-yellow-500 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {item.smoked && (
                        <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                          <p className="text-xs text-gray-500 uppercase mb-1 font-medium">
                            Số điếu
                          </p>
                          <p className="font-semibold text-base text-orange-600">
                            {item.cigarettes}{" "}
                            <span className="text-xs">điếu</span>
                          </p>
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-lg bg-blue-50 border border-blue-200 ${
                          !item.smoked ? "col-span-2" : ""
                        }`}
                      >
                        <p className="text-xs text-gray-500 uppercase mb-1 font-medium">
                          Sức khỏe
                        </p>
                        <div className="flex items-center">
                          <span className="font-semibold text-base text-blue-600 mr-1">
                            {item.health}
                          </span>
                          <span className="text-blue-500 text-xs">/10</span>
                          <HeartOutlined className="ml-1 text-red-500" />
                        </div>
                      </div>
                    </div>

                    {item.symptoms && (
                      <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
                        <p className="text-xs text-gray-500 uppercase mb-1 font-medium">
                          Ghi chú
                        </p>
                        <p className="text-sm text-gray-700">{item.symptoms}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
    </>
  );
}

export default JournalSection;
