import React, { useEffect, useState, useCallback } from "react";
import { message, Form } from "antd";
import dayjs from "dayjs";
import { useAuth } from "~/hooks/useAuth";
import { useQuitPlanData } from "~/hooks/useQuitPlanData";
import PageHeader from "./PageHeader";
import RequestTable from "./RequestTable";
import CreatePlanModal from "./CreatePlanModal";

const RequestQuitPlan = () => {
  const { currentUser } = useAuth();
  const {
    allRequests,
    loading,
    fetchAllRequests,
    approveQuitPlanRequest,
    rejectQuitPlanRequest,
    createQuitPlan,
  } = useQuitPlanData();

  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [localLoading, setLocalLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLocalLoading(true);
      await fetchAllRequests();
    } catch (error) {
      message.error("Lỗi khi lấy danh sách yêu cầu");
      console.error(error);
    } finally {
      setLocalLoading(false);
    }
  }, [fetchAllRequests]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    if (currentUser?.userId) {
      const filtered = allRequests.filter(
        (req) => req.coach_id === currentUser.userId
      );
      setData(filtered);
    }
  }, [allRequests, currentUser]);

  const updateRequestStatus = (id, status) => {
    setData((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status } : item))
    );
  };

  const handleStatusChange = async (actionFn, id, statusMsg, statusKey) => {
    try {
      await actionFn(id, {});
      message.success(statusMsg);
      updateRequestStatus(id, statusKey);
    } catch {
      message.error(`Lỗi khi ${statusMsg.toLowerCase()}`);
    }
  };

  const handleApprove = (id) =>
    handleStatusChange(
      approveQuitPlanRequest,
      id,
      "Đã duyệt kế hoạch",
      "approved"
    );

  const handleReject = (id) =>
    handleStatusChange(
      rejectQuitPlanRequest,
      id,
      "Đã từ chối kế hoạch",
      "rejected"
    );

  const showCreateModal = (record) => {
    setSelectedRequest(record);
    form.setFieldsValue({
      name: record.name,
      reason: record.reason,
      start_date: dayjs(record.start_date),
      target_quit_date: dayjs(record.target_quit_date),
    });
    setOpenModal(true);
  };

  const handleCreatePlan = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        user_id: selectedRequest.user_id._id,
        name: values.name,
        reason: values.reason,
        start_date: values.start_date,
        target_quit_date: values.target_quit_date,
        request_id: selectedRequest._id,
      };

      await createQuitPlan(payload);
      message.success("Tạo kế hoạch thành công!");
      setOpenModal(false);
      updateRequestStatus(selectedRequest._id, "created");
    } catch (error) {
      if (error.response?.status === 409) {
        message.warning("Người dùng đã có kế hoạch trong thời gian này.");
      } else {
        message.error("Lỗi khi tạo kế hoạch");
      }
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader />

        <RequestTable
          data={data}
          loading={loading || localLoading}
          onApprove={handleApprove}
          onReject={handleReject}
          onCreatePlan={showCreateModal}
        />

        <CreatePlanModal
          open={openModal}
          onCancel={() => setOpenModal(false)}
          onOk={handleCreatePlan}
          form={form}
          selectedRequest={selectedRequest}
        />
      </div>
    </div>
  );
};

export default RequestQuitPlan;
