import { useState } from "react";

import {
  Card,
  Avatar,
  Skeleton,
  Row,
  Col,
  Typography,
  Alert,
  Rate,
  Tag,
  Divider,
  Button,
} from "antd";
import {
  StarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  MessageOutlined,
  UserOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import QuitPlanModal from "./QuitPlanModal";

import { message } from "antd";
import { useQuitPlanData } from "~/hooks/useQuitPlanData";
import useCoachData from "~/hooks/useCoachData";

const { Title, Paragraph, Text } = Typography;

const LoadingSkeleton = () => (
  <div className="py-10 px-6 bg-gray-50 min-h-screen">
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-sm">
      <Skeleton.Input
        active
        size="large"
        className="w-80 h-10 block mx-auto mb-10"
      />
      <Row gutter={[24, 24]}>
        {[...Array(6)].map((_, i) => (
          <Col xs={24} sm={12} lg={8} key={i}>
            <Card loading={true} className="rounded-xl border-gray-200" />
          </Col>
        ))}
      </Row>
    </div>
  </div>
);

const CoachCard = ({ coach, onSelectCoach }) => {
  const name = coach.coach_id?.name || "Ẩn danh";
  const avatar = coach.coach_id?.avatar_url || "";

  const handleSelectCoach = () => {
    onSelectCoach?.(coach);
  };

  return (
    <Card
      hoverable
      className="rounded-xl border-gray-200 shadow-sm bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      bodyStyle={{ padding: "24px" }}
    >
      <div className="flex items-center mb-5 pb-4 border-b border-gray-100">
        <Avatar
          size={72}
          src={avatar}
          icon={<UserOutlined />}
          className="mr-4 border-2 border-gray-100 shadow-md"
        />
        <div className="flex-1">
          <Title
            level={4}
            className="m-0 mb-1 text-gray-800 text-lg font-semibold"
          >
            {name}
          </Title>
          <Tag
            color="blue"
            className="text-xs px-2 py-1 rounded-md border-0 bg-blue-50 text-blue-600"
          >
            {coach.specialization}
          </Tag>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="mb-4">
        <div className="flex items-center mb-3 p-3 bg-gray-50 rounded-lg">
          <ClockCircleOutlined className="text-green-500 mr-2 text-base" />
          <Text className="text-gray-600 text-sm">
            Kinh nghiệm: <Text strong>{coach.experience_years} năm</Text>
          </Text>
        </div>

        <div className="flex items-center mb-3 p-3 bg-gray-50 rounded-lg">
          <TeamOutlined className="text-blue-500 mr-2 text-base" />
          <Text className="text-gray-600 text-sm">
            Buổi hỗ trợ: <Text strong>{coach.total_sessions}</Text>
          </Text>
        </div>

        <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
          <StarOutlined className="text-yellow-500 mr-2 text-base" />
          <Text className="text-gray-600 text-sm mr-2">Đánh giá:</Text>
          <Rate disabled defaultValue={coach.rating_avg} allowHalf />
          <Text strong className="ml-2 text-sm">
            ({coach.rating_avg})
          </Text>
        </div>
      </div>

      {/* Giới thiệu */}
      <Divider className="my-4" />
      <div className="mb-6">
        <div className="flex items-start mb-2">
          <MessageOutlined className="text-purple-500 mr-2 mt-0.5 text-sm" />
          <Text strong className="text-sm">
            Giới thiệu:
          </Text>
        </div>
        <Paragraph
          className="text-gray-600 text-sm leading-relaxed m-0 ml-6"
          ellipsis={{ rows: 3, expandable: true, symbol: "Xem thêm" }}
        >
          {coach.bio}
        </Paragraph>
      </div>

      {/* Button chọn coach */}
      <div className="pt-4 border-t border-gray-100">
        <Button
          type="primary"
          size="large"
          icon={<CheckOutlined />}
          onClick={handleSelectCoach}
          className="w-full h-12 rounded-lg"
        >
          Chọn cho tôi
        </Button>
      </div>
    </Card>
  );
};

const CoachCardList = () => {
  const { coaches, loading, error } = useCoachData();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const { sendQuitPlanRequest } = useQuitPlanData();

  const handleSubmit = async (formData) => {
    try {
      const coachId =
        selectedCoach?.coach_id?._id ||
        selectedCoach?.coach_id ||
        selectedCoach?._id;
      if (!coachId) {
        message.error("Không xác định được coach!");
        return;
      }
      await sendQuitPlanRequest({ coach_id: coachId, ...formData });
      message.success("Gửi yêu cầu cho coach thành công!");
      setIsModalVisible(false);
    } catch (err) {
      message.error("Gửi yêu cầu cho coach thất bại! " + (err?.message || ""));
    }
  };

  const handleSelectCoach = (coach) => {
    setSelectedCoach(coach);
    setIsModalVisible(true);
  };

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="py-10 px-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">
          <Alert
            type="error"
            message="Không thể tải danh sách huấn luyện viên"
            description="Vui lòng thử lại sau hoặc liên hệ với quản trị viên."
            showIcon
            className="rounded-lg border-red-200"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-sm">
        {/* Header */}
        <div className="text-center mb-10 pb-6 border-b-2 border-gray-200">
          <Title
            level={2}
            className="text-gray-800 text-3xl font-semibold mb-2"
          >
            Đội Ngũ Huấn Luyện Viên
          </Title>
          <Text type="secondary" className="text-base text-gray-500">
            Đội ngũ chuyên gia tận tâm hỗ trợ bạn đạt được mục tiêu
          </Text>
        </div>

        {/* Danh sách huấn luyện viên */}
        <Row gutter={[24, 24]}>
          {Array.isArray(coaches) &&
            coaches.map((coach, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <CoachCard coach={coach} onSelectCoach={handleSelectCoach} />
              </Col>
            ))}
        </Row>

        {/* Modal tạo kế hoạch */}
        <QuitPlanModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSubmit={handleSubmit}
          coach={selectedCoach}
        />
      </div>
    </div>
  );
};

export default CoachCardList;
