import React, { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useCoachMeetSessions } from "~/hooks/useCoachMeetSessions";


const { Title } = Typography;

const statusColors = {
  pending: "orange",
  accepted: "green",
  rejected: "red",
  completed: "blue",
};

const CoachMeetSession = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [form] = Form.useForm();

  const { sessions, loading, updateStatus } = useCoachMeetSessions();

  const handleStatusUpdate = (session, status) => {
    setSelectedSession(session);
    if (status === "accepted") {
      form.setFieldsValue({ meet_link: session.meet_link || "" });
      setModalVisible(true);
    } else {
      updateStatus(session._id, status);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await updateStatus(selectedSession._id, "accepted", values.meet_link);
      setModalVisible(false);
      form.resetFields();
    } catch (err) {
      message.error("Vui lòng điền đầy đủ thông tin" ,err);
    }
  };

  const columns = [
    {
      title: "Học viên",
      dataIndex: ["user_id", "name"],
      key: "user",
    },
    {
      title: "Email",
      dataIndex: ["user_id", "email"],
      key: "email",
    },
    {
      title: "Mục đích",
      dataIndex: "purpose",
      key: "purpose",
    },
    {
      title: "Thời gian",
      dataIndex: "schedule_at",
      key: "schedule",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Link họp",
      dataIndex: "meet_link",
      key: "meet_link",
      width: 200,
      render: (link) =>
        link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            Google Meet
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => {
        const actions = [];

        if (record.status === "pending") {
          actions.push(
            <Button
              type="primary"
              size="small"
              onClick={() => handleStatusUpdate(record, "accepted")}
              key="accept">
              Chấp nhận
            </Button>
          );
          actions.push(
            <Button
              danger
              size="small"
              onClick={() => handleStatusUpdate(record, "rejected")}
              key="reject">
              Từ chối
            </Button>
          );
        }

        if (record.status === "accepted") {
          actions.push(
            <Button
              size="small"
              type="dashed"
              onClick={() => updateStatus(record._id, "completed")}
              key="complete">
              Hoàn tất
            </Button>
          );
        }

        return <Space>{actions}</Space>;
      },
    },
  ];

  return (
    <section className="p-10 bg-white min-h-screen text-black">
      <Title level={2} style={{ textAlign: "center" }}>
        Buổi Hẹn Với Học Viên
      </Title>

      <div className="mt-6 bg-white rounded-xl shadow p-6 max-w-7xl mx-auto">
        <Table
          columns={columns}
          dataSource={sessions}
          rowKey={(record) => record._id}
          loading={loading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        title="Xác nhận buổi hẹn"
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText="Xác nhận"
        cancelText="Huỷ">
        <Form form={form} layout="vertical">
          <Form.Item
            name="meet_link"
            label="Link cuộc họp (Google Meet, Zoom...)"
            rules={[{ required: true, message: "Vui lòng nhập link" }]}>
            <Input placeholder="https://meet.google.com/..." />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default CoachMeetSession;
