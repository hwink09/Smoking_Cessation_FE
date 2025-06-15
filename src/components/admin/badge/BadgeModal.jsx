import React, { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";

export default function BadgeModal({ visible, badge, onClose }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (badge) {
            form.setFieldsValue(badge);
        } else {
            form.resetFields();
        }
    }, [badge]);

    const onFinish = (values) => {
        console.log("Lưu huy hiệu:", values);
        onClose();
    };

    return (
        <Modal
            title={badge ? "Chỉnh sửa huy hiệu" : "Tạo huy hiệu mới"}
            open={visible}
            onCancel={onClose}
            onOk={() => form.submit()}
            okText="Lưu"
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="name" label="Tên huy hiệu" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Mô tả">
                    <Input />
                </Form.Item>
                <Form.Item name="iconUrl" label="URL ảnh huy hiệu">
                    <Input />
                </Form.Item>
                <Form.Item name="conditionType" label="Loại điều kiện">
                    <Select>
                        <Select.Option value="days_smoke_free">Ngày không hút thuốc</Select.Option>
                        <Select.Option value="money_saved">Tiền tiết kiệm</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="conditionValue" label="Giá trị điều kiện">
                    <InputNumber className="w-full" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
