import { Table, Card, Button, Space, Tag, Typography } from "antd";
import {
  Calendar,
  Clock,
  User,
  MessageCircle,
  ExternalLink,
  Eye,
} from "lucide-react";
import dayjs from "dayjs";

const { Link } = Typography;

export default function MeetSessionTable({ sessions, onViewDetails }) {
  const columns = [
    {
      title: (
        <Space>
          <Calendar size={14} className="text-blue-500" />
          <span className="font-semibold">Ngày</span>
        </Space>
      ),
      dataIndex: "schedule_at",
      align: "center",
      width: 120,
      render: (value) =>
        value && (
          <span className="font-medium text-blue-600">
            {dayjs(value).format("DD/MM/YYYY")}
          </span>
        ),
    },
    {
      title: (
        <Space>
          <Clock size={14} className="text-green-500" />
          <span className="font-semibold">Giờ</span>
        </Space>
      ),
      dataIndex: "schedule_at",
      align: "center",
      width: 100,
      render: (value) =>
        value && (
          <span className="font-medium text-green-600">
            {dayjs(value).format("HH:mm")}
          </span>
        ),
    },
    {
      title: (
        <Space>
          <User size={14} className="text-purple-500" />
          <span className="font-semibold">Huấn luyện viên</span>
        </Space>
      ),
      dataIndex: ["coach_id", "name"],
      align: "center",
      width: 180,
      render: (_, record) => (
        <span className="font-medium text-purple-600">
          {record.coach_id?.name || "Không rõ"}
        </span>
      ),
    },
    {
      title: (
        <Space>
          <MessageCircle size={14} className="text-orange-500" />
          <span className="font-semibold">Mục đích</span>
        </Space>
      ),
      dataIndex: "purpose",
      align: "center",
      width: 200,
      render: (value) =>
        value ? (
          <span className="text-sm text-gray-600">
            {value.length > 30 ? `${value.slice(0, 30)}...` : value}
          </span>
        ) : (
          <span className="text-gray-400 italic">Không có ghi chú</span>
        ),
    },
    {
      title: <span className="font-semibold">Trạng thái</span>,
      dataIndex: "status",
      align: "center",
      width: 130,
      render: (status, record) => {
        const lower = status?.toLowerCase();
        if (lower === "completed") {
          return (
            <Tag color="green" className="px-3 py-1 rounded-full">
              ✅ Hoàn thành
            </Tag>
          );
        }
        if (record.meet_link) {
          return (
            <Tag color="blue" className="px-3 py-1 rounded-full">
              🎥 Sẵn sàng
            </Tag>
          );
        }
        return (
          <Tag color="orange" className="px-3 py-1 rounded-full">
            ⏳ Chờ link
          </Tag>
        );
      },
    },
    {
      title: <span className="font-semibold">Thao tác</span>,
      align: "center",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<Eye size={14} />}
            onClick={() => onViewDetails(record)}
            className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200"
          />
          {record.meet_link && record.status?.toLowerCase() !== "completed" && (
            <Button
              size="small"
              type="primary"
              icon={<ExternalLink size={14} />}
              href={record.meet_link}
              target="_blank"
              className="bg-gradient-to-r from-green-500 to-blue-500 border-0 hover:from-green-600 hover:to-blue-600 transition-all duration-200"
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="mb-8">
      <Card
        className="transition-all duration-300 ease-in-out hover:shadow-lg border border-slate-200 rounded-2xl overflow-hidden"
        title={
          <div className="flex items-center gap-3 py-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-1">
                Lịch tư vấn
              </h3>
              <p className="text-sm text-gray-500 m-0">
                Danh sách các buổi tư vấn với huấn luyện viên
              </p>
            </div>
          </div>
        }
        styles={{
          header: {
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            borderBottom: "1px solid #e2e8f0",
          },
          body: { padding: "24px" },
        }}
      >
        <Table
          columns={columns}
          dataSource={sessions}
          rowKey={(record) => record._id || record.id}
          bordered={false}
          pagination={sessions.length > 10 ? { pageSize: 10 } : false}
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
          className="session-table"
          rowClassName="hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
        />
      </Card>

      {/* Tailwind-based Table Styling */}
      <style>
        {`
          .session-table .ant-table-thead > tr > th {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-bottom: 2px solid #e2e8f0;
            font-weight: 600;
            color: #374151;
            padding: 16px 12px;
          }

          .session-table .ant-table-tbody > tr > td {
            padding: 16px 12px;
            border-bottom: 1px solid #f1f5f9;
          }

          .session-table .ant-table-tbody > tr:last-child > td {
            border-bottom: none;
          }

          .session-table .ant-table-tbody > tr:hover > td {
            background-color: #f8fafc !important;
          }
        `}
      </style>
    </div>
  );
}
