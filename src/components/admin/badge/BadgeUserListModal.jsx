import React from "react";
import { Modal, Table } from "antd";

const mockUsers = [
    { key: "1", name: "Nguyễn Văn A", achievedAt: "2025-05-01" },
    { key: "2", name: "Trần Thị B", achievedAt: "2025-05-10" },
];

export default function BadgeUserListModal({ visible, badge, onClose }) {
    const columns = [
        { title: "Tên người dùng", dataIndex: "name" },
        { title: "Thời gian đạt", dataIndex: "achievedAt" },
    ];

    return (
        <Modal
            title={`Người dùng đạt huy hiệu: ${badge?.name}`}
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Table columns={columns} dataSource={mockUsers} pagination={false} />
        </Modal>
    );
}
