import React from "react";
import { Table, Button, Modal, Select, Tag, Spin } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import useSubscriptions from "~/hooks/useSubscriptions";

const { Option } = Select;

const statusLabels = {
  active: { label: "Đang hoạt động", color: "green" },
  pending: { label: "Chờ xử lý", color: "gold" },
  cancelled: { label: "Đã hủy", color: "red" },
  expired: { label: "Hết hạn", color: "default" },
  grace_period: { label: "Gia hạn", color: "orange" },
};

const Subscriptions = () => {
  const {
    subscriptions,
    users,
    packages,
    loading,
    error,
    showConfirm,
    setShowConfirm,
    subToDelete,
    setSubToDelete,
    handleDelete,
  } = useSubscriptions();

  // Table columns
  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "user_id",
      key: "user_id",
      render: (userId) => {
        const user = Array.isArray(users)
          ? users.find((u) => u.id === userId)
          : null;
        return user ? user.name : "Không rõ";
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Gói",
      dataIndex: "package_id",
      key: "package_id",
      render: (id) => {
        const pkg = packages.find((p) => p._id === id);
        if (!pkg) return id;
        let color = "#d9d9d9";
        if (pkg.name === "free") color = "#52c41a";
        if (pkg.name === "plus") color = "#1890ff";
        if (pkg.name === "premium") color = "#faad14";
        return (
          <span
            style={{
              border: `2px solid ${color}`,
              color: color,
              padding: "2px 12px",
              borderRadius: 8,
              fontWeight: 600,
              textTransform: "capitalize",
              background: "#fff",
            }}
          >
            {pkg.name}
          </span>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusLabels[status]?.color || "default"}>
          {statusLabels[status]?.label || status}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "right",
      render: (_, record) => (
        <>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setSubToDelete(record._id);
              setShowConfirm(true);
            }}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  // Loading
  if (loading && subscriptions.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" tip="Đang tải...">
          <div />
        </Spin>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "#ff4d4f",
            fontSize: 18,
            background: "#fff1f0",
            padding: 24,
            borderRadius: 8,
            border: "1px solid #ffa39e",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <section
      style={{ padding: "40px 0", background: "#f9fafb", minHeight: "100vh" }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 2px 8px #f0f1f2",
        }}
      >
        <Table
          columns={columns}
          dataSource={subscriptions}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: "Không có đăng ký nào.",
          }}
        />
      </div>
      <Modal
        open={showConfirm}
        title="Xác nhận xoá"
        onCancel={() => {
          setShowConfirm(false);
          setSubToDelete(null);
        }}
        onOk={() => {
          handleDelete(subToDelete);
          setShowConfirm(false);
          setSubToDelete(null);
        }}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
        icon={<ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />}
        destroyOnHidden
      >
        Bạn có chắc chắn muốn xóa đăng ký này không?
      </Modal>
    </section>
  );
};

export default Subscriptions;
