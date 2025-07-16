import { useEffect, useState } from "react";
import meetSessionService from "~/services/meetSessionService";
import { List, Card, Typography, Button } from "antd";

const { Text, Link } = Typography;

const UserSessionList = () => {
  const [sessions, setSessions] = useState([]);

  console.log("UserSessionList render");
  console.log("sessions state:", sessions);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await meetSessionService.getUserSessions();
        console.log("DATA LỊCH HẸN:", data);
        setSessions(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.log("LỖI LẤY LỊCH:", err);
      }
    };
    fetchSessions();
  }, []);

  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={sessions}
      renderItem={item => {
        console.log("item:", item);
        return (
          <List.Item>
            <Card title={`Coach: ${item.coach_id && item.coach_id.name ? item.coach_id.name : "Không rõ"}`}>
              <Text strong>Thời gian: </Text>
              {item.schedule_at && new Date(item.schedule_at).toLocaleString()}
              <br />
              <Text strong>Mục đích: </Text>{item.purpose}
              <br />
              {item.meet_link ? (
                <>
                  <Text strong>Google Meet: </Text>
                  <Link href={item.meet_link} target="_blank">{item.meet_link}</Link>
                  <Button type="primary" href={item.meet_link} target="_blank" style={{ marginLeft: 8 }}>
                    Tham gia ngay
                  </Button>
                </>
              ) : (
                <span style={{ color: 'red' }}>Chưa có link</span>
              )}
            </Card>
          </List.Item>
        );
      }}
    />
  );
};

export default UserSessionList; 