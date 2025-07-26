import {
  Modal,
  DatePicker,
  TimePicker,
  Input,
  message,
  Typography,
  Space,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import meetSessionService from "~/services/meetSessionService";
import { Calendar, Clock, MessageCircle, Save } from "lucide-react";

const { TextArea } = Input;
const { Paragraph } = Typography;

const BookSessionModal = ({ open, onClose, coach }) => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleBook = async () => {
    if (!coach || !date || !time) {
      message.error("Vui lòng chọn đầy đủ thông tin!");
      return;
    }

    const payload = {
      coach_id: coach?.coach_id?._id,
      schedule_at: `${date.format("YYYY-MM-DD")}T${time.format("HH:mm")}`,
      purpose: note,
    };

    try {
      setSubmitting(true);
      await meetSessionService.bookSession(payload);
      message.success("Đặt lịch thành công!");
      setDate(null);
      setTime(null);
      setNote("");
      onClose();
    } catch {
      message.error("Đặt lịch thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleBook}
      confirmLoading={submitting}
      okText={
        <Space>
          <Save size={16} />
          Đặt lịch
        </Space>
      }
      width={600}
      className="booking-modal"
      title={
        <div className="flex items-center space-x-3 py-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
              Đặt lịch tư vấn
            </h3>
            <p className="text-sm text-gray-500">
              Đặt lịch với {coach?.coach_id?.name || "Huấn luyện viên"}
            </p>
          </div>
        </div>
      }
      okButtonProps={{
        className:
          "bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg h-10",
      }}
    >
      <Paragraph className="text-gray-600 mb-6 text-center bg-blue-50 p-4 rounded-lg border border-blue-200">
        Vui lòng chọn thời gian phù hợp để đặt lịch tư vấn với huấn luyện viên
      </Paragraph>

      <div className="space-y-6">
        {/* Ngày */}
        <div>
          <label className="flex items-center space-x-2 font-medium text-gray-700 mb-3">
            <Calendar size={16} className="text-blue-500" />
            <span>Chọn ngày</span>
          </label>
          <DatePicker
            className="w-full h-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:shadow-md hover:border-blue-400 transition-all"
            placeholder="Chọn ngày"
            value={date}
            onChange={setDate}
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
            size="large"
          />
        </div>

        {/* Giờ */}
        <div>
          <label className="flex items-center space-x-2 font-medium text-gray-700 mb-3">
            <Clock size={16} className="text-green-500" />
            <span>Chọn giờ</span>
          </label>
          <TimePicker
            className="w-full h-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:shadow-md hover:border-blue-400 transition-all"
            placeholder="Chọn giờ"
            value={time}
            onChange={setTime}
            format="HH:mm"
            minuteStep={15}
            size="large"
          />
        </div>

        {/* Ghi chú */}
        <div>
          <label className="flex items-center space-x-2 font-medium text-gray-700 mb-3">
            <MessageCircle size={16} className="text-purple-500" />
            <span>Ghi chú (tuỳ chọn)</span>
          </label>
          <TextArea
            rows={4}
            placeholder="Nhập mục đích hoặc nội dung cần tư vấn..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="rounded-lg border border-gray-300 focus:border-blue-500 focus:shadow-md hover:border-blue-400 transition-all"
          />
        </div>
      </div>

      <style>
        {`
        .booking-modal .ant-modal-content {
          border-radius: 16px !important;
          overflow: hidden !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        }

        .booking-modal .ant-modal-header {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
          border-bottom: 1px solid #e2e8f0 !important;
          border-radius: 16px 16px 0 0 !important;
          padding: 20px 24px !important;
        }

        .booking-modal .ant-modal-body {
          background: linear-gradient(to bottom right, #ffffff, #f9fafb) !important;
          padding: 32px !important;
        }

        .booking-modal .ant-modal-footer {
          border-top: 1px solid #e2e8f0 !important;
          background: #f8fafc !important;
          padding: 16px 24px !important;
        }
        `}
      </style>
    </Modal>
  );
};

export default BookSessionModal;
