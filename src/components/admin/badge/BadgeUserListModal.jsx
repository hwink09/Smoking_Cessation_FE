import React from "react";
import { Modal, Table } from "antd";

export default function BadgeUserListModal({ visible, badge, users, onClose }) {
    const columns = [
        { title: "Tên người dùng", dataIndex: "name" },
        { title: "Thời gian đạt", dataIndex: "date_awarded" },
    ];

    return (
        <Modal
            title={`Người dùng đạt huy hiệu: ${badge?.name}`}
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Table columns={columns} dataSource={users} rowKey="user_id" pagination={false} />
        </Modal>
    );
}
