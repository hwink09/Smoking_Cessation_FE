import api from "./api";

const postService = {
  // GET /api/posts
  getAllPosts: async () => {
    try {
      const response = await api.get("/posts");
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  },

  // GET /api/posts/{id}
  getPostById: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post ${postId}:`, error);
      throw error;
    }
  },

  // GET /api/posts/user/{userId}
  getPostsByUserId: async (userId) => {
    try {
      const response = await api.get(`/posts/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error);
      throw error;
    }
  },

  // GET /api/posts/tag/{tagId}
  getPostsByTagId: async (tagId) => {
    try {
      const response = await api.get(`/posts/tag/${tagId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching posts by tag ${tagId}:`, error);
      throw error;
    }
  },

  // POST /api/posts/create
  createPost: async (postData) => {
    try {
      const response = await api.post("/posts/create", postData);
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  // PUT /api/posts/{id}
  updatePost: async (postId, postData) => {
    try {
      const response = await api.put(`/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      console.error(`Error updating post ${postId}:`, error);
      throw error;
    }
  },

  // DELETE /api/posts/{id}
  deletePost: async (postId) => {
    try {
      const response = await api.delete(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting post ${postId}:`, error);
      throw error;
    }
  },

  // POST /api/posts/like/{id}
  likePost: async (postId) => {
    try {
      const response = await api.post(`/posts/like/${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Error liking post ${postId}:`, error);
      throw error;
    }
  },
};

export default postService;
