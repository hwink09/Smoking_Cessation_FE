import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Card,
  Avatar,
  Typography,
  Alert,
  Rate,
  Tag,
  Button,
  message,
  Spin,
} from "antd";
import QuitPlanModal from "./QuitPlanModal";
import UserStageView from "./UserStageView";
import CoachCard from "./CoachCard";
import { useQuitPlanData } from "~/hooks/useQuitPlanData";
import useCoachData from "~/hooks/useCoachData";
import { useAuth } from "~/hooks/useAuth";
import api from "~/services/api";
import InfoBox from "~/components/common/InfoBox";
import LoadingSkeleton from "~/components/common/LoadingSkeleton";

const { Title, Paragraph, Text } = Typography;

const CoachCardList = () => {
  const { currentUser } = useAuth();
  const { getAllCoaches } = useCoachData();
  const { getQuitPlanByUserId, sendQuitPlanRequest, getMyQuitPlanRequests } =
    useQuitPlanData();

  const [selectedCoach, setSelectedCoach] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [userQuitPlan, setUserQuitPlan] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false); // Prevent concurrent refreshes

  const userId = useMemo(
    () => currentUser?.userId || currentUser?.id || currentUser?._id,
    [currentUser]
  );

  // Store functions in ref to avoid dependency issues
  const serviceRef = useRef({
    getAllCoaches,
    getQuitPlanByUserId,
    getMyQuitPlanRequests,
  });
  serviceRef.current = {
    getAllCoaches,
    getQuitPlanByUserId,
    getMyQuitPlanRequests,
  };

  const refreshDataRef = useRef();

  // Helper function to check if a quit plan has stages/tasks
  const checkPlanHasStages = useCallback(async (planId) => {
    try {
      const response = await api.get(`/stages/plan/${planId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Handle different response structures
      let stages = [];
      if (Array.isArray(response.data)) {
        stages = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        stages = response.data.data;
      } else if (response.data && typeof response.data === "object") {
        // If response is an object, check for common stage array properties
        stages = response.data.stages || response.data.results || [];
      }

      return stages.length > 0;
    } catch (error) {
      // Nếu lỗi 403 (forbidden) thì có thể user không có quyền, nhưng plan vẫn có thể có stages
      if (error.response?.status === 403) {
        return true; // Giả sử plan có stages nếu gặp lỗi 403
      }
      return false;
    }
  }, []);

  // Add refresh function
  const refreshData = useCallback(async () => {
    if (!userId || isRefreshing) return;

    setIsRefreshing(true);
    setLoading(true);
    try {
      const [coachList, quitPlans, requests] = await Promise.all([
        serviceRef.current.getAllCoaches(),
        serviceRef.current.getQuitPlanByUserId(userId),
        serviceRef.current.getMyQuitPlanRequests(),
      ]);

      setCoaches(coachList || []);

      // Kiểm tra xem có quit plan thật sự không (status = "approved" hoặc có coach_id)
      let approvedPlan = Array.isArray(quitPlans)
        ? quitPlans.find((plan) => plan.status === "approved" || plan.coach_id)
        : quitPlans?.status === "approved" || quitPlans?.coach_id
        ? quitPlans
        : null;

      // Nếu có approved plan, kiểm tra xem có stages/tasks không
      if (approvedPlan) {
        const hasStages = await checkPlanHasStages(approvedPlan._id);

        // Nếu chưa có stages, coi như chưa có quit plan hoàn chỉnh
        if (!hasStages) {
          approvedPlan = null;
        }
      }

      setUserQuitPlan(approvedPlan);

      // Kiểm tra xem có request pending hoặc approved (chưa có QuitPlan hoàn chỉnh) không
      const pendingReq = Array.isArray(requests)
        ? requests.find(
            (req) =>
              req.status === "pending" ||
              (req.status === "approved" && !approvedPlan) ||
              req.status === "created" // Thêm status "created" khi QuitPlan đã tạo nhưng chưa có stages
          )
        : requests?.status === "pending" ||
          (requests?.status === "approved" && !approvedPlan) ||
          requests?.status === "created"
        ? requests
        : null;

      setPendingRequest(pendingReq);

      setError(null); // Clear error on successful refresh
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi tải dữ liệu"
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [userId, isRefreshing, checkPlanHasStages]); // Include isRefreshing to prevent concurrent calls

  refreshDataRef.current = refreshData;

  useEffect(() => {
    if (!userId) return setLoading(false);

    let isCanceled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [coachList, quitPlans, requests] = await Promise.all([
          serviceRef.current.getAllCoaches(),
          serviceRef.current.getQuitPlanByUserId(userId),
          serviceRef.current.getMyQuitPlanRequests(),
        ]);

        if (!isCanceled) {
          setCoaches(coachList || []);

          // Kiểm tra xem có quit plan thật sự không (status = "approved" hoặc có coach_id)
          let approvedPlan = Array.isArray(quitPlans)
            ? quitPlans.find(
                (plan) => plan.status === "approved" || plan.coach_id
              )
            : quitPlans?.status === "approved" || quitPlans?.coach_id
            ? quitPlans
            : null;

          // Nếu có approved plan, kiểm tra xem có stages/tasks không
          if (approvedPlan) {
            const hasStages = await checkPlanHasStages(approvedPlan._id);

            // Nếu chưa có stages, coi như chưa có quit plan hoàn chỉnh
            if (!hasStages) {
              approvedPlan = null;
            }
          }

          setUserQuitPlan(approvedPlan);

          // Kiểm tra xem có request pending hoặc approved (chưa có QuitPlan hoàn chỉnh) không
          const pendingReq = Array.isArray(requests)
            ? requests.find(
                (req) =>
                  req.status === "pending" ||
                  (req.status === "approved" && !approvedPlan) ||
                  req.status === "created" // Thêm status "created" khi QuitPlan đã tạo nhưng chưa có stages
              )
            : requests?.status === "pending" ||
              (requests?.status === "approved" && !approvedPlan) ||
              requests?.status === "created"
            ? requests
            : null;
          setPendingRequest(pendingReq);
        }
      } catch (err) {
        if (!isCanceled)
          setError(
            err?.response?.data?.message || err.message || "Lỗi tải dữ liệu"
          );
      } finally {
        if (!isCanceled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isCanceled = true;
    };
  }, [userId, checkPlanHasStages]); // Include checkPlanHasStages dependency

  // Auto-refresh every 5 seconds to check for updates (reduced for testing)
  useEffect(() => {
    if (!userId) return;

    // Chỉ auto-refresh khi có pending request và chưa có quit plan
    // Nếu đã có quit plan hoặc request đã approved thì dừng auto-refresh
    if (
      !pendingRequest?._id ||
      userQuitPlan?._id ||
      pendingRequest?.status === "approved"
    )
      return;
  }, [userId, pendingRequest, userQuitPlan]);

  const handleSubmit = async (formData) => {
    const coachId =
      selectedCoach?.coach_id?._id ||
      selectedCoach?.coach_id ||
      selectedCoach?._id;
    if (!coachId) return message.error("Không xác định được coach!");

    try {
      await sendQuitPlanRequest({ coach_id: coachId, ...formData });
      message.success("Gửi yêu cầu thành công!");
      setSelectedCoach(null);
      // Refresh data immediately after sending request
      await refreshDataRef.current?.();
    } catch (err) {
      message.error("Thất bại: " + (err?.message || ""));
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 shadow-lg rounded-lg max-w-4xl">
          <Alert
            type="error"
            message="Không thể tải dữ liệu"
            description={error}
            showIcon
            className="rounded-lg"
          />
          <div className="mt-4 text-center">
            <Button onClick={refreshData} type="primary">
              Thử lại
            </Button>
          </div>
        </Card>
      </div>
    );

  // Nếu có quit plan đã approve, hiển thị giao diện chính
  if (userQuitPlan?._id) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <Title level={1} className="text-4xl mb-2">
                Kế Hoạch Cai Thuốc Của Bạn
              </Title>
              <Text className="text-lg text-gray-600">
                Theo dõi tiến trình và hoàn thành mục tiêu của bạn
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Container bên trái - Thông tin Coach */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg rounded-lg h-fit sticky top-4">
                <div className="text-center mb-6">
                  <Title level={3} className="mb-4 text-gray-800">
                    Huấn Luyện Viên Của Bạn
                  </Title>
                </div>
                <DetailedCoachInfo
                  coach={userQuitPlan.coach_id}
                  plan={userQuitPlan}
                />
              </Card>
            </div>

            {/* Container bên phải - Stage và Task */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg rounded-lg h-full">
                <Title level={3} className="mb-6 text-gray-800">
                  Giai Đoạn Hiện Tại & Nhiệm Vụ
                </Title>
                <UserStageView quitPlan={userQuitPlan} />
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Nếu có request pending, hiển thị màn hình chờ
  if (pendingRequest?._id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 shadow-lg rounded-lg max-w-4xl w-full">
          <div className="text-center">
            <Title level={1} className="text-4xl mb-4 text-blue-600">
              Yêu Cầu Đã Được Gửi
            </Title>
            <Text className="block text-lg mb-8 text-gray-600">
              Yêu cầu cai thuốc của bạn đang chờ huấn luyện viên xác nhận
            </Text>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-6">
              <div className="flex items-center justify-center mb-4">
                <Spin size="large" />
              </div>
              <Text className="text-blue-800 font-medium block mb-2">
                Trạng thái:{" "}
                {pendingRequest.status === "pending"
                  ? "Đang chờ xác nhận"
                  : pendingRequest.status === "approved"
                  ? "Đã được chấp nhận - Chờ tạo kế hoạch"
                  : pendingRequest.status === "created"
                  ? "Kế hoạch đã tạo - Chờ thiết lập chi tiết"
                  : pendingRequest.status}
              </Text>
              <Text className="text-blue-600">
                {pendingRequest.status === "pending"
                  ? "Huấn luyện viên sẽ xem xét và phản hồi yêu cầu của bạn trong thời gian sớm nhất."
                  : pendingRequest.status === "approved"
                  ? "Yêu cầu đã được chấp nhận! Huấn luyện viên đang tạo kế hoạch chi tiết cho bạn."
                  : pendingRequest.status === "created"
                  ? "Kế hoạch đã được tạo! Huấn luyện viên đang thiết lập các giai đoạn và nhiệm vụ cho bạn."
                  : "Vui lòng chờ trong giây lát..."}
              </Text>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={refreshData}
                  loading={isRefreshing}
                  className="mt-4"
                  type="primary"
                  disabled={isRefreshing}
                >
                  🔄 Kiểm tra cập nhật
                </Button>
                <Button
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="mt-4"
                  type="default"
                >
                  🔄 Tải lại trang
                </Button>
              </div>
            </div>

            {pendingRequest.coach_id && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <Text strong className="text-gray-800 block mb-4">
                  Huấn luyện viên được chọn:
                </Text>
                <CoachInfo coach={pendingRequest.coach_id} />
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // Nếu không có quit plan cũng không có pending request, hiển thị danh sách coach
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 shadow-lg rounded-lg max-w-6xl w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Title level={1} className="text-center text-3xl mb-4">
              Chọn Huấn Luyện Viên
            </Title>
            <Text className="block text-center text-lg mb-8">
              Chọn một huấn luyện viên phù hợp để bắt đầu hành trình cai thuốc
            </Text>
          </div>
          <Button
            onClick={refreshData}
            loading={isRefreshing}
            className="ml-4"
            size="large"
            disabled={isRefreshing}
          >
            🔄 Tải lại
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {coaches.length ? (
            coaches.map((coach) => (
              <CoachCard
                key={coach._id}
                coach={coach}
                onSelectCoach={setSelectedCoach}
              />
            ))
          ) : (
            <Text className="text-center col-span-full">
              Hiện tại chưa có huấn luyện viên khả dụng
            </Text>
          )}
        </div>

        <QuitPlanModal
          visible={!!selectedCoach}
          onCancel={() => setSelectedCoach(null)}
          onSubmit={handleSubmit}
          coach={selectedCoach}
        />
      </Card>
    </div>
  );
};

const PlanInfo = ({ plan }) => (
  <div className="space-y-4">
    <InfoBox label="Tên kế hoạch" value={plan.name} color="blue" />
    <InfoBox
      label="Ngày bắt đầu"
      value={new Date(plan.start_date).toLocaleDateString("vi-VN")}
      color="green"
    />
    <InfoBox
      label="Ngày mục tiêu"
      value={new Date(plan.target_quit_date).toLocaleDateString("vi-VN")}
      color="purple"
    />
    <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">
      <Text className="text-cyan-800 font-semibold">Trạng thái</Text>
      <Tag color={plan.status === "active" ? "green" : "blue"} className="ml-2">
        {plan.status === "active" ? "Đang hoạt động" : "Đang thực hiện"}
      </Tag>
    </div>
  </div>
);

const CoachInfo = ({ coach }) => (
  <div className="flex items-center space-x-4 bg-gray-50 p-6 rounded-lg border border-gray-100">
    {coach ? (
      <>
        <Avatar
          size={80}
          src={coach.avatar_url}
          className="border-4 border-white shadow-lg"
        />
        <div>
          <Title level={4} className="mb-2">
            {coach.name || "Ẩn danh"}
          </Title>
          <Tag color="blue">
            {coach.specialization || "Chuyên gia cai thuốc"}
          </Tag>
        </div>
      </>
    ) : (
      <Text>Chưa có huấn luyện viên</Text>
    )}
  </div>
);

const DetailedCoachInfo = ({ coach, plan }) => {
  if (!coach) {
    return (
      <div className="text-center p-8">
        <Text className="text-gray-500">
          Chưa có huấn luyện viên được phân công
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Avatar và thông tin cơ bản */}
      <div className="text-center">
        <Avatar
          size={120}
          src={coach.avatar_url}
          className="border-4 border-blue-100 shadow-lg mb-4"
        />
        <Title level={4} className="mb-2 text-gray-800">
          {coach.name || "Ẩn danh"}
        </Title>
        <Tag color="blue" className="mb-4">
          {coach.specialization || "Chuyên gia cai thuốc"}
        </Tag>
      </div>

      {/* Thông tin liên hệ */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <Text strong className="text-blue-800 block mb-2">
          📧 Thông tin liên hệ
        </Text>
        <Text className="text-blue-600 text-sm">
          {coach.email || "Chưa cập nhật email"}
        </Text>
        {coach.phone && (
          <Text className="text-blue-600 text-sm block mt-1">
            📞 {coach.phone}
          </Text>
        )}
      </div>

      {/* Đánh giá */}
      {coach.rating && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <Text strong className="text-yellow-800 block mb-2">
            ⭐ Đánh giá
          </Text>
          <div className="flex items-center gap-2">
            <Rate disabled defaultValue={coach.rating} className="text-sm" />
            <Text className="text-yellow-600 text-sm">({coach.rating}/5)</Text>
          </div>
        </div>
      )}

      {/* Kinh nghiệm */}
      {coach.experience && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <Text strong className="text-green-800 block mb-2">
            💼 Kinh nghiệm
          </Text>
          <Text className="text-green-600 text-sm">
            {coach.experience} năm kinh nghiệm
          </Text>
        </div>
      )}

      {/* Mô tả */}
      {coach.bio && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <Text strong className="text-gray-800 block mb-2">
            📝 Giới thiệu
          </Text>
          <Paragraph
            className="text-gray-600 text-sm mb-0"
            ellipsis={{ rows: 4, expandable: true, symbol: "Xem thêm" }}
          >
            {coach.bio}
          </Paragraph>
        </div>
      )}

      {/* Thông tin kế hoạch */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
        <Text strong className="text-purple-800 block mb-3">
          📋 Thông tin kế hoạch
        </Text>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Text className="text-purple-600 text-sm">Tên kế hoạch:</Text>
            <Text className="text-purple-800 text-sm font-medium">
              {plan.name}
            </Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-purple-600 text-sm">Ngày bắt đầu:</Text>
            <Text className="text-purple-800 text-sm font-medium">
              {new Date(plan.start_date).toLocaleDateString("vi-VN")}
            </Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-purple-600 text-sm">Mục tiêu:</Text>
            <Text className="text-purple-800 text-sm font-medium">
              {new Date(plan.target_quit_date).toLocaleDateString("vi-VN")}
            </Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-purple-600 text-sm">Trạng thái:</Text>
            <Tag
              color={plan.status === "active" ? "green" : "blue"}
              size="small"
            >
              {plan.status === "active" ? "Đang hoạt động" : "Đang thực hiện"}
            </Tag>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachCardList;
