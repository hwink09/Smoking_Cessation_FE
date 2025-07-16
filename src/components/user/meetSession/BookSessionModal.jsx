import { Modal, DatePicker, TimePicker, Input, message } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import meetSessionService from "~/services/meetSessionService";

const { TextArea } = Input;

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
      // Reset & đóng modal
      setDate(null);
      setTime(null);
      setNote("");
      onClose();
    } catch (error) {
      message.error("Đặt lịch thất bại!", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={`Đặt lịch với ${coach?.coach_id?.name || "Huấn luyện viên"}`}
      onCancel={onClose}
      onOk={handleBook}
      okText="Đặt lịch"
      confirmLoading={submitting}
    >
      <div className="space-y-4">
        <DatePicker
          className="w-full"
          placeholder="Chọn ngày"
          value={date}
          onChange={setDate}
          disabledDate={(current) => current && current < dayjs().startOf("day")}
        />
        <TimePicker
          className="w-full"
          placeholder="Chọn giờ"
          value={time}
          onChange={setTime}
          format="HH:mm"
          minuteStep={15}
        />
        <TextArea
          rows={3}
          placeholder="Ghi chú (tuỳ chọn)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default BookSessionModal;
