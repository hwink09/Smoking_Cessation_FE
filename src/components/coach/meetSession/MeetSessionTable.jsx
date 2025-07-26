import React from "react";
import { Table, Tag, Empty } from "antd";
import { CalendarOutlined, VideoCameraOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import MeetSessionActions from "./MeetSessionActions";

const statusColors = {
  pending: "orange",
  accepted: "green",
  rejected: "red",
  completed: "blue",
};

const MeetSessionTable = ({
  sessions,
  loading,
  onStatusUpdate,
  onComplete,
}) => {
  const columns = [
    {
      title: "Học viên",
      dataIndex: "user_id",
      key: "user",
      width: 200,
      fixed: "left",
      render: (user) => (
        <div>
          <div className="font-medium">{user?.name || "Không có tên"}</div>
          <div className="text-gray-500 text-sm">
            {user?.email || "Không có email"}
          </div>
        </div>
      ),
    },
    {
      title: "Mục đích",
      dataIndex: "purpose",
      key: "purpose",
      width: 250,
      render: (purpose) => (
        <div className="font-medium text-blue-600">
          {purpose || "Không có mục đích"}
        </div>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "schedule_at",
      key: "schedule",
      width: 150,
      render: (date) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined style={{ color: "#1890ff" }} />
          <div>
            <div className="font-medium">
              {dayjs(date).format("DD/MM/YYYY")}
            </div>
            <div className="text-gray-500 text-sm">
              {dayjs(date).format("HH:mm")}
            </div>
          </div>
        </div>
      ),
      sorter: (a, b) =>
        dayjs(a.schedule_at).unix() - dayjs(b.schedule_at).unix(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Link họp",
      dataIndex: "meet_link",
      key: "meet_link",
      width: 150,
      render: (link) => (
        <div className="flex items-center gap-2">
          <VideoCameraOutlined style={{ color: "#52c41a" }} />
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 font-medium"
            >
              Google Meet
            </a>
          ) : (
            <span className="text-gray-400">Chưa có link</span>
          )}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <MeetSessionActions
          record={record}
          onStatusUpdate={onStatusUpdate}
          onComplete={onComplete}
        />
      ),
    },
  ];

  if (sessions.length === 0) {
    return <Empty description="Chưa có buổi hẹn nào" className="py-8" />;
  }

  return (
    <Table
      columns={columns}
      dataSource={sessions}
      rowKey={(record) => record._id}
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} buổi hẹn`,
      }}
      scroll={{ x: 1200 }}
      size="middle"
    />
  );
};

export default MeetSessionTable;
