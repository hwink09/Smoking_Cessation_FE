import { useEffect, useState } from "react";
import { Row, Col, Spin } from "antd";
import useCoachData from "~/hooks/useCoachData";

import BookSessionModal from "~/components/user/meetSession/BookSessionModal";
import CoachCard from "~/components/user/meetSession/CoachCard";


const MeetSessionPage = () => {
  const { getAllCoaches, loading } = useCoachData();
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);

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
    <div className="p-6 min-h-screen bg-gray-100">
  <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#6a5af9] to-[#1ecbe1] text-transparent bg-clip-text">
           Chọn huấn luyện viên
         </h1>

      {loading ? (
        <Spin />
      ) : (
        <Row gutter={[16, 16]}>
          {coaches.map((coach) => (
            <Col key={coach.id} xs={24} sm={12} md={8}>
              <CoachCard coach={coach} onSelectCoach={() => setSelectedCoach(coach)} />
            </Col>
          ))}
        </Row>
      )}

      <BookSessionModal
        open={!!selectedCoach}
        coach={selectedCoach}
        onClose={() => setSelectedCoach(null)}
      />
    </div>
  );
};

export default MeetSessionPage;
