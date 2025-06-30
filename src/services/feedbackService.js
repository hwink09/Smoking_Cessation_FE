const FEEDBACKS_KEY = "feedbacks";

const FeedbackService = {
  getAllFeedbacks: () => {
    const saved = localStorage.getItem(FEEDBACKS_KEY);
    return saved ? JSON.parse(saved) : [];
  },
  deleteFeedback: (id) => {
    const feedbacks = FeedbackService.getAllFeedbacks();
    const updated = feedbacks.filter((f) => f.id !== id);
    localStorage.setItem(FEEDBACKS_KEY, JSON.stringify(updated));
    return updated;
  },
};

export default FeedbackService;
