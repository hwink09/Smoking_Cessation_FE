import React, { useMemo } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Table,
  Typography,
} from "antd";
import dayjs from "dayjs";

const { Text } = Typography;

const StagesManager = ({
  visible,
  onClose,
  selectedPlanName,
  selectedStages = [],
  handleViewTasks,
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
        title: "Nhiệm vụ",
        key: "tasks",
        render: (_, record) => (
          <Button
            onClick={() => handleViewTasks(record)}
            disabled={!record || !record._id}
          >
            Quản lý nhiệm vụ
          </Button>
        ),
      },
    ],
    [handleViewTasks]
  );

  return (
    <Modal
      open={visible}
      title={`Giai đoạn của kế hoạch: ${selectedPlanName}`}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {stageLoading ? (
        <div className="text-center py-8">
          <Text type="secondary">Đang tải danh sách giai đoạn...</Text>
        </div>
      ) : !Array.isArray(selectedStages) || selectedStages.length === 0 ? (
        <div className="text-center py-8">
          <Text type="secondary">Chưa có giai đoạn nào cho kế hoạch này</Text>
        </div>
      ) : (
        <Table
          rowKey={(record) => record._id || `stage-${record.stage_number}`}
          dataSource={selectedStages}
          columns={columns}
          pagination={false}
          loading={stageLoading}
        />
      )}
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
