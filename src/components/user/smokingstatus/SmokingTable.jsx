import { Table, Card, Badge, Button, Space, Popconfirm } from "antd"
import {
  Edit,
  Trash2,
  Calculator,
  Calendar,
  Clock,
  BarChart3,
  Cigarette,
  DollarSign
} from "lucide-react"

// Helper functions
const frequencyMap = {
  1: { label: "Thấp", color: "green" },
  2: { label: "Trung bình", color: "orange" },
  3: { label: "Cao", color: "red" },
  4: { label: "Rất cao", color: "volcano" },
  5: { label: "Cực kỳ", color: "magenta" },
  daily: { label: "Hàng ngày", color: "green" },
  "Hàng ngày": { label: "Hàng ngày", color: "green" },
  weekly: { label: "Hàng tuần", color: "orange" },
  "Hàng tuần": { label: "Hàng tuần", color: "orange" },
  monthly: { label: "Hàng tháng", color: "red" },
  "Hàng tháng": { label: "Hàng tháng", color: "red" },
  occasionally: { label: "Thỉnh thoảng", color: "yellow" },
  "Thỉnh thoảng": { label: "Thỉnh thoảng", color: "yellow" },
  social: { label: "Chỉ khi giao tiếp", color: "blue" },
  "Chỉ khi giao tiếp": { label: "Chỉ khi giao tiếp", color: "blue" },
  // Thêm các trạng thái khác nếu có
};

const getFrequencyLabel = (frequency) => {
  return frequencyMap[frequency]?.label || "";
};

const getFrequencyColor = (frequency) => {
  return frequencyMap[frequency]?.color || "default";
};

const calculateDays = (startDate) => {
  const start = new Date(startDate)
  const today = new Date()
  const diffTime = Math.abs(today - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const calculateTotalCost = (record) => {
  const days = calculateDays(record.start_date)
  const packsPerDay = record.cigarettes_per_day / 20 // Assuming 20 cigarettes per pack
  const totalCost = days * packsPerDay * record.cost_per_pack
  return Math.round(totalCost)
}

const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString)
  return {
    date: date.toLocaleDateString("vi-VN"),
    time: date.toLocaleTimeString("vi-VN", { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }
}

export default function SmokingTable({ records,  onDelete }) {
  const columns = [
    {
      title: "Tần suất",
      dataIndex: "frequency",
      key: "frequency",
      render: (frequency) => {
        const label = getFrequencyLabel(frequency);
        if (!label) return null;
        return (
          <Badge 
            color={getFrequencyColor(frequency)} 
            text={label}
          />
        );
      },
    },
    {
      title: (
        <Space>
          <Cigarette size={14} />
          Số điếu/ngày
        </Space>
      ),
      dataIndex: "cigarettes_per_day",
      key: "cigarettes_per_day",
      render: (value) => `${value} điếu`,
    },
    {
      title: (
        <Space>
          <DollarSign size={14} />
          Giá/vỉ
        </Space>
      ),
      dataIndex: "cost_per_pack",
      key: "cost_per_pack",
      render: (value) => `${value.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      title: (
        <Space>
          <Calendar size={14} />
          Ngày bắt đầu
        </Space>
      ),
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => {
        const formatted = formatDateTime(date)
        return (
          <div>
            <div>{formatted.date}</div>
            <small style={{ color: "#666" }}>{formatted.time}</small>
          </div>
        )
      },
    },
    {
      title: (
        <Space>
          <Calculator size={14} />
          Số ngày hút
        </Space>
      ),
      key: "days",
      render: (_, record) => `${calculateDays(record.start_date)} ngày`,
    },
    {
      title: (
        <Space>
          <Calculator size={14} />
          Tổng chi phí
        </Space>
      ),
      key: "total_cost",
      render: (_, record) => (
        <span style={{ color: "#f5222d", fontWeight: "bold" }}>
          {calculateTotalCost(record).toLocaleString("vi-VN")} VNĐ
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: () => (
        <Space>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bản ghi này không?"
            onConfirm={onDelete}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="default"
              danger
              icon={<Trash2 size={14} />}
              size="small"
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title={
        <Space>
          <BarChart3 size={20} style={{ color: "#1890ff" }} />
          Lịch sử hút thuốc
        </Space>
      }
      style={{ marginBottom: "24px" }}
      hoverable
    >
      <Table
        columns={columns}
        dataSource={records}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong tổng ${total} mục`,
        }}
        locale={{
          emptyText: (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <Cigarette size={48} style={{ color: "#d9d9d9", marginBottom: "16px" }} />
              <div style={{ color: "#666" }}>Chưa có dữ liệu. Hãy thêm thông tin đầu tiên của bạn!</div>
            </div>
          ),
        }}
        scroll={{ x: 1200 }}
        rowHover
        size="middle"
      />
    </Card>
  )
}