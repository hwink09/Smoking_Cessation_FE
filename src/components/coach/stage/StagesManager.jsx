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
import {
  getSuggestedStartDate,
  createEndDateValidator,
  createStartDateValidator,
  getDisabledStartDates,
  getStartDatePlaceholder,
  formatStageInfo,
  getStageFormRules,
} from "~/utils/coachValidation";

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
        title: "Số thứ tự",
        dataIndex: "stage_number",
        key: "stage_number",
        width: 100,
        render: (value) => (
          <div className="font-semibold text-blue-600">{value || "N/A"}</div>
        ),
        sorter: (a, b) => (a.stage_number || 0) - (b.stage_number || 0),
      },
      {
        title: "Tiêu đề",
        dataIndex: "title",
        key: "title",
        render: (value) => (
          <div className="font-medium">{value || "Không có tiêu đề"}</div>
        ),
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        key: "description",
        render: (value) => (
          <div className="text-gray-600 max-w-xs truncate">
            {value || "Không có mô tả"}
          </div>
        ),
      },
      {
        title: "Ngày bắt đầu",
        dataIndex: "start_date",
        key: "start_date",
        render: (date) => (
          <div className="text-green-600 font-medium">
            {date ? dayjs(date).format("DD/MM/YYYY") : "Chưa có ngày"}
          </div>
        ),
      },
      {
        title: "Ngày kết thúc",
        dataIndex: "end_date",
        key: "end_date",
        render: (date) => (
          <div className="text-red-600 font-medium">
            {date ? dayjs(date).format("DD/MM/YYYY") : "Chưa có ngày"}
          </div>
        ),
      },
      {
        title: "Hành động",
        key: "actions",
        width: 250,
        render: (_, record) => (
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={() => handleViewTasks(record)}
              disabled={!record?._id}
            >
              Quản lý nhiệm vụ
            </Button>
            <Button
              danger
              size="small"
              onClick={() => handleDeleteStage(record)}
              disabled={!record?._id}
            >
              Xóa
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
          <div className="mt-4">
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Vui lòng thêm giai đoạn đầu tiên để bắt đầu quản lý kế hoạch
            </Text>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <Text strong style={{ color: "#1890ff" }}>
            Tổng số giai đoạn: {selectedStages.length}
          </Text>
        </div>
        <Table
          rowKey={(record) => record?._id || record.stage_number}
          dataSource={selectedStages}
          columns={columns}
          pagination={false}
          loading={stageLoading}
          size="small"
        />
      </div>
    );
  }, [stageLoading, selectedStages, columns]);

  return (
    <Modal
      open={visible}
      title={
        <div className="flex items-center gap-2">
          <span>📋 Giai đoạn của kế hoạch:</span>
          <span className="text-blue-600 font-semibold">
            {selectedPlanName}
          </span>
        </div>
      }
      onCancel={onClose}
      footer={null}
      width={1000}
      destroyOnClose
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
  lastStageInfo,
}) => {
  // Get form rules
  const formRules = getStageFormRules();

  // Create validators using utility functions
  const validateEndDate = createEndDateValidator(stageForm);
  const validateStartDate = createStartDateValidator(stageForm, lastStageInfo);

  // Get utility functions
  const suggestedStartDate = getSuggestedStartDate(lastStageInfo);
  const disabledStartDates = getDisabledStartDates(lastStageInfo);
  const startDatePlaceholder = getStartDatePlaceholder(lastStageInfo);

  return (
    <Modal
      open={visible}
      title={
        <div className="flex items-center gap-2">
          <span>➕ Thêm giai đoạn mới cho:</span>
          <span className="text-blue-600 font-semibold">
            {selectedPlan?.plan_name || selectedPlan?.name || "Kế hoạch"}
          </span>
        </div>
      }
      onCancel={onClose}
      onOk={onSubmit}
      okText="Tạo giai đoạn"
      cancelText="Hủy"
      destroyOnClose
      width={600}
    >
      <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
        <Text type="warning" style={{ fontSize: "12px" }}>
          ⚠️ Lưu ý: Ngày bắt đầu giai đoạn mới phải sau ngày kết thúc giai đoạn
          trước
        </Text>
        {lastStageInfo && (
          <div className="mt-2">
            <Text style={{ fontSize: "12px", color: "#1890ff" }}>
              💡 Giai đoạn gần nhất: {formatStageInfo(lastStageInfo)}
            </Text>
          </div>
        )}
        {!lastStageInfo && (
          <div className="mt-2">
            <Text style={{ fontSize: "12px", color: "#52c41a" }}>
              🎯 Đây sẽ là giai đoạn đầu tiên của kế hoạch
            </Text>
          </div>
        )}
      </div>

      <Form form={stageForm} layout="vertical">
        <Form.Item
          name="title"
          label="Tiêu đề giai đoạn"
          rules={formRules.title}
        >
          <Input placeholder="Nhập tiêu đề cho giai đoạn..." />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả giai đoạn"
          rules={formRules.description}
        >
          <Input.TextArea
            rows={4}
            placeholder="Mô tả chi tiết về giai đoạn này..."
            showCount
            maxLength={500}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="start_date"
            label={
              <div className="flex items-center gap-2">
                <span>Ngày bắt đầu</span>
                {lastStageInfo && (
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      stageForm.setFieldsValue({
                        start_date: suggestedStartDate,
                      });
                    }}
                    style={{ padding: 0, height: "auto", fontSize: "11px" }}
                  >
                    (Gợi ý: {suggestedStartDate.format("DD/MM/YYYY")})
                  </Button>
                )}
              </div>
            }
            rules={[{ validator: validateStartDate }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              className="w-full"
              placeholder={startDatePlaceholder}
              disabledDate={disabledStartDates}
            />
          </Form.Item>

          <Form.Item
            name="end_date"
            label="Ngày kết thúc"
            rules={[{ validator: validateEndDate }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              className="w-full"
              placeholder="Chọn ngày kết thúc"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export { StagesManager, CreateStageModal };
