import { Table, Card, Button, Space, Popconfirm } from "antd";
import {
  Trash2,
  Calendar,
  BarChart3,
  Cigarette,
  DollarSign,
} from "lucide-react";

const iconColor = "#d9d9d9";

const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return {
    date: date.toLocaleDateString("vi-VN"),
    time: date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
};

export default function SmokingTable({ records, onDelete }) {
  const columns = [
    {
      title: (
        <Space>
          <Cigarette size={14} />
          Số điếu / ngày
        </Space>
      ),
      dataIndex: "cigarettes_per_day",
      align: "center",
      width: 150,
      render: (value) => `${value} điếu`,
    },
    {
      title: (
        <Space>
          <DollarSign size={14} />
          Giá / bao (20 điếu)
        </Space>
      ),
      dataIndex: "cost_per_pack",
      align: "center",
      width: 200,
      render: (value) => `${value.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      title: (
        <Space>
          <Calendar size={14} />
          Ngày bắt đầu cai thuốc
        </Space>
      ),
      dataIndex: "start_date",
      align: "center",
      width: 220,
      render: (date) => {
        const { date: d, time } = formatDateTime(date);
        return (
          <div style={{ lineHeight: "1.4" }}>
            <div>{d}</div>
            <small style={{ color: "#666" }}>{time}</small>
          </div>
        );
      },
    },
    {
      title: "Thao tác",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa bản ghi này không?"
          onConfirm={() => onDelete(record.id)}
          okText="Có"
          cancelText="Không"
        >
          <Button danger size="small" icon={<Trash2 size={14} />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card
      title={
        <Space>
          <BarChart3 size={20} style={{ color: "#1890ff" }} />
          Tình trạng hút thuốc
        </Space>
      }
      style={{ marginBottom: 24 }}
      hoverable
    >
      <Table
        columns={columns}
        dataSource={records}
        rowKey="id"
        bordered
        locale={{
          emptyText: (
            <div style={{ padding: 40, textAlign: "center" }}>
              <Cigarette
                size={48}
                style={{ color: iconColor, marginBottom: 16 }}
              />
              <div style={{ color: "#666" }}>
                Chưa có dữ liệu. Hãy thêm thông tin đầu tiên của bạn!
              </div>
            </div>
          ),
        }}
        scroll={{ x: 800 }}
        size="middle"
      />
    </Card>
  );
}
