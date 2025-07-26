import React, { useState } from "react";
import { Form, Typography, Spin } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { useCoachMeetSessions } from "~/hooks/useCoachMeetSessions";
import MeetSessionTable from "./MeetSessionTable";
import MeetLinkModal from "./MeetLinkModal";

const { Title } = Typography;

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

  const handleModalConfirm = async (sessionId, status, meetLink) => {
    await updateStatus(sessionId, status, meetLink);
    setModalVisible(false);
    form.resetFields();
  };

  const handleComplete = (sessionId, status) => {
    updateStatus(sessionId, status);
  };

  // Loading state như progress component
  if (loading && sessions.length === 0) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Spin size="large">
          <div className="pt-8">
            <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
          </div>
        </Spin>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Tiêu đề trung tâm */}
        <div className="text-center mb-6">
          <Title
            level={2}
            className="!m-0 text-gray-800 flex justify-center items-center"
          >
            <CalendarOutlined className="mr-2" />
            Buổi Hẹn Với Học Viên
          </Title>
        </div>

        {/* Bảng buổi hẹn */}
        <div className="bg-white border shadow-sm rounded-2xl p-4">
          <Title level={4} className="mb-4">
            Danh sách buổi hẹn chi tiết
          </Title>

          <MeetSessionTable
            sessions={sessions}
            loading={loading}
            onStatusUpdate={handleStatusUpdate}
            onComplete={handleComplete}
          />
        </div>
      </div>

      <MeetLinkModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleModalConfirm}
        selectedSession={selectedSession}
        form={form}
      />
    </div>
  );
};

export default CoachMeetSession;
