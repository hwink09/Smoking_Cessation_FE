import { Table, Card, Button, Space, Popconfirm } from "antd";
import {
  Trash2,
  BarChart3,
  Cigarette,
  DollarSign,
  Clock,
  Edit3,
} from "lucide-react";

export default function SmokingTable({ records, onDelete, onEdit }) {
  const columns = [
    {
      title: (
        <Space>
          <Cigarette size={14} className="text-blue-500" />
          <span className="font-semibold">Số điếu / ngày</span>
        </Space>
      ),
      dataIndex: "cigarettes_per_day",
      align: "center",
      width: 150,
      render: (value) => (
        <div className="font-medium text-gray-700">
          <span className="text-lg text-blue-600">{value}</span>
          <span className="text-sm text-gray-500 ml-1">điếu</span>
        </div>
      ),
    },
    {
      title: (
        <Space>
          <DollarSign size={14} className="text-green-500" />
          <span className="font-semibold">Giá / bao (VND)</span>
        </Space>
      ),
      dataIndex: "cost_per_pack",
      align: "center",
      width: 180,
      render: (value) => (
        <div className="font-medium text-green-600">
          <span className="text-lg">{value.toLocaleString("vi-VN")}</span>
          <span className="text-sm text-gray-500 ml-1">₫</span>
        </div>
      ),
    },
    {
      title: (
        <Space>
          <Clock size={14} className="text-purple-600" />
          <span className="font-semibold">Tần suất</span>
        </Space>
      ),
      dataIndex: "frequency",
      align: "center",
      width: 120,
      render: (value) => (
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
          {value === "daily" ? "Hàng ngày" : value || "Hàng ngày"}
        </span>
      ),
    },
    {
      title: <span className="font-semibold">Thao tác</span>,
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<Edit3 size={14} />}
            onClick={() => onEdit(record)}
            className="border border-blue-300 text-blue-600 hover:bg-blue-50 transition"
          />
          <Popconfirm
            title="Xóa bản ghi"
            description="Bạn có chắc chắn muốn xóa bản ghi này không?"
            onConfirm={() => onDelete(record.id)}
            okText="Có"
            cancelText="Không"
            okButtonProps={{
              className:
                "bg-red-500 hover:bg-red-600 border-red-500 text-white",
            }}
          >
            <Button
              danger
              size="small"
              icon={<Trash2 size={14} />}
              className="hover:bg-red-50 transition"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="mb-8">
      <Card
        className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition"
        title={
          <div className="flex items-center gap-3 py-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Dữ liệu hút thuốc
              </h3>
              <p className="text-sm text-gray-500">
                Thông tin chi tiết về thói quen hút thuốc của bạn
              </p>
            </div>
          </div>
        }
      >
        <Table
          className="smoking-table"
          columns={columns}
          dataSource={records}
          rowKey="id"
          bordered={false}
          pagination={false}
          rowClassName="hover:bg-blue-50/50 transition cursor-pointer"
          locale={{
            emptyText: (
              <div className="text-center py-12">
                <Cigarette size={48} className="text-gray-300 mx-auto mb-4" />
                <div className="text-gray-500 text-lg font-medium mb-2">
                  Chưa có dữ liệu
                </div>
                <div className="text-gray-400">
                  Hãy thêm thông tin đầu tiên của bạn!
                </div>
              </div>
            ),
          }}
        />
      </Card>

      <style>
        {`
        .smoking-table .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 2px solid #e2e8f0;
          font-weight: 600;
          color: #374151;
          padding: 16px 12px;
        }
        .smoking-table .ant-table-tbody > tr > td {
          padding: 16px 12px;
          border-bottom: 1px solid #f1f5f9;
        }
        .smoking-table .ant-table-tbody > tr:last-child > td {
          border-bottom: none;
        }
        `}
      </style>
    </div>
  );
}
