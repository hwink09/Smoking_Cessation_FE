import { Modal, List, Typography, Tag, Button } from "antd";
import { useEffect, useState } from "react";
import meetSessionService from "~/services/meetSessionService";
import dayjs from "dayjs";

const { Text, Link } = Typography;

const UserSessionModalAll = ({ open, onClose }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchSessions = async () => {
      try {
        setLoading(true);
        const data = await meetSessionService.getUserSessions();
        setSessions(data);
      } catch (err) {
        console.error("Lỗi khi lấy lịch tư vấn:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [open]);

  return (
    <Modal
      open={open}
      title="Lịch tư vấn của bạn"
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <List
        loading={loading}
        dataSource={sessions}
        locale={{ emptyText: "Bạn chưa có lịch tư vấn nào." }}
        renderItem={(item) => (
          <List.Item style={item.status && item.status.toLowerCase() === "completed" ? { opacity: 0.5, pointerEvents: "none" } : {}}>
            <div className="w-full">
              <Text strong>
                📅 {item.schedule_at ? dayjs(item.schedule_at).format("DD/MM/YYYY") : ""} - 🕒 {item.schedule_at ? dayjs(item.schedule_at).format("HH:mm") : ""}
              </Text>
              <div className="text-sm mt-1 text-gray-700">
                Coach: <b>{item.coach_id?.name || "Không rõ"}</b>
              </div>
              <div className="mt-1">
                {item.status && item.status.toLowerCase() === "completed" ? (
                  <Tag color="green">Đã hoàn thành</Tag>
                ) : item.meet_link ? (
                  <Button type="primary" href={item.meet_link} target="_blank">
                    Vào phòng họp Google Meet
                  </Button>
                ) : (
                  <Tag color="red">Chưa có link</Tag>
                )}
              </div>
              {item.purpose && (
                <div className="text-xs text-gray-500 mt-1">
                  Ghi chú: {item.purpose}
                </div>
              )}
            </div>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default UserSessionModalAll;
