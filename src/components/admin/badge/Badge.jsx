import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import BadgeModal from "./BadgeModal";
import BadgeUserListModal from "./BadgeUserListModal";
import BadgeShareApprovalModal from "./BadgeShareApprovalModal";
import badgeService from "~/services/badgeService";

export default function Badge() {
    const [badges, setBadges] = useState([]);
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [userListVisible, setUserListVisible] = useState(false);
    const [shareVisible, setShareVisible] = useState(false);
    const [badgeUserStats, setBadgeUserStats] = useState([]);

    useEffect(() => {
        fetchBadges();
        fetchUserStats();
    }, [])

    const fetchBadges = async () => {
        try {
            const response = await badgeService.getAllBadges();
            setBadges(response);
        } catch (error) {
            console.error("Error fetching badges:", error);
        }
    };

    const fetchUserStats = async () => {
        try {
            const response = await badgeService.getBadgeStats();
            setBadgeUserStats(response);
        } catch (error) {
            console.error("Error fetching badge user stats:", error);
        }
    };

    const badgeUserStatsMap = useMemo(() => {
        const map = {};
        badgeUserStats.forEach(stat => {
            map[stat.badge_id] = stat;
        });
        return map;
    }, [badgeUserStats]);

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
                {badges.map((badge) => {
                    const stat = badgeUserStatsMap[badge._id] || { users: [] };
                    console.log('stat', stat);
                    return (
                        <Card
                            key={badge.id || badge._id}
                            title={
                                <div className="flex items-center gap-3">
                                    <img src={badge.url_image} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <div className="font-medium">{badge.name}</div>
                                        {/* <div className="text-sm text-gray-500">{badge.description}</div> */}
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
                            <p>🎯 {badge.condition} : {badge.point_value}</p>
                            <p>👥 Đã đạt: {stat.users.length}</p>
                        </Card>
                    );
                })}
            </div>

            {/* <div className="mt-6">
                <Button type="dashed" onClick={() => setShareVisible(true)}>
                    Phê duyệt chia sẻ huy hiệu
                </Button>
            </div> */}

            <BadgeModal
                visible={formVisible}
                badge={selectedBadge}
                onClose={() => setFormVisible(false)}
                onSuccess={fetchBadges}
            />
            <BadgeUserListModal
                visible={userListVisible}
                badge={selectedBadge}
                users={badgeUserStatsMap[selectedBadge?._id]?.users || []}
                onClose={() => setUserListVisible(false)}

            />
            <BadgeShareApprovalModal
                visible={shareVisible}
                onClose={() => setShareVisible(false)}
            />
        </div>
    );
}
