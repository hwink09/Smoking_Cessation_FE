import React from "react";
import { useCoachSelection } from "~/hooks/useCoachSelection";
import {
  FullPageLoadingSkeleton,
  FullPageErrorCard,
} from "~/components/common/QuitPlanComponents";
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

  if (loading) {
    return (
      <FullPageLoadingSkeleton text="Đang tải danh sách huấn luyện viên..." />
    );
  }

  if (error) {
    return (
      <FullPageErrorCard message="Không thể tải dữ liệu" description={error} />
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
