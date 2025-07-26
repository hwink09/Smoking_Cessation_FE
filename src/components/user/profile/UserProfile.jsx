import React, { useState, useEffect } from "react";
import { Button, Tag, Card, Space } from "antd";
import { CrownOutlined, StarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import userService from "../../../services/userService";
import { useUserSubscription } from "~/hooks/useUserSubscription";

const formatDate = (dateString) =>
  dateString
    ? new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Chưa cập nhật";

const getMembershipStatus = (membership) => {
  if (!membership) return "Free";
  const { subscriptionType, expiresAt } = membership;
  if (subscriptionType === "free") return "Free";
  if (expiresAt && new Date(expiresAt) < new Date()) {
    return `${subscriptionType} (Hết hạn)`;
  }
  return subscriptionType;
};

const roleBadgeClass = (role) => {
  if (role === "admin") return "bg-red-500";
  if (role === "coach") return "bg-green-500";
  return "bg-blue-500";
};

export default function UserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Hook để lấy thông tin subscription
  const {
    subscription,
    loading: subscriptionLoading,
    canAccessCoach,
    hasPlusOrPremium,
    isSubscriptionActive,
  } = useUserSubscription();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { success, data } = await userService.getMyProfile();
        if (success) setUserProfile(data);
        else setError("Không thể tải thông tin profile");
      } catch {
        setError("Không thể tải thông tin profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
              {userProfile?.avatar_url ? (
                <img
                  src={userProfile.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold">
                  {userProfile?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {userProfile?.name || "Chưa cập nhật"}
              </h1>
              <p className="text-blue-100 text-lg">{userProfile?.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${roleBadgeClass(
                    userProfile?.role
                  )} text-white`}
                >
                  {userProfile?.role?.toUpperCase() || "USER"}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    userProfile?.isVerified ? "bg-green-500" : "bg-yellow-500"
                  } text-white`}
                >
                  {userProfile?.isVerified ? "Đã xác thực" : "Chưa xác thực"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Thông tin cá nhân
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Họ tên</h3>
                <p className="text-lg text-gray-900">
                  {userProfile?.name || "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Email</h3>
                <p className="text-lg text-gray-900">{userProfile?.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Trạng thái xác thực
                </h3>
                <p
                  className={`text-lg font-medium ${
                    userProfile?.isVerified
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {userProfile?.isVerified ? "Đã xác thực" : "Chưa xác thực"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Subscription Info Card */}
              <Card className="border border-gray-200 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Gói thành viên
                    </h3>
                    {subscription && (
                      <Tag
                        color={
                          subscription.name === "free"
                            ? "default"
                            : subscription.name === "plus"
                            ? "blue"
                            : subscription.name === "premium"
                            ? "gold"
                            : "default"
                        }
                        className="text-sm font-medium px-3 py-1"
                      >
                        {subscription.name?.toUpperCase() || "FREE"}
                      </Tag>
                    )}
                  </div>

                  {subscription ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Trạng thái:
                        </span>
                        <Tag color={isSubscriptionActive() ? "green" : "red"}>
                          {isSubscriptionActive()
                            ? "Đang hoạt động"
                            : "Hết hạn"}
                        </Tag>
                      </div>

                      {subscription.end_date &&
                        subscription.name !== "free" && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Hết hạn:
                            </span>
                            <span className="text-sm font-medium">
                              {formatDate(subscription.end_date)}
                            </span>
                          </div>
                        )}

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Quyền truy cập coach:
                        </span>
                        <Tag color={canAccessCoach() ? "green" : "orange"}>
                          {canAccessCoach() ? "Có quyền" : "Cần nâng cấp"}
                        </Tag>
                      </div>

                      {!hasPlusOrPremium() && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-blue-800">
                                Nâng cấp để sử dụng huấn luyện viên
                              </p>
                              <p className="text-xs text-blue-600">
                                Nhận hỗ trợ cá nhân từ chuyên gia
                              </p>
                            </div>
                            <Button
                              type="primary"
                              size="small"
                              icon={<CrownOutlined />}
                              onClick={() => navigate("/#pricing")}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Nâng cấp
                            </Button>
                          </div>
                        </div>
                      )}

                      {hasPlusOrPremium() && !isSubscriptionActive() && (
                        <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-orange-800">
                                Gói đã hết hạn
                              </p>
                              <p className="text-xs text-orange-600">
                                Gia hạn để tiếp tục sử dụng dịch vụ
                              </p>
                            </div>
                            <Button
                              type="primary"
                              size="small"
                              icon={<StarOutlined />}
                              onClick={() => navigate("/#pricing")}
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              Gia hạn
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Đang tải thông tin gói thành viên...
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Trạng thái tài khoản
                </h3>
                <p
                  className={`text-lg font-medium ${
                    userProfile?.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {userProfile?.isActive ? "Hoạt động" : "Không hoạt động"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
