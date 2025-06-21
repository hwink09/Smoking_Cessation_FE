import React, { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber, message } from "antd";
import badgeService from "~/services/badgeService";

export default function BadgeModal({ visible, badge, onClose, onSuccess }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (badge) {
            form.setFieldsValue(badge);
        } else {
            form.resetFields();
        }
    }, [badge]);

    const onFinish = async (values) => {
        try {
            if (badge && badge.id) {
                await badgeService.updateBadge(badge.id, values);
                message.success("Cập nhật huy hiệu thành công!");
            } else {
                await badgeService.createBadge(values);
                message.success("Tạo huy hiệu thành công!");
            }
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            message.error(badge && badge.id ? "Cập nhật huy hiệu thất bại!" : "Tạo huy hiệu thất bại!", error);
        }
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
                <Form.Item name="tier" label="Rank huy hiệu">
                    <Input />
                </Form.Item>
                <Form.Item name="url_image" label="URL ảnh huy hiệu">
                    <Input />
                </Form.Item>
                <Form.Item name="condition" label="Loại điều kiện">
                    {/* <Select>
                        <Select.Option value="days_smoke_free">Ngày không hút thuốc</Select.Option>
                        <Select.Option value="money_saved">Tiền tiết kiệm</Select.Option>
                    </Select> */}
                    <Input />
                </Form.Item>
                <Form.Item name="point_value" label="Giá trị điều kiện">
                    <InputNumber className="w-full" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
