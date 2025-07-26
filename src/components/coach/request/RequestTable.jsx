import React, { useMemo } from "react";
import { Table, Tag, Avatar, Empty } from "antd";
import dayjs from "dayjs";
import ActionButtons from "./ActionButtons";

const RequestTable = ({ data, loading, onApprove, onReject, onCreatePlan }) => {
  const columns = useMemo(
    () => [
      {
        title: "Người dùng",
        key: "user",
        render: (_, record) => (
          <div className="flex items-center gap-2">
            <Avatar src={record.user_id.avatar_url} />
            <div>
              <div>{record.user_id.name}</div>
              <div className="text-gray-400 text-xs">
                {record.user_id.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Tên kế hoạch",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Lý do",
        dataIndex: "reason",
        key: "reason",
      },
      {
        title: "Ngày bắt đầu",
        dataIndex: "start_date",
        key: "start_date",
        render: (date) => dayjs(date).format("DD/MM/YYYY"),
      },
      {
        title: "Ngày bỏ thuốc",
        dataIndex: "target_quit_date",
        key: "target_quit_date",
        render: (date) => dayjs(date).format("DD/MM/YYYY"),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const colors = {
            approved: "green",
            rejected: "red",
            created: "blue",
            pending: "orange",
          };
          return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
        },
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => (
          <ActionButtons
            record={record}
            onApprove={onApprove}
            onReject={onReject}
            onCreatePlan={onCreatePlan}
          />
        ),
      },
    ],
    [onApprove, onReject, onCreatePlan]
  );

  return (
    <div className="bg-white border shadow-sm rounded-2xl p-4">
      <Table
        rowKey="_id"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} yêu cầu`,
        }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có yêu cầu kế hoạch nào từ người dùng chọn bạn làm huấn luyện viên"
            />
          ),
        }}
      />
    </div>
  );
};

export default RequestTable;
