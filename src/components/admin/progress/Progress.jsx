import React from "react";
import { Table, Modal, Input, Select, Tag, Spin } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import useProgressAdmin from "~/hooks/useProgressAdmin";

const { Option } = Select;

const Progress = () => {
  const {
    progress,
    loading,
    error,
    selectedProgress,
    setSelectedProgress,
    stages,
    users,
    editedProgress,
    setEditedProgress,
    errors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    progressToDelete,
    setProgressToDelete,
    handleSaveChanges,
    handleDelete,
  } = useProgressAdmin();

  // Table columns
  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Số điếu thuốc đã hút",
      dataIndex: "cigarettes_smoked",
      key: "cigarettes_smoked",
    },
    {
      title: "Số tiền tiết kiệm",
      dataIndex: "money_saved",
      key: "money_saved",
      render: (money) => `${money} VND`,
    },
    {
      title: "Giai đoạn",
      dataIndex: ["stage_id", "title"],
      key: "stage_id",
      render: (_, record) => record.stage_id?.title || record.stage_id || "N/A",
    },
    {
      title: "Người dùng",
      dataIndex: ["user_id", "name"],
      key: "user_id",
      render: (_, record) => record.user_id?.name || record.user_id || "N/A",
    },
  ];

  // Modal form content
  const modalForm = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Select
        placeholder="Chọn một giai đoạn"
        value={editedProgress.stage_id}
        onChange={(value) =>
          setEditedProgress({ ...editedProgress, stage_id: value })
        }
        status={errors.stage_id ? "error" : ""}
      >
        {stages.map((stage) => (
          <Option key={stage._id} value={stage._id}>
            {stage.title} - Giai đoạn {stage.stage_number}
          </Option>
        ))}
      </Select>
      {errors.stage_id && (
        <div style={{ color: "#ff4d4f" }}>{errors.stage_id}</div>
      )}
      <Select
        placeholder="Chọn một người dùng"
        value={editedProgress.user_id}
        onChange={(value) =>
          setEditedProgress({ ...editedProgress, user_id: value })
        }
        status={errors.user_id ? "error" : ""}
      >
        {users.map((user) => (
          <Option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </Option>
        ))}
      </Select>
      {errors.user_id && (
        <div style={{ color: "#ff4d4f" }}>{errors.user_id}</div>
      )}
      <Input
        type="date"
        placeholder="Ngày"
        value={editedProgress.date}
        onChange={(e) =>
          setEditedProgress({ ...editedProgress, date: e.target.value })
        }
        status={errors.date ? "error" : ""}
      />
      {errors.date && <div style={{ color: "#ff4d4f" }}>{errors.date}</div>}
      <Input
        placeholder="Trạng thái hút thuốc ban đầu"
        value={editedProgress.health_stat || ""}
        onChange={(e) =>
          setEditedProgress({ ...editedProgress, health_stat: e.target.value })
        }
        status={errors.health_stat ? "error" : ""}
      />
      {errors.health_stat && (
        <div style={{ color: "#ff4d4f" }}>{errors.health_stat}</div>
      )}
      <Input
        type="number"
        placeholder="Số điếu thuốc đã hút"
        value={editedProgress.cigarettes_smoked}
        onChange={(e) =>
          setEditedProgress({
            ...editedProgress,
            cigarettes_smoked: e.target.value,
          })
        }
        status={errors.cigarettes_smoked ? "error" : ""}
      />
      {errors.cigarettes_smoked && (
        <div style={{ color: "#ff4d4f" }}>{errors.cigarettes_smoked}</div>
      )}
      <Input
        type="number"
        placeholder="Số tiền tiết kiệm (VND)"
        value={editedProgress.money_saved}
        onChange={(e) =>
          setEditedProgress({ ...editedProgress, money_saved: e.target.value })
        }
        status={errors.money_saved ? "error" : ""}
      />
      {errors.money_saved && (
        <div style={{ color: "#ff4d4f" }}>{errors.money_saved}</div>
      )}
    </div>
  );

  // Loading
  if (loading && progress.length === 0) {
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
          dataSource={progress}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: "Không tìm thấy bản ghi tiến trình nào.",
          }}
        />
      </div>
      <Modal
        open={!!selectedProgress}
        title={isNew ? "Thêm tiến trình mới" : "Chỉnh sửa tiến trình"}
        onCancel={() => {
          setSelectedProgress(null);
          setIsNew(false);
        }}
        onOk={handleSaveChanges}
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
          setProgressToDelete(null);
        }}
        onOk={() => {
          handleDelete(progressToDelete);
          setShowConfirm(false);
          setProgressToDelete(null);
        }}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
        icon={<ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />}
        destroyOnHidden
      >
        Bạn có chắc chắn muốn xóa bản ghi tiến trình này không?
      </Modal>
    </section>
  );
};

export default Progress;
