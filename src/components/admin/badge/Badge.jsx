import React, { useState } from "react";
import { Button, Card, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import BadgeModal from "./BadgeModal";
import BadgeUserListModal from "./BadgeUserListModal";
import BadgeShareApprovalModal from "./BadgeShareApprovalModal";

const mockBadges = [
    {
        id: "1",
        name: "7 ngày không hút",
        description: "Bạn đã không hút thuốc trong 7 ngày!",
        iconUrl: "/icons/7days.png",
        conditionType: "days_smoke_free",
        conditionValue: 7,
        achievedCount: 112,
    },
    {
        id: "2",
        name: "Tiết kiệm 1 triệu",
        description: "Bạn đã tiết kiệm được 1 triệu VND!",
        iconUrl: "/icons/1m.png",
        conditionType: "money_saved",
        conditionValue: 1000000,
        achievedCount: 85,
    },
];

export default function Badge() {
    const [badges, setBadges] = useState(mockBadges);
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [userListVisible, setUserListVisible] = useState(false);
    const [shareVisible, setShareVisible] = useState(false);

    return (
        <div className="">
            <div className="flex justify-between items-center mb-6">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setSelectedBadge(null);
                        setFormVisible(true);
                    }}
                >
                    Thêm huy hiệu
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge) => (
                    <Card
                        key={badge.id}
                        title={
                            <div className="flex items-center gap-3">
                                <img src={badge.iconUrl} className="w-10 h-10" />
                                <div>
                                    <div className="font-medium">{badge.name}</div>
                                    <div className="text-sm text-gray-500">{badge.description}</div>
                                </div>
                            </div>
                        }
                        actions={[
                            <Tooltip title="Xem người đạt">
                                <EyeOutlined onClick={() => {
                                    setSelectedBadge(badge);
                                    setUserListVisible(true);
                                }} />
                            </Tooltip>,
                            <Tooltip title="Chỉnh sửa">
                                <EditOutlined onClick={() => {
                                    setSelectedBadge(badge);
                                    setFormVisible(true);
                                }} />
                            </Tooltip>,
                        ]}
                    >
                        <p>🎯 {badge.conditionType}: {badge.conditionValue}</p>
                        <p>👥 Đã đạt: {badge.achievedCount}</p>
                    </Card>
                ))}
            </div>

            <div className="mt-6">
                <Button type="dashed" onClick={() => setShareVisible(true)}>
                    Phê duyệt chia sẻ huy hiệu
                </Button>
            </div>

            <BadgeModal
                visible={formVisible}
                badge={selectedBadge}
                onClose={() => setFormVisible(false)}
            />
            <BadgeUserListModal
                visible={userListVisible}
                badge={selectedBadge}
                onClose={() => setUserListVisible(false)}
            />
            <BadgeShareApprovalModal
                visible={shareVisible}
                onClose={() => setShareVisible(false)}
            />
        </div>
    );
}
