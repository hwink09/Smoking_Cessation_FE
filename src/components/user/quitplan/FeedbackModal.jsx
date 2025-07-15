// src/components/user/quitplan/FeedbackModal.jsx
import React from "react";
import { Modal, Form, Rate, Input, Button, message } from "antd";
import FeedbackService from "~/services/feedbackService"; // Gọi "sứ giả" của chúng ta

const FeedbackModal = ({ open, onCancel, coachId, userId, onSuccess }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleFinish = async (values) => {
    setIsSubmitting(true);
    try {
      const feedbackData = {
        ...values, // Gồm { rating, comment }
        user_id: userId,
        coach_id: coachId,
      };
      await FeedbackService.createFeedback(feedbackData);
      message.success("Cảm ơn bạn đã gửi đánh giá!");
      onSuccess(); // Báo cho component cha biết là đã thành công
      form.resetFields(); // Xóa sạch form
    } catch (error) {
      message.error("Gửi đánh giá thất bại. Vui lòng thử lại.");
      console.error("Lỗi khi gửi feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý khi modal bị đóng (do bấm nút cancel hoặc bấm ra ngoài)
  const handleCancel = () => {
    if (isSubmitting) return; // Không cho đóng khi đang gửi
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Đánh giá Huấn luyện viên"
      open={open}
      onCancel={handleCancel}
      footer={null} // Tắt footer mặc định để tự tạo nút bấm riêng
      centered>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ rating: 5, comment: "" }}>
        <Form.Item
          name="rating"
          label="Bạn đánh giá Huấn luyện viên bao nhiêu sao?"
          rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}>
          <Rate allowHalf />
        </Form.Item>

        <Form.Item
          name="comment"
          label="Hãy chia sẻ thêm về trải nghiệm của bạn nhé:"
          rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}>
          <Input.TextArea rows={4} placeholder="Trải nghiệm của tôi là..." />
        </Form.Item>

        <Form.Item style={{ textAlign: "right" }}>
          <Button
            onClick={handleCancel}
            style={{ marginRight: 8 }}
            disabled={isSubmitting}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Gửi Đánh Giá
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FeedbackModal;
