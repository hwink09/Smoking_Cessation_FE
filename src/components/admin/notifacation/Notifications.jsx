import React from "react";
import { Table, Modal, Input, Select, Tag, Spin } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import useNotifications from "~/hooks/useNotifications";

const { Option } = Select;

const typeLabels = {
  daily: { label: "Hàng ngày", color: "blue" },
  weekly: { label: "Hàng tuần", color: "purple" },
  motivation: { label: "Động lực", color: "gold" },
};

const Notifications = () => {
  const {
    notifications,
    progresses,
    loading,
    error,
    selectedNotification,
    setSelectedNotification,
    editedNotification,
    setEditedNotification,
    errors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    notificationToDelete,
    setNotificationToDelete,
    handleSaveChanges,
    handleDelete,
  } = useNotifications();

  // Table columns
  const columns = [
    {
      title: "Thông Điệp",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={typeLabels[type]?.color}>
          {typeLabels[type]?.label || type}
        </Tag>
      ),
    },
    {
      title: "Thời Gian Gửi",
      dataIndex: "schedule",
      key: "schedule",
    },
    {
      title: "Tiến Độ",
      dataIndex: "progress_id",
      key: "progress_id",
      render: (id) => {
        const progress = progresses.find((p) => p._id === id);
        return progress
          ? `Giai đoạn ${progress.stage_id} - ${new Date(
              progress.date
            ).toLocaleDateString("vi-VN")}`
          : id;
      },
    },
    {
      title: "Trạng Thái",
      dataIndex: "is_sent",
      key: "is_sent",
      render: (is_sent) => (
        <Tag color={is_sent ? "green" : "gold"}>
          {is_sent ? "Đã gửi" : "Chưa gửi"}
        </Tag>
      ),
    },
  ];

  // Modal form content
  const modalForm = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Select
        placeholder="Chọn tiến độ"
        value={editedNotification.progress_id}
        onChange={(value) =>
          setEditedNotification({ ...editedNotification, progress_id: value })
        }
        status={errors.progress_id ? "error" : ""}
      >
        {progresses.map((progress) => (
          <Option key={progress._id} value={progress._id}>
            Giai đoạn {progress.stage_id} -{" "}
            {new Date(progress.date).toLocaleDateString("vi-VN")}
          </Option>
        ))}
      </Select>
      {errors.progress_id && (
        <div style={{ color: "#ff4d4f" }}>{errors.progress_id}</div>
      )}
      <Input.TextArea
        placeholder="Thông điệp thông báo"
        value={editedNotification.message}
        onChange={(e) =>
          setEditedNotification({
            ...editedNotification,
            message: e.target.value,
          })
        }
        rows={3}
        status={errors.message ? "error" : ""}
      />
      {errors.message && (
        <div style={{ color: "#ff4d4f" }}>{errors.message}</div>
      )}
      <Select
        placeholder="Loại thông báo"
        value={editedNotification.type}
        onChange={(value) =>
          setEditedNotification({ ...editedNotification, type: value })
        }
        status={errors.type ? "error" : ""}
      >
        <Option value="daily">Hàng ngày</Option>
        <Option value="weekly">Hàng tuần</Option>
        <Option value="motivation">Động lực</Option>
      </Select>
      {errors.type && <div style={{ color: "#ff4d4f" }}>{errors.type}</div>}
      <Input
        type="datetime-local"
        value={editedNotification.schedule}
        onChange={(e) =>
          setEditedNotification({
            ...editedNotification,
            schedule: e.target.value,
          })
        }
        status={errors.schedule ? "error" : ""}
      />
      {errors.schedule && (
        <div style={{ color: "#ff4d4f" }}>{errors.schedule}</div>
      )}
      <div>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={editedNotification.is_sent}
            onChange={(e) =>
              setEditedNotification({
                ...editedNotification,
                is_sent: e.target.checked,
              })
            }
            style={{ width: 16, height: 16 }}
          />
          Đánh dấu đã gửi
        </label>
      </div>
    </div>
  );

  // Loading
  if (loading && notifications.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" tip="Đang tải..." />
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
          dataSource={notifications}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: "Không có thông báo nào.",
          }}
        />
      </div>
      <Modal
        open={!!selectedNotification}
        title={isNew ? "Thêm Thông Báo Mới" : "Chỉnh Sửa Thông Báo"}
        onCancel={() => {
          setSelectedNotification(null);
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
          setNotificationToDelete(null);
        }}
        onOk={() => {
          handleDelete(notificationToDelete);
          setShowConfirm(false);
          setNotificationToDelete(null);
        }}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
        icon={<ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />}
        destroyOnClose
      >
        Bạn có chắc chắn muốn xóa thông báo này không?
      </Modal>
    </section>
  );
};

export default Notifications;
