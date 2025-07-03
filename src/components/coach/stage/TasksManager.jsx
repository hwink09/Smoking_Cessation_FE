import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  Tabs,
  Typography,
  List,
  Spin,
} from "antd";

const { Text } = Typography;

const TasksManager = ({
  visible,
  onClose,
  selectedStage,
  fetchTasksByStageId,
  createTask,
  updateTask,
  deleteTask,
}) => {
  const [activeTabKey, setActiveTabKey] = useState("1");
  const [taskForm] = Form.useForm();
  const [editTaskForm] = Form.useForm();

  const [tasks, setTasks] = useState([]);
  const [editTaskModal, setEditTaskModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadedStageId, setLoadedStageId] = useState(null);

  const stageId = useMemo(() => selectedStage?._id || null, [selectedStage]);
  const loadTasks = useCallback(async () => {
    if (!stageId || loadedStageId === stageId) return;
    setLoading(true);
    try {
      const result = await fetchTasksByStageId(stageId);
      setTasks(Array.isArray(result) ? result.filter(Boolean) : []);
      setLoadedStageId(stageId);
    } catch {
      message.error("Không thể tải danh sách nhiệm vụ");
    } finally {
      setLoading(false);
    }
  }, [stageId, fetchTasksByStageId, loadedStageId]);

  const resetState = useCallback(() => {
    setActiveTabKey("1");
    setTasks([]);
    setLoadedStageId(null);
    setEditTaskModal(false);
    setCurrentTask(null);
    taskForm.resetFields();
    editTaskForm.resetFields();
  }, [taskForm, editTaskForm]);

  const handleCloseModal = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  useEffect(() => {
    if (visible && stageId) {
      loadTasks();
    }
  }, [visible, stageId, loadTasks]);

  const handleAddTask = useCallback(async () => {
    try {
      const values = await taskForm.validateFields();
      if (!stageId) return message.error("Giai đoạn không hợp lệ");

      setLoading(true);
      const newTask = await createTask({
        title: values.taskTitle,
        description: values.taskDescription,
        stage_id: stageId,
      });
      if (newTask) {
        setTasks((prev) => [...prev, newTask]);
        message.success("Tạo nhiệm vụ thành công");
        taskForm.resetFields();
      }
    } catch (err) {
      message.error(err?.message || "Vui lòng kiểm tra thông tin");
    } finally {
      setLoading(false);
    }
  }, [stageId, createTask, taskForm]);

  const handleEditTask = useCallback(
    (task) => {
      setCurrentTask(task);
      editTaskForm.setFieldsValue({
        taskTitle: task.title,
        taskDescription: task.description,
      });
      setEditTaskModal(true);
    },
    [editTaskForm]
  );

  const handleSaveTask = useCallback(async () => {
    try {
      const values = await editTaskForm.validateFields();
      if (!currentTask?._id || !stageId) {
        return message.error("Dữ liệu không hợp lệ");
      }

      setLoading(true);
      const result = await updateTask(currentTask._id, {
        title: values.taskTitle,
        description: values.taskDescription,
        stage_id: stageId,
      });

      if (result?.permissionDenied) {
        message.warning(result.message || "Không có quyền chỉnh sửa");
      } else {
        setTasks((prev) =>
          prev.map((t) =>
            t._id === currentTask._id
              ? {
                  ...t,
                  title: values.taskTitle,
                  description: values.taskDescription,
                }
              : t
          )
        );
        message.success("Cập nhật nhiệm vụ thành công");
        setEditTaskModal(false);
      }
    } catch (err) {
      message.error(err?.message || "Vui lòng kiểm tra thông tin");
    } finally {
      setLoading(false);
    }
  }, [currentTask, stageId, updateTask, editTaskForm]);

  const handleDeleteTask = useCallback(
    (taskId) => {
      if (!taskId) return;
      Modal.confirm({
        title: "Xác nhận xóa nhiệm vụ",
        content: "Bạn có chắc chắn muốn xóa nhiệm vụ này không?",
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk: async () => {
          setLoading(true);
          try {
            await deleteTask(taskId);
            setTasks((prev) => prev.filter((task) => task._id !== taskId));
            message.success("Đã xóa nhiệm vụ");
          } catch (err) {
            message.error(err?.message || "Lỗi khi xóa nhiệm vụ");
          } finally {
            setLoading(false);
          }
        },
      });
    },
    [deleteTask]
  );

  return (
    <>
      <Modal
        open={visible}
        title={`Quản lý nhiệm vụ - Giai đoạn: ${selectedStage?.title || ""}`}
        onCancel={handleCloseModal}
        footer={null}
        width={1000}
      >
        <Tabs
          activeKey={activeTabKey}
          onChange={setActiveTabKey}
          items={[
            {
              key: "1",
              label: "Danh sách nhiệm vụ",
              children: (
                <div>
                  {loading ? (
                    <div className="text-center py-8">
                      <Spin />
                      <Text type="secondary">
                        Đang tải danh sách nhiệm vụ...
                      </Text>
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="text-center py-8">
                      <Text type="secondary">
                        Chưa có nhiệm vụ nào cho giai đoạn này
                      </Text>
                      <div className="mt-3">
                        <Button
                          type="primary"
                          onClick={() => setActiveTabKey("2")}
                        >
                          Thêm nhiệm vụ mới
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <List
                      itemLayout="horizontal"
                      dataSource={tasks}
                      renderItem={(task) => (
                        <List.Item
                          key={task._id}
                          actions={[
                            <Button
                              key="edit"
                              type="link"
                              onClick={() => handleEditTask(task)}
                            >
                              Chỉnh sửa
                            </Button>,
                            <Button
                              key="delete"
                              type="link"
                              danger
                              onClick={() => handleDeleteTask(task._id)}
                            >
                              Xóa
                            </Button>,
                          ]}
                        >
                          <List.Item.Meta
                            title={task.title || "Không có tiêu đề"}
                            description={task.description || "Không có mô tả"}
                          />
                        </List.Item>
                      )}
                    />
                  )}
                </div>
              ),
            },
            {
              key: "2",
              label: "Thêm nhiệm vụ mới",
              children: (
                <div>
                  <Form form={taskForm} layout="vertical">
                    <Form.Item
                      name="taskTitle"
                      label="Tiêu đề nhiệm vụ"
                      rules={[
                        { required: true, message: "Vui lòng nhập tiêu đề" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="taskDescription"
                      label="Mô tả nhiệm vụ"
                      rules={[
                        { required: true, message: "Vui lòng nhập mô tả" },
                      ]}
                    >
                      <Input.TextArea rows={4} />
                    </Form.Item>
                    <Button
                      type="primary"
                      block
                      onClick={handleAddTask}
                      loading={loading}
                    >
                      Thêm nhiệm vụ mới
                    </Button>
                  </Form>
                </div>
              ),
            },
          ]}
        />
      </Modal>

      <Modal
        open={editTaskModal}
        title="Chỉnh sửa nhiệm vụ"
        onCancel={() => setEditTaskModal(false)}
        onOk={handleSaveTask}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={editTaskForm} layout="vertical">
          <Form.Item
            name="taskTitle"
            label="Tiêu đề nhiệm vụ"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="taskDescription"
            label="Mô tả nhiệm vụ"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TasksManager;
