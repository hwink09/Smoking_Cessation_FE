import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Table, Button, Form, message, Modal } from "antd";
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
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewStagesModal, setViewStagesModal] = useState(false);
  const [selectedStages, setSelectedStages] = useState([]);
  const [selectedPlanName, setSelectedPlanName] = useState("");
  const [currentPlan, setCurrentPlan] = useState(null);
  const [taskModal, setTaskModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);

  const {
    createStage,
    fetchStagesByPlanId,
    deleteStage,
    loading: stageLoading,
  } = useStageService();

  const { createTask, fetchTasksByStageId, updateTask, deleteTask } =
    useTaskData();

  const getPlanId = useCallback(
    (plan) => plan?._id || plan?.plan_id || plan?.id || null,
    []
  );

  const fetchQuitPlans = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await api.get("/quitPlan/my-users");
      const data = Array.isArray(res.data) ? res.data : [];
      setPlans(
        data.map((plan, index) => ({
          ...plan,
          key: getPlanId(plan) || `temp-${index}`,
          _id: getPlanId(plan) || `temp-${index}`,
        }))
      );
    } catch {
      message.error("Lỗi khi lấy danh sách kế hoạch");
    } finally {
      setLoading(false);
    }
  }, [currentUser, getPlanId]);

  const handleOpenModal = (plan) => {
    setSelectedPlan({ ...plan, _id: getPlanId(plan) });
    form.resetFields();
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    try {
      const planId = getPlanId(selectedPlan);
      if (!planId) return message.error("Không xác định được kế hoạch");

      const values = await form.validateFields();
      const stages = await fetchStagesByPlanId(planId);
      const nextNumber =
        stages.length > 0
          ? Math.max(...stages.map((s) => s.stage_number || 0)) + 1
          : 1;

      const payload = {
        ...values,
        plan_id: planId,
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.toISOString(),
        stage_number: nextNumber,
      };

      await createStage(payload);
      message.success("Tạo giai đoạn thành công");
      setOpenModal(false);
    } catch {
      message.error("Lỗi khi tạo giai đoạn");
    }
  };

  const handleViewStages = async (plan) => {
    const planId = getPlanId(plan);
    if (!planId) return message.error("Không tìm thấy kế hoạch");

    try {
      const stages = await fetchStagesByPlanId(planId);
      setSelectedStages(Array.isArray(stages) ? stages : []);
      setSelectedPlanName(plan.plan_name || plan.name || "Kế hoạch");
      setCurrentPlan(plan);
      setViewStagesModal(true);
    } catch {
      message.error("Lỗi khi lấy danh sách giai đoạn");
    }
  };

  const handleDeleteStage = useCallback(
    async (stage) => {
      if (!stage?._id) return message.error("Không tìm thấy giai đoạn");

      Modal.confirm({
        title: "Xác nhận xóa giai đoạn",
        content: `Bạn có chắc chắn muốn xóa giai đoạn "${
          stage.title || "Không có tên"
        }"?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk: async () => {
          try {
            await deleteStage(stage._id);
            message.success("Đã xóa giai đoạn");

            if (currentPlan) {
              const planId = getPlanId(currentPlan);
              const stages = await fetchStagesByPlanId(planId);
              setSelectedStages(Array.isArray(stages) ? stages : []);
            }
          } catch (error) {
            message.error("Lỗi khi xóa: " + (error.message || ""));
          }
        },
      });
    },
    [currentPlan, deleteStage, fetchStagesByPlanId, getPlanId]
  );

  const handleViewTasks = useCallback((stage) => {
    setSelectedStage(stage);
    setTaskModal(true);
  }, []);

  const handleCloseTaskModal = useCallback(() => {
    setTaskModal(false);
    setSelectedStage(null);
  }, []);

  const memoStage = useMemo(() => {
    if (!selectedStage?._id) return null;
    return {
      _id: selectedStage._id,
      title: selectedStage.title || "Giai đoạn",
    };
  }, [selectedStage]);

  const taskServices = useMemo(
    () => ({ fetchTasksByStageId, createTask, updateTask, deleteTask }),
    [fetchTasksByStageId, createTask, updateTask, deleteTask]
  );

  useEffect(() => {
    fetchQuitPlans();
  }, [fetchQuitPlans]);

  const columns = [
    {
      title: "Tên kế hoạch",
      dataIndex: "plan_name",
      render: (text) => text || "Không có tên",
    },
    {
      title: "Người dùng",
      dataIndex: "name",
      render: (text, record) => text || record?.user_id?.name || "Không rõ",
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => text || record?.user_id?.email || "Không rõ",
    },
    {
      title: "Thời gian",
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
        stageForm={form} // truyền đúng form
        onSubmit={handleSubmit}
      />

      <StagesManager
        visible={viewStagesModal}
        onClose={() => setViewStagesModal(false)}
        selectedPlanName={selectedPlanName}
        selectedStages={selectedStages}
        handleViewTasks={handleViewTasks}
        handleDeleteStage={handleDeleteStage}
        stageLoading={stageLoading}
      />

      <TasksManager
        visible={taskModal}
        onClose={handleCloseTaskModal}
        selectedStage={memoStage}
        {...taskServices}
      />
    </div>
  );
};

export default StagesCoach;
