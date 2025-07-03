import React, { useMemo } from "react";
import {
  Button,
  Modal,
  Table,
  Typography,
  Space,
  Form,
  Input,
  DatePicker,
} from "antd";
import dayjs from "dayjs";

const { Text } = Typography;

const StagesManager = ({
  visible,
  onClose,
  selectedPlanName,
  selectedStages = [],
  handleViewTasks,
  handleDeleteStage,
  stageLoading,
}) => {
  const columns = useMemo(
    () => [
      {
        title: "Giai đoạn",
        dataIndex: "stage_number",
        key: "stage_number",
        width: 60,
        render: (value) => value || "N/A",
      },
      {
        title: "Tiêu đề",
        dataIndex: "title",
        key: "title",
        render: (value) => value || "Không có tiêu đề",
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        key: "description",
        render: (value) => value || "Không có mô tả",
      },
      {
        title: "Bắt đầu",
        dataIndex: "start_date",
        key: "start_date",
        render: (date) =>
          date ? dayjs(date).format("DD/MM/YYYY") : "Không có ngày",
      },
      {
        title: "Kết thúc",
        dataIndex: "end_date",
        key: "end_date",
        render: (date) =>
          date ? dayjs(date).format("DD/MM/YYYY") : "Không có ngày",
      },
      {
        title: "Hành động",
        key: "actions",
        render: (_, record) => (
          <Space>
            <Button
              onClick={() => handleViewTasks(record)}
              disabled={!record?._id}
            >
              Quản lý nhiệm vụ
            </Button>
            <Button
              danger
              onClick={() => handleDeleteStage(record)}
              disabled={!record?._id}
            >
              Xóa giai đoạn
            </Button>
          </Space>
        ),
      },
    ],
    [handleViewTasks, handleDeleteStage]
  );

  const content = useMemo(() => {
    if (stageLoading) {
      return (
        <div className="text-center py-8">
          <Text type="secondary">Đang tải danh sách giai đoạn...</Text>
        </div>
      );
    }

    if (!selectedStages?.length) {
      return (
        <div className="text-center py-8">
          <Text type="secondary">Chưa có giai đoạn nào cho kế hoạch này</Text>
        </div>
      );
    }

    return (
      <Table
        rowKey={(record) => record?._id || record.stage_number}
        dataSource={selectedStages}
        columns={columns}
        pagination={false}
        loading={stageLoading}
      />
    );
  }, [stageLoading, selectedStages, columns]);

  return (
    <Modal
      open={visible}
      title={`Giai đoạn của kế hoạch: ${selectedPlanName}`}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnHidden
    >
      {content}
    </Modal>
  );
};

const CreateStageModal = ({
  visible,
  onClose,
  selectedPlan,
  stageForm,
  onSubmit,
}) => {
  return (
    <Modal
      open={visible}
      title={`Thêm Giai đoạn cho: ${
        selectedPlan?.plan_name || selectedPlan?.name || "Kế hoạch"
      }`}
      onCancel={onClose}
      onOk={onSubmit}
      okText="Tạo"
      cancelText="Huỷ"
      destroyOnHidden
    >
      <Form form={stageForm} layout="vertical">
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Nhập tiêu đề" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Nhập mô tả" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="start_date"
          label="Ngày bắt đầu"
          rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
        >
          <DatePicker format="DD/MM/YYYY" className="w-full" />
        </Form.Item>
        <Form.Item
          name="end_date"
          label="Ngày kết thúc"
          rules={[{ required: true, message: "Chọn ngày kết thúc" }]}
        >
          <DatePicker format="DD/MM/YYYY" className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export { StagesManager, CreateStageModal };
