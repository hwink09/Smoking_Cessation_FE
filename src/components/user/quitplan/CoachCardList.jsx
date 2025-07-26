import React from "react";
import { useCoachSelection } from "~/hooks/useCoachSelection";
import { useUserSubscription } from "~/hooks/useUserSubscription";
import {
  FullPageLoadingSkeleton,
  FullPageErrorCard,
} from "~/components/common/QuitPlanComponents";
import SubscriptionUpgradeCard from "~/components/common/SubscriptionUpgradeCard";
import CoachSelectionView from "./CoachSelectionView";
import PendingRequestView from "./PendingRequestView";
import QuitPlanView from "./QuitPlanView";

const CoachCardList = () => {
  const {
    selectedCoach,
    coaches,
    userQuitPlan,
    pendingRequest,
    loading,
    error,
    isRefreshing,
    setSelectedCoach,
    handleSubmit,
    refreshData,
  } = useCoachSelection();

  // Kiểm tra gói thành viên
  const {
    subscription,
    loading: subscriptionLoading,
    error: subscriptionError,
    canAccessCoach,
    isFreeUser,
  } = useUserSubscription();

  // Loading state - ưu tiên loading subscription trước
  if (subscriptionLoading || loading) {
    return <FullPageLoadingSkeleton text="Đang kiểm tra gói thành viên..." />;
  }

  // Error state
  if (error && !subscriptionError) {
    return <FullPageErrorCard message="Lỗi tải dữ liệu" description={error} />;
  }

  // Kiểm tra quyền truy cập coach
  if (!canAccessCoach()) {
    const isUserFree = isFreeUser();

    return (
      <SubscriptionUpgradeCard
        title={
          isUserFree
            ? "Mua gói Plus/Premium để chọn huấn luyện viên"
            : "Cần nâng cấp gói để chọn huấn luyện viên"
        }
        description={
          isUserFree
            ? "Bạn chưa có gói đăng ký nào. Mua gói Plus hoặc Premium để được hỗ trợ bởi huấn luyện viên chuyên nghiệp!"
            : "Tính năng huấn luyện viên cá nhân chỉ dành cho thành viên Plus và Premium. Nâng cấp ngay để nhận được sự hỗ trợ chuyên nghiệp!"
        }
      />
    );
  }

  // Show quit plan view if user has approved plan
  if (userQuitPlan?._id) {
    return <QuitPlanView userQuitPlan={userQuitPlan} />;
  }

  // Show pending request view if user has pending request
  if (pendingRequest?._id) {
    return (
      <PendingRequestView
        pendingRequest={pendingRequest}
        onRefresh={refreshData}
        isRefreshing={isRefreshing}
      />
    );
  }

  // Show coach selection view if no quit plan and no pending request
  return (
    <CoachSelectionView
      coaches={coaches}
      selectedCoach={selectedCoach}
      onSelectCoach={setSelectedCoach}
      onSubmit={handleSubmit}
      onCancel={() => setSelectedCoach(null)}
    />
  );
};

export default CoachCardList;
