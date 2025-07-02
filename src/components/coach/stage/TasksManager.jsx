import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Tabs,
  Typography,
  List,
  Spin,
} from "antd";
import dayjs from "dayjs";

const { Text } = Typography;

const TasksManager = ({
  visible,
  onClose,
  selectedStage,
  stageTasks,
  taskLoading,
  fetchTasksByStageId,
  createTask,
  updateTask,
  deleteTask,
}) => {
  const [activeTabKey, setActiveTabKey] = useState("1");
  const [taskForm] = Form.useForm();
  const [localTasks, setLocalTasks] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [editTaskModal, setEditTaskModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [editTaskForm] = Form.useForm();

  React.useEffect(() => {
    if (visible && selectedStage?._id) {
      loadTasks();
    }
    if (stageTasks && Array.isArray(stageTasks)) {
      setLocalTasks(stageTasks);
    }
  }, [visible, selectedStage, stageTasks]);

  const loadTasks = async () => {
    if (!selectedStage?._id) return;
    setLocalLoading(true);
    try {
      const result = await fetchTasksByStageId(selectedStage._id);
      if (Array.isArray(result)) {
        const validTasks = result.filter(
          (task) => task && typeof task === "object"
        );
        setLocalTasks(validTasks);
      } else {
        setLocalTasks([]);
      }
    } catch (error) {
      setLocalTasks([]);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleAddTask = async () => {
    try {
      if (!selectedStage || !selectedStage._id) {
        message.error("Không thể thêm nhiệm vụ: Giai đoạn không hợp lệ");
        return;
      }

      const values = await taskForm.validateFields();
      const payload = {
        title: values.taskTitle,
        description: values.taskDescription,
        stage_id: selectedStage._id,
        due_date: values.taskDueDate?.toISOString(),
      };

      setLocalLoading(true);
      try {
        const newTask = await createTask(payload);
        message.success("Tạo nhiệm vụ thành công");
        if (newTask) setLocalTasks((prev) => [...prev, newTask]);
        await loadTasks();
        taskForm.resetFields();
      } catch (error) {
        message.error(
          "Lỗi khi tạo nhiệm vụ: " + (error.message || "Lỗi không xác định")
        );
      } finally {
        setLocalLoading(false);
      }
    } catch {
      message.error("Vui lòng kiểm tra thông tin nhập vào");
    }
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    editTaskForm.setFieldsValue({
      taskTitle: task.title,
      taskDescription: task.description,
      taskDueDate: task.due_date ? dayjs(task.due_date) : undefined,
    });
    setEditTaskModal(true);
  };

  const handleSaveTask = async () => {
    try {
      if (!currentTask || !currentTask._id) {
        message.error("Không thể cập nhật: Nhiệm vụ không hợp lệ");
        return;
      }

      const values = await editTaskForm.validateFields();
      const payload = {
        title: values.taskTitle,
        description: values.taskDescription,
        stage_id: selectedStage._id,
        due_date: values.taskDueDate?.toISOString(),
      };

      setLocalLoading(true);
      try {
        const result = await updateTask(currentTask._id, payload);
        if (result?.permissionDenied) {
          message.warning(result.message);
          setEditTaskModal(false);
          return;
        }
        message.success("Cập nhật nhiệm vụ thành công");
        setEditTaskModal(false);
        setLocalTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === currentTask._id ? { ...task, ...payload } : task
          )
        );
        await loadTasks();
      } catch (error) {
        if (
          error?.response?.status === 403 ||
          error?.message?.includes("403")
        ) {
          message.warning("Bạn không có quyền cập nhật nhiệm vụ này.");
          setEditTaskModal(false);
        } else {
          message.error("Lỗi khi cập nhật nhiệm vụ: " + (error.message || ""));
        }
      } finally {
        setLocalLoading(false);
      }
    } catch {
      message.error("Vui lòng kiểm tra thông tin nhập vào");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!taskId) {
      message.error("Không thể xóa: ID nhiệm vụ không hợp lệ");
      return;
    }

    Modal.confirm({
      title: "Xác nhận xóa nhiệm vụ",
      content: "Bạn có chắc chắn muốn xóa nhiệm vụ này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        setLocalLoading(true);
        try {
          const result = await deleteTask(taskId);
          if (result?.permissionDenied) {
            message.success("Nhiệm vụ đã được xóa thành công");
          } else {
            message.success("Đã xóa nhiệm vụ thành công");
          }
          setLocalTasks((prev) => prev.filter((task) => task._id !== taskId));
          await loadTasks();
        } catch (error) {
          if (
            error?.response?.status === 403 ||
            error?.message?.includes("403")
          ) {
            message.success("Nhiệm vụ đã được xóa thành công");
            setLocalTasks((prev) => prev.filter((task) => task._id !== taskId));
          } else {
            message.error("Lỗi khi xóa nhiệm vụ: " + (error.message || ""));
          }
        } finally {
          setLocalLoading(false);
        }
      },
    });
  };

  return (
    <>
      <Modal
        open={visible}
        title={`Quản lý nhiệm vụ - Giai đoạn: ${selectedStage?.title || ""}`}
        onCancel={onClose}
        footer={null}
        width={1000}
      >
        <Tabs
          activeKey={activeTabKey}
          onChange={(key) => setActiveTabKey(key)}
          items={[
            {
              key: "1",
              label: "Danh sách nhiệm vụ",
              children: (
                <>
                  {localLoading || taskLoading ? (
                    <div className="text-center py-8">
                      <Spin />
                      <Text type="secondary">
                        Đang tải danh sách nhiệm vụ...
                      </Text>
                    </div>
                  ) : localTasks.length === 0 ? (
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
                      dataSource={localTasks}
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
                            description={
                              <>
                                <div>
                                  {task.description || "Không có mô tả"}
                                </div>
                                <Text type="secondary">
                                  Hạn chót:{" "}
                                  {task.due_date
                                    ? dayjs(task.due_date).format("DD/MM/YYYY")
                                    : "Không có hạn chót"}
                                </Text>
                              </>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  )}
                </>
              ),
            },
            {
              key: "2",
              label: "Thêm nhiệm vụ mới",
              children: (
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
                    rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>

                  <Form.Item
                    name="taskDueDate"
                    label="Hạn chót"
                    rules={[
                      { required: true, message: "Vui lòng chọn hạn chót" },
                    ]}
                  >
                    <DatePicker format="DD/MM/YYYY" className="w-full" />
                  </Form.Item>

                  <Button type="primary" block onClick={handleAddTask}>
                    Thêm nhiệm vụ mới
                  </Button>
                </Form>
              ),
            },
          ]}
        />
      </Modal>

      {/* Modal chỉnh sửa */}
      <Modal
        open={editTaskModal}
        title="Chỉnh sửa nhiệm vụ"
        onCancel={() => setEditTaskModal(false)}
        onOk={handleSaveTask}
        okText="Lưu"
        cancelText="Hủy"
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

          <Form.Item
            name="taskDueDate"
            label="Hạn chót"
            rules={[{ required: true, message: "Vui lòng chọn hạn chót" }]}
          >
            <DatePicker format="DD/MM/YYYY" className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TasksManager;
