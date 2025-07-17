import React from "react";
import { Table, Card, Avatar, Tag, Typography, Empty } from "antd";
import { UserOutlined, FireOutlined, DollarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const ProgressTable = ({ data, loading }) => {
  const columns = [
    {
      title: "Người dùng",
      dataIndex: "user_id",
      key: "user_id",
      width: 200,
      fixed: "left",
      render: (user) => (
        <div className="flex items-center gap-2">
          <Avatar
            src={user?.avatar_url}
            icon={!user?.avatar_url && <UserOutlined />}
            size={32}
          />
          <div>
            <div className="font-medium">{user?.name || "Không có tên"}</div>
            <div className="text-gray-500 text-sm">
              {user?.email || "Không có email"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "Số điếu thuốc",
      dataIndex: "cigarettes_smoked",
      key: "cigarettes_smoked",
      width: 150,
      render: (count) => (
        <div className="flex items-center gap-2">
          <Tag color={count === 0 ? "green" : count <= 10 ? "orange" : "red"}>
            {count} điếu
          </Tag>
          {count === 0 && <FireOutlined style={{ color: "#52c41a" }} />}
        </div>
      ),
      sorter: (a, b) => a.cigarettes_smoked - b.cigarettes_smoked,
    },
    {
      title: "Tiền tiết kiệm",
      dataIndex: "money_saved",
      key: "money_saved",
      width: 150,
      render: (money) => (
        <div className="flex items-center gap-2">
          <DollarOutlined style={{ color: "#52c41a" }} />
          <Text className="font-medium text-green-600">
            {(money || 0).toLocaleString()} VNĐ
          </Text>
        </div>
      ),
      sorter: (a, b) => (a.money_saved || 0) - (b.money_saved || 0),
    },
    {
      title: "Giai đoạn",
      dataIndex: "stage_id",
      key: "stage_id",
      width: 200,
      render: (stage) => (
        <div>
          <div className="font-medium">
            {stage?.title || "Không có tiêu đề"}
          </div>
          <div className="text-gray-500 text-sm">
            Giai đoạn {stage?.stage_number || "N/A"}
          </div>
        </div>
      ),
    },
  ];

  return (
    <Card className="shadow-sm">
      <Title level={4} className="mb-4">
        Bảng tiến độ chi tiết
      </Title>

      {data.length === 0 ? (
        <Empty description="Chưa có dữ liệu tiến độ" className="py-8" />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => record._id || record.id}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} bản ghi`,
          }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      )}
    </Card>
  );
};

export default ProgressTable;
