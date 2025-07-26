import React from "react";
import { Modal, Form, Input, message } from "antd";

const MeetLinkModal = ({
  visible,
  onCancel,
  onConfirm,
  selectedSession,
  form,
}) => {
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onConfirm(selectedSession._id, "accepted", values.meet_link);
      onCancel();
      form.resetFields();
    } catch (err) {
      message.error("Vui lòng điền đầy đủ thông tin", err);
    }
  };

  return (
    <Modal
      title="Xác nhận buổi hẹn"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Xác nhận"
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="meet_link"
          label="Link cuộc họp (Google Meet, Zoom...)"
          rules={[{ required: true, message: "Vui lòng nhập link" }]}
        >
          <Input placeholder="https://meet.google.com/..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MeetLinkModal;
