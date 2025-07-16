import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Table, Button, Form, message, Modal, Typography } from "antd";
import dayjs from "dayjs";
import api from "~/services/api";
import { useAuth } from "~/hooks/useAuth";
import { useStageService } from "~/hooks/useStageService";
import { useTaskData } from "~/hooks/useTaskData";
import {
  validateStageSequence,
  getNextStageNumber,
} from "~/utils/coachValidation";
import { StagesManager, CreateStageModal } from "./StagesManager";
import TasksManager from "./TasksManager";

const { Title } = Typography;

const StagesCoach = () => {
  const { currentUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewStagesModal, setViewStagesModal] = useState(false);
  const [selectedStages, setSelectedStages] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [taskModal, setTaskModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [lastStageInfo, setLastStageInfo] = useState(null);

  const {
    createStage,
    fetchStagesByPlanId,
    deleteStage,
    loading: stageLoading,
  } = useStageService();

  const taskServices = useTaskData();

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
    } catch (error) {
      console.error("Fetch plans error:", error);
      message.error("Lỗi khi lấy danh sách kế hoạch");
    } finally {
      setLoading(false);
    }
  }, [currentUser, getPlanId]);

  const validateStageDate = useCallback(
    async (startDate, endDate, planId) => {
      return await validateStageSequence(
        startDate,
        endDate,
        planId,
        fetchStagesByPlanId
      );
    },
    [fetchStagesByPlanId]
  );

  const handleOpenModal = useCallback(
    async (plan) => {
      setSelectedPlan({ ...plan, _id: getPlanId(plan) });
      form.resetFields();

      // Get last stage info for hint
      try {
        const planId = getPlanId(plan);
        const stages = await fetchStagesByPlanId(planId);
        if (stages && stages.length > 0) {
          const sortedStages = stages.sort(
            (a, b) => new Date(b.end_date) - new Date(a.end_date)
          );
          setLastStageInfo({
            stageNumber: sortedStages[0].stage_number,
            endDate: sortedStages[0].end_date,
            title: sortedStages[0].title,
          });
        } else {
          setLastStageInfo(null);
        }
      } catch (error) {
        console.error("Error fetching last stage:", error);
        setLastStageInfo(null);
      }

      setOpenModal(true);
    },
    [form, getPlanId, fetchStagesByPlanId]
  );

  const handleViewStages = useCallback(
    async (plan) => {
      const planId = getPlanId(plan);
      if (!planId) return message.error("Không tìm thấy kế hoạch");

      try {
        const stages = await fetchStagesByPlanId(planId);
        const sortedStages = Array.isArray(stages)
          ? stages.sort((a, b) => (a.stage_number || 0) - (b.stage_number || 0))
          : [];

        setSelectedStages(sortedStages);
        setCurrentPlan(plan);
        setViewStagesModal(true);
      } catch (error) {
        console.error("Fetch stages error:", error);
        message.error("Lỗi khi lấy danh sách giai đoạn");
      }
    },
    [getPlanId, fetchStagesByPlanId]
  );

  const handleSubmit = useCallback(async () => {
    try {
      const planId = getPlanId(selectedPlan);
      if (!planId) return message.error("Không xác định được kế hoạch");

      const values = await form.validateFields();

      // Validate dates using the validation hook
      const validation = await validateStageDate(
        values.start_date,
        values.end_date,
        planId
      );

      if (!validation.valid) {
        return message.error(validation.message);
      } // Get next stage number
      const nextNumber = await getNextStageNumber(planId, fetchStagesByPlanId);

      const payload = {
        ...values,
        plan_id: planId,
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.toISOString(),
        stage_number: nextNumber,
      };

      await createStage(payload);
      message.success(`Đã tạo giai đoạn ${nextNumber} thành công`);
      setOpenModal(false);

      // Refresh stages if viewing
      if (viewStagesModal && currentPlan) {
        handleViewStages(currentPlan);
      }
    } catch (error) {
      console.error("Create stage error:", error);
      message.error("Lỗi khi tạo giai đoạn");
    }
  }, [
    selectedPlan,
    form,
    validateStageDate,
    createStage,
    viewStagesModal,
    currentPlan,
    getPlanId,
    handleViewStages,
    fetchStagesByPlanId,
  ]);

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

            // Refresh stages list
            if (currentPlan) {
              await handleViewStages(currentPlan);
            }
          } catch (error) {
            console.error("Delete stage error:", error);
            message.error("Lỗi khi xóa: " + (error.message || ""));
          }
        },
      });
    },
    [deleteStage, currentPlan, handleViewStages]
  );

  const handleViewTasks = useCallback((stage) => {
    setSelectedStage(stage);
    setTaskModal(true);
  }, []);

  const handleCloseTaskModal = useCallback(() => {
    setTaskModal(false);
    setSelectedStage(null);
  }, []);

  const memoizedStage = useMemo(() => {
    if (!selectedStage?._id) return null;
    return {
      _id: selectedStage._id,
      title: selectedStage.title || "Giai đoạn",
    };
  }, [selectedStage]);

  const selectedPlanName = useMemo(() => {
    return currentPlan?.plan_name || currentPlan?.name || "Kế hoạch";
  }, [currentPlan]);

  useEffect(() => {
    fetchQuitPlans();
  }, [fetchQuitPlans]);

  const columns = useMemo(
    () => [
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
    ],
    [handleOpenModal, handleViewStages]
  );

  return (
    <section className="p-10 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white">
      <Title level={2} style={{ textAlign: "center", color: "#fff" }}>
        Các kế hoạch bỏ thuốc được giao cho bạn
      </Title>

      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
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
          lastStageInfo={lastStageInfo}
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
          selectedStage={memoizedStage}
          {...taskServices}
        />
      </div>
    </section>
  );
};

export default StagesCoach;
