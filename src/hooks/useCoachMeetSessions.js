import { useEffect, useState } from "react";
import { message } from "antd";
import meetSessionService from "../services/meetSessionService";

export const useCoachMeetSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await meetSessionService.getCoachSessions();
      setSessions(data);
    } catch (err) {
      message.error("Lỗi khi tải danh sách buổi hẹn",err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, meet_link) => {
    try {
      await meetSessionService.updateSessionStatus(id, {
        status,
        ...(meet_link && { meet_link }),
      });
      message.success("Cập nhật thành công");
      fetchSessions();
    } catch (err) {
      message.error("Cập nhật thất bại",err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return {
    sessions,
    loading,
    fetchSessions,
    updateStatus,
  };
};
