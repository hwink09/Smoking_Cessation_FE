import React from "react";
import { useAuth } from "~/hooks/useAuth";
import { useFeedbackData } from "~/hooks/useFeedbackData";

import FeedbackHeader from "./FeedbackHeader";
import FeedbackList from "./FeedbackList";
import LoadingSpinner from "./LoadingSpinner";

const CoachFeedback = ({ coachId }) => {
  const { currentUser } = useAuth();
  const targetCoachId = coachId || currentUser?.userId;

  const { loading, feedbacks } = useFeedbackData(targetCoachId);

  if (loading) {
    return <LoadingSpinner message="Đang tải dữ liệu đánh giá..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <FeedbackHeader title="Đánh giá từ học viên" />
        <FeedbackList feedbacks={feedbacks} loading={loading} />
      </div>
    </div>
  );
};

export default CoachFeedback;
