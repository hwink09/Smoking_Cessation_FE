import React from "react";
import { Table, Button, Modal, Input, Select, Tag, Spin } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import useStages from "~/hooks/useStages";
import { useTaskData } from "~/hooks/useTaskData";
import ColourfulText from "~/components/ui/colourful-text";
import TasksManager from "./TasksManager";

const { Option } = Select;

// Tìm ngày kết thúc lớn nhất của các stage hiện tại (chỉ khi tạo mới)
function getPrevEndDate(stages) {
  if (!stages || stages.length === 0) return null;
  const sorted = [...stages].sort(
    (a, b) => new Date(a.end_date) - new Date(b.end_date)
  );
  return sorted[sorted.length - 1].end_date;
}
function getNextDay(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

const Stage = ({ planId }) => {
  const {
    stages,
    plans,
    loading,
    error,
    selectedStage,
    setSelectedStage,
    editedStage,
    setEditedStage,
    errors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    stageToDelete,
    setStageToDelete,
    openEditModal,
    openNewModal,
    handleSaveChanges,
    handleDelete,
  } = useStages(planId);

  const [taskModalOpen, setTaskModalOpen] = React.useState(false);
  const [selectedStageForTask, setSelectedStageForTask] = React.useState(null);
  const { fetchTasksByStageId, createTask, updateTask, deleteTask } =
    useTaskData();

  const handleOpenTaskModal = (stage) => {
    setSelectedStageForTask(stage);
    setTaskModalOpen(true);
  };
  const handleCloseTaskModal = () => {
    setTaskModalOpen(false);
    setSelectedStageForTask(null);
  };

  // Table columns
  const columns = [
    {
      title: "Giai đoạn #",
      dataIndex: "stage_number",
      key: "stage_number",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Kế hoạch",
      dataIndex: "plan_id",
      key: "plan_id",
      render: (id) => plans.find((p) => p._id === id)?.name || id,
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
      title: "Trạng thái",
      dataIndex: "is_completed",
      key: "is_completed",
      render: (is_completed) => (
        <Tag color={is_completed ? "green" : "gold"}>
          {is_completed ? "Hoàn thành" : "Đang thực hiện"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "right",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleOpenTaskModal(record)}>
            Nhiệm vụ
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setStageToDelete(record._id);
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
  const prevEndDate = isNew ? getPrevEndDate(stages) : null;
  const minStartDate = prevEndDate ? getNextDay(prevEndDate) : undefined;
  const modalForm = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* <Select
        placeholder="Chọn một kế hoạch"
        value={editedStage.plan_id}
        onChange={value => setEditedStage({ ...editedStage, plan_id: value })}
        status={errors.plan_id ? "error" : ""}
      >
        {plans.map(plan => (
          <Option key={plan._id} value={plan._id}>{plan.name}</Option>
        ))}
      </Select>
      {errors.plan_id && <div style={{ color: "#ff4d4f" }}>{errors.plan_id}</div>} */}
      <Input
        placeholder="Tiêu đề giai đoạn"
        value={editedStage.title}
        onChange={(e) =>
          setEditedStage({ ...editedStage, title: e.target.value })
        }
        status={errors.title ? "error" : ""}
      />
      {errors.title && <div style={{ color: "#ff4d4f" }}>{errors.title}</div>}
      <Input.TextArea
        placeholder="Mô tả giai đoạn"
        value={editedStage.description}
        onChange={(e) =>
          setEditedStage({ ...editedStage, description: e.target.value })
        }
        status={errors.description ? "error" : ""}
        rows={4}
      />
      {errors.description && (
        <div style={{ color: "#ff4d4f" }}>{errors.description}</div>
      )}
      <Input
        type="number"
        placeholder="Số thứ tự giai đoạn"
        value={editedStage.stage_number}
        onChange={(e) =>
          setEditedStage({ ...editedStage, stage_number: e.target.value })
        }
        status={errors.stage_number ? "error" : ""}
      />
      {errors.stage_number && (
        <div style={{ color: "#ff4d4f" }}>{errors.stage_number}</div>
      )}
      <Input
        type="date"
        placeholder="Ngày bắt đầu"
        value={editedStage.start_date}
        min={minStartDate}
        onChange={(e) =>
          setEditedStage({ ...editedStage, start_date: e.target.value })
        }
        status={errors.start_date ? "error" : ""}
      />
      {errors.start_date && (
        <div style={{ color: "#ff4d4f" }}>{errors.start_date}</div>
      )}
      <Input
        type="date"
        placeholder="Ngày kết thúc"
        value={editedStage.end_date}
        onChange={(e) =>
          setEditedStage({ ...editedStage, end_date: e.target.value })
        }
        status={errors.end_date ? "error" : ""}
      />
      {errors.end_date && (
        <div style={{ color: "#ff4d4f" }}>{errors.end_date}</div>
      )}
      <Button
        type={editedStage.is_completed ? "default" : "primary"}
        onClick={() =>
          setEditedStage({
            ...editedStage,
            is_completed: !editedStage.is_completed,
          })
        }
        style={{ marginTop: 8 }}
      >
        {editedStage.is_completed
          ? "Đánh dấu chưa hoàn thành"
          : "Đánh dấu hoàn thành"}
      </Button>
    </div>
  );

  // Loading
  if (loading && stages.length === 0) {
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
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2
          style={{
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 8,
            color: "black",
          }}
        >
          Quản lý <ColourfulText text="Giai đoạn" />
        </h2>
        <p style={{ color: "#666", fontSize: 18 }}>
          Quản lý và tổ chức các giai đoạn cho các kế hoạch cai thuốc lá
        </p>
      </div>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto 32px auto",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          shape="round"
          size="large"
          onClick={openNewModal}
        >
          Thêm giai đoạn
        </Button>
      </div>
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
          dataSource={stages}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: "Không tìm thấy giai đoạn nào.",
          }}
        />
      </div>
      <Modal
        open={!!selectedStage}
        title={isNew ? "Thêm giai đoạn mới" : "Chỉnh sửa giai đoạn"}
        onCancel={() => {
          setSelectedStage(null);
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
          setStageToDelete(null);
        }}
        onOk={() => {
          handleDelete(stageToDelete);
          setShowConfirm(false);
          setStageToDelete(null);
        }}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
        icon={<ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />}
        destroyOnHidden
      >
        Bạn có chắc chắn muốn xóa giai đoạn này không?
      </Modal>
      <Modal
        open={taskModalOpen}
        onCancel={handleCloseTaskModal}
        footer={null}
        width={1000}
        title={`Quản lý nhiệm vụ - Giai đoạn: ${
          selectedStageForTask?.title || ""
        }`}
        destroyOnHidden
      >
        {taskModalOpen && (
          <TasksManager
            visible={taskModalOpen}
            onClose={handleCloseTaskModal}
            selectedStage={selectedStageForTask}
            fetchTasksByStageId={fetchTasksByStageId}
            createTask={createTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        )}
      </Modal>
    </section>
  );
};

export default Stage;
