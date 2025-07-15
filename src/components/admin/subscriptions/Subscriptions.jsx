import React from "react";
import { Table, Button, Modal, Input, Select, Tag, Spin } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
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
    packages,
    loading,
    error,
    selectedSub,
    setSelectedSub,
    editedSub,
    setEditedSub,
    errors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    subToDelete,
    setSubToDelete,
    openEditModal,
    openNewModal,
    handleSaveChanges,
    handleDelete,
  } = useSubscriptions();

  // Table columns
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
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
      render: (id) => packages.find((p) => p._id === id)?.name || id,
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
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Chỉnh sửa
          </Button>
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

  // Modal form content
  const modalForm = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Select
        placeholder="Chọn một gói"
        value={editedSub.package_id}
        onChange={value => setEditedSub({ ...editedSub, package_id: value })}
        status={errors.package_id ? "error" : ""}
      >
        {packages.map((p) => (
          <Option key={p._id} value={p._id}>{p.name}</Option>
        ))}
      </Select>
      {errors.package_id && <div style={{ color: "#ff4d4f" }}>{errors.package_id}</div>}
      <Input
        placeholder="Tên đăng ký"
        value={editedSub.name}
        onChange={e => setEditedSub({ ...editedSub, name: e.target.value })}
        status={errors.name ? "error" : ""}
      />
      {errors.name && <div style={{ color: "#ff4d4f" }}>{errors.name}</div>}
      <Input
        placeholder="Giá"
        value={editedSub.price}
        onChange={e => setEditedSub({ ...editedSub, price: e.target.value })}
        status={errors.price ? "error" : ""}
      />
      {errors.price && <div style={{ color: "#ff4d4f" }}>{errors.price}</div>}
      <Input
        type="date"
        placeholder="Ngày bắt đầu"
        value={editedSub.start_date}
        onChange={e => setEditedSub({ ...editedSub, start_date: e.target.value })}
        status={errors.start_date ? "error" : ""}
      />
      {errors.start_date && <div style={{ color: "#ff4d4f" }}>{errors.start_date}</div>}
      <Input
        type="date"
        placeholder="Ngày kết thúc"
        value={editedSub.end_date}
        onChange={e => setEditedSub({ ...editedSub, end_date: e.target.value })}
        status={errors.end_date ? "error" : ""}
      />
      {errors.end_date && <div style={{ color: "#ff4d4f" }}>{errors.end_date}</div>}
      <Select
        placeholder="Trạng thái"
        value={editedSub.status}
        onChange={value => setEditedSub({ ...editedSub, status: value })}
        status={errors.status ? "error" : ""}
      >
        <Option value="pending">Chờ xử lý</Option>
        <Option value="active">Đang hoạt động</Option>
        <Option value="cancelled">Đã hủy</Option>
        <Option value="expired">Hết hạn</Option>
        <Option value="grace_period">Gia hạn</Option>
      </Select>
      {errors.status && <div style={{ color: "#ff4d4f" }}>{errors.status}</div>}
    </div>
  );

  // Loading
  if (loading && subscriptions.length === 0) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#ff4d4f", fontSize: 18, background: "#fff1f0", padding: 24, borderRadius: 8, border: "1px solid #ffa39e" }}>{error}</div>
      </div>
    );
  }

  return (
    <section style={{ padding: "40px 0", background: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto 32px auto", display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          shape="round"
          size="large"
          onClick={openNewModal}
        >
          Thêm đăng ký
        </Button>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px #f0f1f2" }}>
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
        open={!!selectedSub}
        title={isNew ? "Thêm đăng ký mới" : "Chỉnh sửa đăng ký"}
        onCancel={() => {
          setSelectedSub(null);
          setIsNew(false);
        }}
        onOk={handleSaveChanges}
        confirmLoading={loading}
        okText={isNew ? "Thêm" : "Lưu"}
        cancelText="Hủy"
        destroyOnClose
      >
        {modalForm}
      </Modal>
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
        icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
        destroyOnClose
      >
        Bạn có chắc chắn muốn xóa đăng ký này không?
      </Modal>
    </section>
  );
};

export default Subscriptions;
