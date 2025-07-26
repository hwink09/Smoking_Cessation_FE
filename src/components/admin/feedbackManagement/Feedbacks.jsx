import React from "react";
import { Table, Button, Modal, Input, Select, Spin, Rate } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import useFeedbacks from "~/hooks/useFeedbacks";

const { Option } = Select;

const feedbackTypeLabels = {
  user_to_coach: {
    label: "Phản hồi Huấn luyện viên",
    icon: <UserOutlined style={{ color: "#60a5fa" }} />,
  },
  user_to_plan: {
    label: "Phản hồi Kế hoạch",
    icon: <MessageOutlined style={{ color: "#34d399" }} />,
  },
  user_to_system: {
    label: "Phản hồi Hệ thống",
    icon: <MessageOutlined style={{ color: "#a78bfa" }} />,
  },
};

const FeedbackManagement = () => {
  const {
    feedbacks,
    loading,
    error,
    editingFeedback,
    setEditingFeedback,
    newData,
    setNewData,
    errors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    feedbackToDelete,
    setFeedbackToDelete,
    filteredFeedbacks,
    handleEdit,
    handleSave,
    handleDelete,
    handleStatusUpdate,
  } = useFeedbacks();

  // Table columns
  const columns = [
    {
      title: "Loại phản hồi",
      dataIndex: "feedback_type",
      key: "feedback_type",
      render: (type) => (
        <span>
          {feedbackTypeLabels[type]?.icon} {feedbackTypeLabels[type]?.label}
        </span>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        new Date(date || Date.now()).toLocaleDateString("vi-VN"),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <Rate
          disabled
          value={rating || 0}
          count={5}
          allowHalf
          style={{ fontSize: 16 }}
        />
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
    },
    {
      title: "Người gửi",
      dataIndex: ["user_id", "name"],
      key: "user_id",
      render: (_, record) =>
        record.user_id?.name || record.user_id?.email || "N/A",
    },
    {
      title: "Huấn luyện viên",
      dataIndex: ["coach_id", "name"],
      key: "coach_id",
      render: (_, record) => record.coach_id?.name || "N/A",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status || "pending"}
          onChange={(value) => handleStatusUpdate(record._id, value)}
          style={{ width: 120 }}
        >
          <Option value="pending">Chờ duyệt</Option>
          <Option value="approved">Đã duyệt</Option>
          <Option value="hidden">Đã ẩn</Option>
        </Select>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setFeedbackToDelete(record._id);
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
      <Rate
        value={newData.rating}
        onChange={(value) => setNewData({ ...newData, rating: value })}
        count={5}
        allowHalf
      />
      {errors.rating && <div style={{ color: "#ff4d4f" }}>{errors.rating}</div>}
      <Input.TextArea
        placeholder="Nội dung phản hồi"
        value={newData.content}
        onChange={(e) => setNewData({ ...newData, content: e.target.value })}
        rows={4}
        status={errors.content ? "error" : ""}
      />
      {errors.content && (
        <div style={{ color: "#ff4d4f" }}>{errors.content}</div>
      )}
      <Select
        placeholder="Loại phản hồi"
        value={newData.feedback_type}
        onChange={(value) => setNewData({ ...newData, feedback_type: value })}
        status={errors.feedback_type ? "error" : ""}
      >
        <Option value="user_to_system">Phản hồi Hệ thống</Option>
        <Option value="user_to_coach">Phản hồi Huấn luyện viên</Option>
        <Option value="user_to_plan">Phản hồi Kế hoạch</Option>
      </Select>
      {errors.feedback_type && (
        <div style={{ color: "#ff4d4f" }}>{errors.feedback_type}</div>
      )}
      <Select
        placeholder="Trạng thái"
        value={newData.status}
        onChange={(value) => setNewData({ ...newData, status: value })}
        status={errors.status ? "error" : ""}
      >
        <Option value="pending">Chờ duyệt</Option>
        <Option value="approved">Đã duyệt</Option>
        <Option value="hidden">Đã ẩn</Option>
      </Select>
      {errors.status && <div style={{ color: "#ff4d4f" }}>{errors.status}</div>}
    </div>
  );

  // Loading
  if (loading && feedbacks.length === 0) {
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
          dataSource={filteredFeedbacks}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: "Không tìm thấy phản hồi nào.",
          }}
        />
      </div>
      <Modal
        open={!!editingFeedback}
        title={isNew ? "Thêm Phản hồi Mới" : "Chỉnh sửa Phản hồi"}
        onCancel={() => {
          setEditingFeedback(null);
          setIsNew(false);
        }}
        onOk={handleSave}
        confirmLoading={loading}
        okText={isNew ? "Thêm" : "Lưu"}
        cancelText="Hủy"
        destroyOnHidden
      >
        {modalForm}
      </Modal>
      <Modal
        open={showConfirm}
        title="Xác nhận xoá"
        onCancel={() => {
          setShowConfirm(false);
          setFeedbackToDelete(null);
        }}
        onOk={() => {
          handleDelete(feedbackToDelete);
          setShowConfirm(false);
          setFeedbackToDelete(null);
        }}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
        icon={<ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />}
        destroyOnHidden
      >
        Bạn có chắc chắn muốn xóa phản hồi này không?
      </Modal>
    </section>
  );
};

export default FeedbackManagement;
