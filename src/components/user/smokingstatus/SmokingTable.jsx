import { Table, Card, Button, Space, Popconfirm } from "antd";
import { Trash2, BarChart3, Cigarette, DollarSign, Clock } from "lucide-react";

const iconColor = "#d9d9d9";

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
      width: 120,
      render: (value) => `${value} điếu`,
    },
    {
      title: (
        <Space>
          <DollarSign size={14} />
          Giá / bao (VND)
        </Space>
      ),
      dataIndex: "cost_per_pack",
      align: "center",
      width: 150,
      render: (value) => `${value.toLocaleString("vi-VN")}`,
    },
    {
      title: (
        <Space>
          <Clock size={14} />
          Tần suất
        </Space>
      ),
      dataIndex: "frequency",
      align: "center",
      width: 100,
      render: (value) =>
        value === "daily" ? "Hàng ngày" : value || "Hàng ngày",
    },
    {
      title: "Thao tác",
      align: "center",
      width: 100,
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
