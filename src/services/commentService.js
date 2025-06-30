import api from "./api";

const commentService = {
  // POST /api/comments/create - Comment Post
  createComment: async (commentData) => {
    try {
      const response = await api.post("/comments/create", commentData);
      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  // GET /api/comments/post/{id} - Get Comment By Post Id
  getCommentsByPostId: async (postId) => {
    try {
      const response = await api.get(`/comments/post/${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  },

  // PUT /api/comments/{id} - Edit Comment
  updateComment: async (commentId, commentData) => {
    try {
      const response = await api.put(`/comments/${commentId}`, commentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating comment ${commentId}:`, error);
      throw error;
    }
  },

  // DELETE /api/comments/{id} - Delete Comment
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
