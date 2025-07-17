import api from "./api";

const FeedbackService = {
  // POST /api/feedback - Create Feedback
  createFeedback: async (feedbackData) => {
    try {
      const response = await api.post("/feedback", feedbackData);
      return response.data;
    } catch (error) {
      console.error("Error creating feedback:", error);

      // Cải thiện error handling
      if (error.response?.status === 401) {
        throw new Error("Bạn cần đăng nhập để thực hiện chức năng này");
      } else if (error.response?.status === 500) {
        throw new Error("Lỗi server. Vui lòng thử lại sau hoặc liên hệ hỗ trợ");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw error;
    }
  },

  // GET /api/feedback/user/{id} - Get Feedback of current user
  getUserFeedback: async (userId = "me") => {
    try {
      // Backend lấy user_id từ token, nhưng route vẫn cần param
      const response = await api.get(`/feedback/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user feedback:", error);
      throw error;
    }
  },

  // GET /api/feedback/coach/{id} - Get Feedback of coach
  getCoachFeedback: async (coachId) => {
    try {
      const response = await api.get(`/feedback/coach/${coachId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching feedback for coach ${coachId}:`, error);
      throw error;
    }
  },

  // PUT /api/feedback/{id} - Edit Feedback
  updateFeedback: async (id, feedbackData) => {
    try {
      const response = await api.put(`/feedback/${id}`, feedbackData);
      return response.data;
    } catch (error) {
      console.error(`Error updating feedback ${id}:`, error);
      throw error;
    }
  },

  // DELETE /api/feedback/{id} - Delete Feedback
  deleteFeedback: async (id) => {
    try {
      const response = await api.delete(`/feedback/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting feedback ${id}:`, error);
      throw error;
    }
  },

  // PUT /api/feedback/status/{id} - Edit Feedback Status
  updateFeedbackStatus: async (id, statusData) => {
    try {
      const response = await api.put(`/feedback/status/${id}`, statusData);
      return response.data;
    } catch (error) {
      console.error(`Error updating feedback status ${id}:`, error);
      throw error;
    }
  },

  // GET /api/feedback/coach/{id}/average-rating - AVG Rating Coach
  getCoachAverageRating: async (coachId) => {
    try {
      const response = await api.get(
        `/feedback/coach/${coachId}/average-rating`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching average rating for coach ${coachId}:`,
        error
      );
      throw error;
    }
  },

  // GET /api/feedback/ - Get All Feedback
  getAllFeedbacks: async () => {
    try {
      const response = await api.get("/feedback/");
      return response.data;
    } catch (error) {
      console.error("Error fetching all feedbacks:", error);
      throw error;
    }
  },

  // GET /api/feedback?type={type} - Get Feedback by Type
  getFeedbacksByType: async (type = "all") => {
    try {
      const response = await api.get(`/feedback?type=${type}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching feedbacks by type:", error);
      throw error;
    }
  },

  // GET /api/feedback/system-rating - Get AVG System
  getSystemRating: async () => {
    try {
      const response = await api.get("/feedback/system-rating");
      return response.data;
    } catch (error) {
      console.error("Error fetching system rating:", error);
      throw error;
    }
  },
};

export default FeedbackService;
