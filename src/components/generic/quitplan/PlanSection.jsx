import { useState, useEffect, useMemo } from "react";
import { Alert, Col, Row, Spin, Card, Typography, Avatar, Tag } from "antd";
import {
  UserOutlined,
  StarOutlined,
  CalendarOutlined,
  RocketOutlined,
} from "@ant-design/icons";

import PlanCard from "./PlanCard";
import { useQuitPlanData } from "~/hooks/useQuitPlanData";
import { useAuth } from "~/hooks/useAuth";
import useCoachData from "~/hooks/useCoachData";
import ColourfulText from "~/components/ui/colourful-text";
import CoachCardList from "~/components/user/quitplan/CoachCardList";
import UserStageView from "~/components/user/quitplan/UserStageView";

const { Title, Text } = Typography;

function PlanSection() {
  const { currentUser: user } = useAuth();
  const { getQuitPlanByUserId } = useQuitPlanData();
  const [userQuitPlan, setUserQuitPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchedUserId, setLastFetchedUserId] = useState(null);

  // Memoize userId để tránh re-render
  const userId = useMemo(() => user?.userId, [user?.userId]);

  useEffect(() => {
    // Tránh fetch nếu userId không thay đổi
    if (!userId || userId === lastFetchedUserId) {
      if (!userId) setLoading(false);
      return;
    }

    let isCanceled = false;

    const fetchUserQuitPlan = async () => {
      setLoading(true);
      setError(null);

      try {
        const quitPlan = await getQuitPlanByUserId(userId);
        if (!isCanceled) {
          setUserQuitPlan(quitPlan);
          setLastFetchedUserId(userId);
        }
      } catch (err) {
        if (!isCanceled) {
          console.error("Error fetching quit plan:", err);
          setError(
            err?.response?.data?.message || err.message || "Lỗi khi tải dữ liệu"
          );
        }
      } finally {
        if (!isCanceled) {
          setLoading(false);
        }
      }
    };

    fetchUserQuitPlan();

    return () => {
      isCanceled = true;
    };
  }, [userId, lastFetchedUserId, getQuitPlanByUserId]);

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-400 rounded-full animate-spin animation-delay-75"></div>
            </div>
            <Text className="mt-6 text-lg text-gray-600 font-medium">
              Đang tải thông tin...
            </Text>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Alert
              type="error"
              message="Lỗi tải dữ liệu"
              description={error}
              className="border-0 bg-red-50 rounded-xl"
            />
          </div>
        </div>
      </section>
    );
  }

  // Nếu user chưa có quit plan hoặc chưa có coach thì hiển thị danh sách coach
  if (!userQuitPlan || !userQuitPlan.coach_id) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8 shadow-2xl">
              <UserOutlined className="text-3xl text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
              <ColourfulText text="Chọn Huấn Luyện Viên" />
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Bắt đầu hành trình cai thuốc với sự hỗ trợ từ những chuyên gia
              hàng đầu. Chọn huấn luyện viên phù hợp để có lộ trình cá nhân hóa
              tốt nhất.
            </p>
          </div>

          {/* Coach Selection Container */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
            <CoachCardList />
          </div>
        </div>
      </section>
    );
  }

  // Nếu user đã có coach, hiển thị coach bên trái và stage/task bên phải
  const coach = userQuitPlan.coach_id;

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-8 shadow-2xl">
            <RocketOutlined className="text-3xl text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
            <ColourfulText text="Kế Hoạch Cai Thuốc" />
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Theo dõi tiến trình và thực hiện các nhiệm vụ trong kế hoạch cai
            thuốc được thiết kế riêng cho bạn.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel - Coach Info */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 h-full">
              {/* Coach Avatar & Basic Info */}
              <div className="text-center mb-8 pb-8 border-b border-gray-100">
                <div className="relative inline-block">
                  <Avatar
                    size={100}
                    src={coach?.avatar_url}
                    icon={<UserOutlined />}
                    className="border-4 border-white shadow-2xl"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
                <Title level={3} className="mt-4 mb-2 text-gray-800">
                  {coach?.name || "Ẩn danh"}
                </Title>
                <Tag
                  color="blue"
                  className="px-4 py-1 text-sm font-medium rounded-full border-0 bg-blue-50 text-blue-700"
                >
                  <StarOutlined className="mr-1" />
                  Huấn luyện viên của bạn
                </Tag>
              </div>

              {/* Plan Details Grid */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm">📋</span>
                    </div>
                    <Text strong className="text-blue-800 font-semibold">
                      Kế hoạch
                    </Text>
                  </div>
                  <Text className="text-gray-700 font-medium ml-11">
                    {userQuitPlan.name}
                  </Text>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <CalendarOutlined className="text-white text-sm" />
                    </div>
                    <Text strong className="text-green-800 font-semibold">
                      Ngày bắt đầu
                    </Text>
                  </div>
                  <Text className="text-gray-700 font-medium ml-11">
                    {new Date(userQuitPlan.start_date).toLocaleDateString(
                      "vi-VN"
                    )}
                  </Text>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-2xl border border-purple-100">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm">🎯</span>
                    </div>
                    <Text strong className="text-purple-800 font-semibold">
                      Mục tiêu
                    </Text>
                  </div>
                  <Text className="text-gray-700 font-medium ml-11">
                    {new Date(userQuitPlan.target_quit_date).toLocaleDateString(
                      "vi-VN"
                    )}
                  </Text>
                </div>

                {userQuitPlan.reason && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-2xl border border-orange-100">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-sm">💭</span>
                      </div>
                      <Text strong className="text-orange-800 font-semibold">
                        Lý do
                      </Text>
                    </div>
                    <Text className="text-gray-700 font-medium ml-11 leading-relaxed">
                      {userQuitPlan.reason}
                    </Text>
                  </div>
                )}

                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-2xl border border-cyan-100">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm">📊</span>
                    </div>
                    <Text strong className="text-cyan-800 font-semibold">
                      Trạng thái
                    </Text>
                  </div>
                  <div className="ml-11">
                    <Tag
                      color={
                        userQuitPlan.status === "active"
                          ? "green"
                          : "processing"
                      }
                      className="px-3 py-1 text-sm font-medium rounded-full border-0"
                    >
                      {userQuitPlan.status === "active" ? (
                        <>🟢 Đang hoạt động</>
                      ) : (
                        <>🔄 Đang chuẩn bị</>
                      )}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Stage & Tasks */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8 h-full">
              <UserStageView quitPlan={userQuitPlan} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PlanSection;
