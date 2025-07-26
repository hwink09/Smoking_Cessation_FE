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
        title={
          <div className="flex items-center gap-2">
            <span>📋 Quản lý nhiệm vụ - Giai đoạn:</span>
            <span className="text-blue-600 font-semibold">
              {selectedStage?.title || ""}
            </span>
          </div>
        }
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
                    <div className="flex justify-center items-center py-8">
                      <Spin size="large">
                        <div className="pt-8">
                          <Text type="secondary" className="text-center block">
                            Đang tải danh sách nhiệm vụ...
                          </Text>
                        </div>
                      </Spin>
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Text type="secondary" className="text-lg">
                        Chưa có nhiệm vụ nào cho giai đoạn này
                      </Text>
                      <div className="mt-4">
                        <Button
                          type="primary"
                          size="large"
                          onClick={() => setActiveTabKey("2")}
                        >
                          Thêm nhiệm vụ mới
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border shadow-sm rounded-lg p-4">
                      <List
                        itemLayout="horizontal"
                        dataSource={tasks}
                        renderItem={(task) => (
                          <List.Item
                            key={task._id}
                            className="border-b last:border-b-0 py-4"
                            actions={[
                              <Button
                                key="edit"
                                type="primary"
                                ghost
                                size="small"
                                onClick={() => handleEditTask(task)}
                              >
                                Chỉnh sửa
                              </Button>,
                              <Button
                                key="delete"
                                danger
                                size="small"
                                onClick={() => handleDeleteTask(task._id)}
                              >
                                Xóa
                              </Button>,
                            ]}
                          >
                            <List.Item.Meta
                              title={
                                <div className="font-medium text-gray-800">
                                  {task.title || "Không có tiêu đề"}
                                </div>
                              }
                              description={
                                <div className="text-gray-600 mt-1">
                                  {task.description || "Không có mô tả"}
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: "2",
              label: "Thêm nhiệm vụ mới",
              children: (
                <div className="bg-white border shadow-sm rounded-lg p-6">
                  <Form form={taskForm} layout="vertical">
                    <Form.Item
                      name="taskTitle"
                      label={
                        <span className="font-medium">Tiêu đề nhiệm vụ</span>
                      }
                      rules={[
                        { required: true, message: "Vui lòng nhập tiêu đề" },
                      ]}
                    >
                      <Input
                        placeholder="Nhập tiêu đề nhiệm vụ..."
                        className="rounded-lg"
                      />
                    </Form.Item>
                    <Form.Item
                      name="taskDescription"
                      label={
                        <span className="font-medium">Mô tả nhiệm vụ</span>
                      }
                      rules={[
                        { required: true, message: "Vui lòng nhập mô tả" },
                      ]}
                    >
                      <Input.TextArea
                        rows={4}
                        placeholder="Nhập mô tả chi tiết về nhiệm vụ..."
                        className="rounded-lg"
                      />
                    </Form.Item>
                    <Button
                      type="primary"
                      block
                      size="large"
                      onClick={handleAddTask}
                      loading={loading}
                      className="rounded-lg"
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
        title={
          <div className="flex items-center gap-2">
            <span>✏️ Chỉnh sửa nhiệm vụ</span>
          </div>
        }
        onCancel={() => setEditTaskModal(false)}
        onOk={handleSaveTask}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        confirmLoading={loading}
        width={600}
      >
        <div className="pt-4">
          <Form form={editTaskForm} layout="vertical">
            <Form.Item
              name="taskTitle"
              label={<span className="font-medium">Tiêu đề nhiệm vụ</span>}
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input
                placeholder="Nhập tiêu đề nhiệm vụ..."
                className="rounded-lg"
              />
            </Form.Item>
            <Form.Item
              name="taskDescription"
              label={<span className="font-medium">Mô tả nhiệm vụ</span>}
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Nhập mô tả chi tiết về nhiệm vụ..."
                className="rounded-lg"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default TasksManager;
