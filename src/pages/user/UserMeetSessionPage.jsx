import { useEffect, useState } from "react";
import { Row, Col, Spin, Button } from "antd";
import useCoachData from "~/hooks/useCoachData";
import UserSessionModalAll from "~/components/user/meetSession/UserSessionModalAll";
import BookSessionModal from "~/components/user/meetSession/BookSessionModal";
import CoachCard from "~/components/user/meetSession/CoachCard";

const UserMeetSessionPage = () => {
  const { getAllCoaches, loading } = useCoachData();
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const data = await getAllCoaches();
        setCoaches(data);
      } catch (error) {
        console.error("Không thể tải danh sách huấn luyện viên", error);
      }
    };
    fetchCoaches();
  }, [getAllCoaches]);

  return (
    <div className="w-full h-full p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#6a5af9] to-[#1ecbe1] text-transparent bg-clip-text">
          Yêu cầu tư vấn
        </h1>
        <Button onClick={() => setShowSessionModal(true)} type="primary">
          Xem lịch tư vấn
        </Button>
      </div>

      {loading ? (
        <Spin />
      ) : (
        <Row gutter={[16, 16]}>
          {coaches.map((coach, index) => (
            <Col
              key={coach.id || coach._id || coach.coach_id?.id || index}
              xs={24}
              sm={12}
              md={8}
            >
              <CoachCard
                coach={coach}
                onSelectCoach={() => setSelectedCoach(coach)}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Modal đặt lịch */}
      <BookSessionModal
        open={!!selectedCoach}
        coach={selectedCoach}
        onClose={() => setSelectedCoach(null)}
      />

      {/* Modal xem tất cả lịch tư vấn của học viên */}
      <UserSessionModalAll
        open={showSessionModal}
        onClose={() => setShowSessionModal(false)}
      />
    </div>
  );
};

export default UserMeetSessionPage;
