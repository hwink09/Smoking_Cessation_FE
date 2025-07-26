import { useState, useEffect } from "react";
import { message } from "antd";
import FeedbackService from "~/services/feedbackService";

export const useFeedbackData = (coachId) => {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!coachId) {
        setLoading(false);
        return;
      }

      try {
        const data = await FeedbackService.getCoachFeedback(coachId);
        const approvedFeedbacks = Array.isArray(data)
          ? data.filter((item) => item.status === "approved")
          : [];
        setFeedbacks(approvedFeedbacks);
      } catch (error) {
        message.error("Không thể tải thông tin đánh giá");
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [coachId]);

  return {
    loading,
    feedbacks,
    setFeedbacks,
  };
};
