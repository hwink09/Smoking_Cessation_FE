import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table,
  Tag,
  Avatar,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  DatePicker,
  Empty,
} from "antd";
import dayjs from "dayjs";
import { useAuth } from "~/hooks/useAuth";
import { useQuitPlanData } from "~/hooks/useQuitPlanData";

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

  const columns = useMemo(
    () => [
      {
        title: "Người dùng",
        key: "user",
        render: (_, record) => (
          <div className="flex items-center gap-2">
            <Avatar src={record.user_id.avatar_url} />
            <div>
              <div>{record.user_id.name}</div>
              <div className="text-gray-400 text-xs">
                {record.user_id.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Tên kế hoạch",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Lý do",
        dataIndex: "reason",
        key: "reason",
      },
      {
        title: "Ngày bắt đầu",
        dataIndex: "start_date",
        key: "start_date",
        render: (date) => dayjs(date).format("DD/MM/YYYY"),
      },
      {
        title: "Ngày bỏ thuốc",
        dataIndex: "target_quit_date",
        key: "target_quit_date",
        render: (date) => dayjs(date).format("DD/MM/YYYY"),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const colors = {
            approved: "green",
            rejected: "red",
            created: "blue",
            pending: "orange",
          };
          return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
        },
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => {
          const { status, _id } = record;
          if (status === "pending") {
            return (
              <div className="flex gap-2">
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleApprove(_id)}
                >
                  Duyệt
                </Button>
                <Popconfirm
                  title="Bạn có chắc muốn từ chối yêu cầu này?"
                  onConfirm={() => handleReject(_id)}
                  okText="Từ chối"
                  cancelText="Hủy"
                >
                  <Button danger size="small">
                    Từ chối
                  </Button>
                </Popconfirm>
              </div>
            );
          }

          if (status === "approved") {
            return (
              <Button
                type="primary"
                size="small"
                onClick={() => showCreateModal(record)}
              >
                Tạo kế hoạch
              </Button>
            );
          }

          return <span>-</span>;
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleApprove, handleReject]
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">
        Danh sách yêu cầu kế hoạch
      </h2>
      <Table
        rowKey="_id"
        loading={loading || localLoading}
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 5 }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có yêu cầu kế hoạch nào từ người dùng chọn bạn làm huấn luyện viên"
            />
          ),
        }}
      />

      <Modal
        title="Tạo kế hoạch từ yêu cầu"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={handleCreatePlan}
        okText="Tạo kế hoạch"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Tên kế hoạch"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên kế hoạch" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Lý do"
            name="reason"
            rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Ngày bắt đầu"
            name="start_date"
            rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
          >
            <DatePicker format="DD/MM/YYYY" className="w-full" />
          </Form.Item>

          <Form.Item
            label="Ngày bỏ thuốc"
            name="target_quit_date"
            rules={[{ required: true, message: "Chọn ngày bỏ thuốc" }]}
          >
            <DatePicker format="DD/MM/YYYY" className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RequestQuitPlan;
