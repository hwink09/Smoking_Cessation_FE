import React from "react";
import { Modal, Form, Input, DatePicker } from "antd";

const CreatePlanModal = ({ open, onCancel, onOk, form }) => {
  return (
    <Modal
      title="Tạo kế hoạch từ yêu cầu"
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okText="Tạo kế hoạch"
      cancelText="Hủy"
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Tên kế hoạch"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên kế hoạch" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Lý do"
          name="reason"
          rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Ngày bắt đầu"
          name="start_date"
          rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
        >
          <DatePicker format="DD/MM/YYYY" className="w-full" />
        </Form.Item>

        <Form.Item
          label="Ngày bỏ thuốc"
          name="target_quit_date"
          rules={[{ required: true, message: "Chọn ngày bỏ thuốc" }]}
        >
          <DatePicker format="DD/MM/YYYY" className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePlanModal;
