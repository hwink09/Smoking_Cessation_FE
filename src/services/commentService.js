import api from "./api";

const commentService = {
  // POST /api/comments/create
  createComment: async (commentData) => {
    try {
      const response = await api.post("/comments/create", commentData);
      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  // GET /api/comments/post/{id}
  getCommentsByPostId: async (postId) => {
    try {
      const response = await api.get(`/comments/post/${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  },

  // PUT /api/comments/{id}
  updateComment: async (commentId, commentData) => {
    try {
      const response = await api.put(`/comments/${commentId}`, commentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating comment ${commentId}:`, error);
      throw error;
    }
  },

  // DELETE /api/comments/{id}
  deleteComment: async (commentId) => {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error);
      throw error;
    }
  },
};

export default commentService;
