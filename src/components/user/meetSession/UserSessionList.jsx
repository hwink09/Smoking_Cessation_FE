import { useEffect, useState } from "react";
import meetSessionService from "~/services/meetSessionService";
import { List, Card, Typography, Button, Space, Tag } from "antd";
import {
  Calendar,
  Clock,
  User,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import dayjs from "dayjs";

const { Text, Link } = Typography;

const UserSessionList = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await meetSessionService.getUserSessions();
        setSessions(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("Lỗi khi lấy lịch:", err);
      }
    };
    fetchSessions();
  }, []);

  return (
    <div className="space-y-6">
      <List
        grid={{ gutter: 16, column: 1 }}
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
        renderItem={(item) => (
          <List.Item>
            <Card
              className="transition-all duration-300 ease-in-out hover:shadow-lg border border-slate-200 rounded-2xl overflow-hidden"
              styles={{ body: { padding: "24px" } }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                    <Calendar size={24} className="text-blue-600" />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <Space className="text-lg font-semibold text-gray-800">
                          <Calendar size={16} className="text-blue-500" />
                          <span>
                            {item.schedule_at
                              ? dayjs(item.schedule_at).format("DD/MM/YYYY")
                              : ""}
                          </span>
                        </Space>
                        <Space className="text-lg font-semibold text-gray-800">
                          <Clock size={16} className="text-green-500" />
                          <span>
                            {item.schedule_at
                              ? dayjs(item.schedule_at).format("HH:mm")
                              : ""}
                          </span>
                        </Space>
                      </div>

                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-purple-500" />
                        <span className="font-medium text-gray-700">
                          Coach:{" "}
                          <span className="text-purple-600">
                            {item.coach_id?.name || "Không rõ"}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div>
                      {item.status?.toLowerCase() === "completed" ? (
                        <Tag color="green" className="px-3 py-1 rounded-full">
                          ✅ Đã hoàn thành
                        </Tag>
                      ) : item.meet_link ? (
                        <Tag color="blue" className="px-3 py-1 rounded-full">
                          🎥 Sẵn sàng họp
                        </Tag>
                      ) : (
                        <Tag color="orange" className="px-3 py-1 rounded-full">
                          ⏳ Chờ link họp
                        </Tag>
                      )}
                    </div>
                  </div>

                  {item.purpose && (
                    <div className="flex items-start space-x-2">
                      <MessageCircle
                        size={16}
                        className="text-orange-500 mt-0.5"
                      />
                      <div className="text-sm text-gray-600 bg-orange-50 p-3 rounded-lg border border-orange-200 flex-1">
                        <span className="font-medium text-orange-700">
                          Mục đích:{" "}
                        </span>
                        {item.purpose}
                      </div>
                    </div>
                  )}

                  {item.meet_link && (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <ExternalLink size={16} className="text-blue-500" />
                        <Text className="text-gray-600">Google Meet Link:</Text>
                        <Link
                          href={item.meet_link}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {item.meet_link.length > 40
                            ? `${item.meet_link.slice(0, 40)}...`
                            : item.meet_link}
                        </Link>
                      </div>
                      <Button
                        type="primary"
                        href={item.meet_link}
                        target="_blank"
                        icon={<ExternalLink size={16} />}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
                      >
                        Tham gia ngay
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default UserSessionList;
