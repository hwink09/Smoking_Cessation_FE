import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";

export const EditProfileModal = ({ open, onCancel, onSave, user }) => {
  // Sử dụng hook của Ant Design để điều khiển form
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        phoneNumber: user.phoneNumber,
        address: user.address,
      });
    }
  }, [user, open]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title="Chỉnh sửa hồ sơ cá nhân"
      open={open}
      onCancel={onCancel}
      // Tùy chỉnh lại các nút bấm ở footer
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Lưu thay đổi
        </Button>,
      ]}>
      <Form form={form} layout="vertical" name="edit_profile_form">
        <Form.Item
          name="name"
          label="Họ và Tên"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="phoneNumber" label="Số điện thoại">
          <Input />
        </Form.Item>

        <Form.Item name="address" label="Địa chỉ">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
