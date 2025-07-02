// File: src/pages/StagesCoach.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Form, message } from "antd";
import dayjs from "dayjs";
import api from "~/services/api";
import { useAuth } from "~/hooks/useAuth";
import { useStageService } from "~/hooks/useStageService";
import { useTaskData } from "~/hooks/useTaskData";
import { StagesManager, CreateStageModal } from "./StagesManager";
import TasksManager from "./TasksManager";

const StagesCoach = () => {
  const { currentUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form] = Form.useForm();

  const [viewStagesModal, setViewStagesModal] = useState(false);
  const [selectedStages, setSelectedStages] = useState([]);
  const [selectedPlanName, setSelectedPlanName] = useState("");

  const [taskModal, setTaskModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [stageTasks, setStageTasks] = useState([]);

  const {
    createStage,
    fetchStagesByPlanId,
    loading: stageLoading,
  } = useStageService();
  const {
    createTask,
    fetchTasksByStageId,
    updateTask,
    deleteTask,
    loading: taskLoading,
  } = useTaskData();

  const getPlanId = (plan) => plan?._id || plan?.plan_id || plan?.id || null;

  const fetchQuitPlans = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await api.get("/quitPlan/my-users");
      if (!Array.isArray(res.data)) {
        message.error("Định dạng dữ liệu API không như mong đợi");
        return;
      }
      const plansWithKeys = res.data.map((plan, index) => {
        const planId = getPlanId(plan) || `temp-plan-${index}`;
        return {
          ...plan,
          key: planId,
          _id: planId,
        };
      });
      setPlans(plansWithKeys);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách kế hoạch");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const handleOpenModal = (plan) => {
    setSelectedPlan({ ...plan, _id: getPlanId(plan) });
    setOpenModal(true);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const planId = getPlanId(selectedPlan);
      if (!planId) return message.error("Không thể xác định ID của kế hoạch");
      const values = await form.validateFields();
      const existingStages = await fetchStagesByPlanId(planId);
      const nextStageNumber =
        existingStages.length > 0
          ? Math.max(...existingStages.map((s) => s.stage_number || 0)) + 1
          : 1;
      const payload = {
        ...values,
        plan_id: planId,
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.toISOString(),
        stage_number: nextStageNumber,
      };
      await createStage(payload);
      message.success("Tạo giai đoạn thành công");
      setOpenModal(false);
      fetchQuitPlans();
    } catch (error) {
      message.error("Lỗi khi tạo giai đoạn");
    }
  };

  const handleViewStages = async (plan) => {
    const planId = getPlanId(plan);
    if (!planId) return message.error("Không tìm thấy ID của kế hoạch");
    try {
      const stages = await fetchStagesByPlanId(planId);
      setSelectedStages(Array.isArray(stages) ? stages : []);
      setSelectedPlanName(plan.plan_name || plan.name || "Kế hoạch");
      setViewStagesModal(true);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách giai đoạn");
      setSelectedStages([]);
      setViewStagesModal(true);
    }
  };

  const fetchStageTasks = async (stageId) => {
    setLoading(true);
    try {
      if (!stageId) return [];
      const tasks = await fetchTasksByStageId(stageId);
      const validTasks = Array.isArray(tasks)
        ? tasks.filter((task) => task && typeof task === "object")
        : [];
      setStageTasks(validTasks);
      return validTasks;
    } catch (error) {
      message.error("Lỗi khi lấy danh sách công việc");
      setStageTasks([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleViewTasks = async (stage) => {
    setSelectedStage(stage);
    await fetchStageTasks(stage._id);
    setTaskModal(true);
  };

  useEffect(() => {
    fetchQuitPlans();
  }, [fetchQuitPlans, currentUser]);

  const columns = [
    {
      title: "Tên kế hoạch",
      dataIndex: "plan_name",
      key: "plan_name",
      render: (text) => text || "Không có tên",
    },
    {
      title: "Người dùng",
      dataIndex: "name",
      key: "name",
      render: (text, record) => text || record?.user_id?.name || "Không rõ",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) => text || record?.user_id?.email || "Không rõ",
    },
    {
      title: "Thời gian",
      key: "timeframe",
      render: (record) => {
        try {
          return `${dayjs(record.start_date).format("DD/MM/YYYY")} - ${dayjs(
            record.target_quit_date
          ).format("DD/MM/YYYY")}`;
        } catch {
          return "Không rõ thời gian";
        }
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => handleOpenModal(record)}>
            Thêm Giai đoạn
          </Button>
          <Button onClick={() => handleViewStages(record)}>
            Xem Giai đoạn
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">
        Quản lý Giai đoạn và Nhiệm vụ
      </h2>

      <Table
        rowKey="key"
        dataSource={plans}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <CreateStageModal
        visible={openModal}
        onClose={() => setOpenModal(false)}
        selectedPlan={selectedPlan}
        stageForm={form}
        onSubmit={handleSubmit}
      />

      <StagesManager
        visible={viewStagesModal}
        onClose={() => setViewStagesModal(false)}
        selectedPlanName={selectedPlanName}
        selectedStages={selectedStages}
        handleViewTasks={handleViewTasks}
        stageLoading={stageLoading}
      />

      <TasksManager
        visible={taskModal}
        onClose={() => setTaskModal(false)}
        selectedStage={selectedStage}
        stageTasks={stageTasks}
        taskLoading={taskLoading}
        fetchTasksByStageId={fetchTasksByStageId}
        createTask={createTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
    </div>
  );
};

export default StagesCoach;
