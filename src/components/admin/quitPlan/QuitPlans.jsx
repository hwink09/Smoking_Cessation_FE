import React from "react";
import { Table, Button, Modal, Input, Select, Tag, Spin } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useQuitPlans from "~/hooks/useQuitPlans";


const { Option } = Select;

const QuitPlans = () => {
  const navigate = useNavigate();
  const {
    plans,
    users,
    loading,
    error,
    editingPlan,
    setEditingPlan,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    planToDelete,
    setPlanToDelete,
    selectedUser,
    formData,
    setFormData,
    errors,
    handleNew,
    handleEdit,
    handleUserChange,
    handleDateChange,
    handleSave,
    handleDelete,
  } = useQuitPlans();

  // Table columns
  const columns = [
    {
      title: "Tên Kế Hoạch",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Lý Do",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: "Ngày Mục Tiêu",
      dataIndex: "target_quit_date",
      key: "target_quit_date",
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: "ID Người Dùng",
      dataIndex: "user_id",
      key: "user_id",
      render: (user_id) => typeof user_id === 'object' ? user_id._id : user_id || "Không có",
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={e => { e.stopPropagation(); handleEdit(record); }}>
            Sửa
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={e => { e.stopPropagation(); setPlanToDelete(record._id); setShowConfirm(true); }}>
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
        placeholder="Chọn người dùng"
        value={formData.user || ""}
        onChange={handleUserChange}
        status={errors.user ? "error" : ""}
      >
        {users.map(user => (
          <Option key={user.id} value={user.id}>
            {user.responses?.name || user.name} ({user.responses?.email || user.email})
          </Option>
        ))}
      </Select>
      {errors.user && <div style={{ color: "#ff4d4f" }}>{errors.user}</div>}
      {selectedUser && (
        <div style={{ color: "#888", fontSize: 13 }}>
          Đã chọn: {selectedUser.responses?.name || selectedUser.name} ({selectedUser.responses?.email || selectedUser.email})
        </div>
      )}
      <Input
        placeholder="Tên kế hoạch"
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        status={errors.name ? "error" : ""}
      />
      {errors.name && <div style={{ color: "#ff4d4f" }}>{errors.name}</div>}
      <Input
        placeholder="Lý do"
        value={formData.reason}
        onChange={e => setFormData({ ...formData, reason: e.target.value })}
        status={errors.reason ? "error" : ""}
      />
      {errors.reason && <div style={{ color: "#ff4d4f" }}>{errors.reason}</div>}
      <Input
        type="date"
        value={formData.start_date}
        onChange={e => handleDateChange('start_date', e.target.value)}
        status={errors.start_date ? "error" : ""}
      />
      {errors.start_date && <div style={{ color: "#ff4d4f" }}>{errors.start_date}</div>}
      <Input
        type="date"
        value={formData.target_quit_date}
        onChange={e => handleDateChange('target_quit_date', e.target.value)}
        status={errors.target_quit_date ? "error" : ""}
      />
      {errors.target_quit_date && <div style={{ color: "#ff4d4f" }}>{errors.target_quit_date}</div>}
    </div>
  );

  // Loading
  if (loading && plans.length === 0) {
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
      <div style={{ maxWidth: 1200, margin: "0 auto 32px auto", display: "flex", justifyContent: "flex-start" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          shape="round"
          size="large"
          onClick={handleNew}
        >
          Thêm Kế Hoạch
        </Button>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px #f0f1f2" }}>
        <Table
          columns={columns}
          dataSource={plans}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: "Không có kế hoạch nào.",
          }}
          onRow={(record) => ({
            onClick: () => navigate(`/admin/quit-plans/${record._id}`, { state: { plan: record } }),
          })}
        />
      </div>
      <Modal
        open={!!editingPlan}
        title={isNew ? "Thêm Kế Hoạch Cai Thuốc Mới" : "Chỉnh Sửa Kế Hoạch Cai Thuốc"}
        onCancel={() => {
          setEditingPlan(null);
          setIsNew(false);
        }}
        onOk={handleSave}
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
          setPlanToDelete(null);
        }}
        onOk={() => {
          handleDelete(planToDelete);
          setShowConfirm(false);
          setPlanToDelete(null);
        }}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
        icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
        destroyOnClose
      >
        Bạn có chắc chắn muốn xóa kế hoạch cai thuốc này không?
      </Modal>
    </section>
  );
};

export default QuitPlans;