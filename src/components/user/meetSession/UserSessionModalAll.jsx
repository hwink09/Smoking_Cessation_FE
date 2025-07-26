import { Modal, List, Tag, Button, Space, Card } from "antd";
import { useEffect, useState } from "react";
import meetSessionService from "~/services/meetSessionService";
import dayjs from "dayjs";
import { Calendar, Clock, User, MessageCircle } from "lucide-react";

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
      title={
        <div className="flex items-center gap-3 py-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-1">
              Lịch tư vấn của bạn
            </h3>
            <p className="text-sm text-gray-500">
              Quản lý các buổi tư vấn với huấn luyện viên
            </p>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      className="rounded-2xl overflow-hidden shadow-2xl"
      styles={{
        header: {
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          borderBottom: "1px solid #e2e8f0",
          borderRadius: "16px 16px 0 0",
        },
        body: {
          background: "linear-gradient(to bottom right, #ffffff, #f9fafb)",
          padding: "24px",
        },
      }}
    >
      <List
        loading={loading}
        dataSource={sessions}
        locale={{
          emptyText: (
            <div className="text-center py-12">
              <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
              <div className="text-gray-500 text-lg font-medium mb-2">
                Chưa có lịch tư vấn
              </div>
              <div className="text-gray-400">
                Hãy đặt lịch tư vấn đầu tiên của bạn!
              </div>
            </div>
          ),
        }}
        grid={{ gutter: 16, column: 1 }}
        rowKey={(item) => item.id || item._id}
        renderItem={(item) => {
          const isCompleted = item.status?.toLowerCase() === "completed";

          return (
            <List.Item>
              <Card
                className={`border border-slate-200 rounded-2xl transition-all duration-300 ${
                  isCompleted ? "opacity-70" : "hover:shadow-lg"
                }`}
                styles={{ body: { padding: 20 } }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                    <Calendar size={24} className="text-blue-600" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-6 flex-wrap">
                      <Space className="text-lg font-semibold text-gray-800">
                        <Calendar size={16} className="text-blue-500" />
                        <span>
                          {dayjs(item.schedule_at).format("DD/MM/YYYY")}
                        </span>
                      </Space>
                      <Space className="text-lg font-semibold text-gray-800">
                        <Clock size={16} className="text-green-500" />
                        <span>{dayjs(item.schedule_at).format("HH:mm")}</span>
                      </Space>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <User size={16} className="text-purple-500" />
                      <span>
                        Coach:{" "}
                        <span className="text-purple-600">
                          {item.coach_id?.name || "Không rõ"}
                        </span>
                      </span>
                    </div>

                    {item.purpose && (
                      <div className="flex items-start gap-2">
                        <MessageCircle
                          size={16}
                          className="text-orange-500 mt-1"
                        />
                        <div className="text-sm text-gray-600 bg-orange-50 p-2 rounded-lg border border-orange-200">
                          <span className="font-medium text-orange-700">
                            Ghi chú:{" "}
                          </span>
                          {item.purpose}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div>
                        {isCompleted ? (
                          <Tag color="green" className="px-3 py-1 rounded-full">
                            ✅ Đã hoàn thành
                          </Tag>
                        ) : item.meet_link ? (
                          <Tag color="blue" className="px-3 py-1 rounded-full">
                            🎥 Sẵn sàng họp
                          </Tag>
                        ) : (
                          <Tag
                            color="orange"
                            className="px-3 py-1 rounded-full"
                          >
                            ⏳ Chờ link họp
                          </Tag>
                        )}
                      </div>

                      {!isCompleted && item.meet_link && (
                        <Button
                          type="primary"
                          href={item.meet_link}
                          target="_blank"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
                        >
                          🎥 Vào phòng họp
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </List.Item>
          );
        }}
      />
    </Modal>
  );
};

export default UserSessionModalAll;
