import React from "react";
import { Modal, List, Button } from "antd";

const mockShares = [
    { id: 1, user: "Nguyễn Văn C", content: "Mình đã không hút 7 ngày rồi!" },
];

export default function BadgeShareApprovalModal({ visible, onClose }) {
    const approveShare = (id) => {
        console.log("Phê duyệt:", id);
    };

    const rejectShare = (id) => {
        console.log("Từ chối:", id);
    };

    return (
        <Modal
            title="Phê duyệt chia sẻ huy hiệu"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <List
                dataSource={mockShares}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button type="link" onClick={() => approveShare(item.id)}>Phê duyệt</Button>,
                            <Button type="link" danger onClick={() => rejectShare(item.id)}>Từ chối</Button>,
                        ]}
                    >
                        <List.Item.Meta
                            title={item.user}
                            description={item.content}
                        />
                    </List.Item>
                )}
            />
        </Modal>
    );
}
