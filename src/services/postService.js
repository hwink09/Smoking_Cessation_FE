import api from "./api";


// -------- Posts --------
export const fetchPostsAPI = async () => {
  return await api.get("/posts");
};

export const getPostByIdAPI = async (postId) => {
  return await api.get(`/posts/${postId}`);
};

export const getPostsByUserIdAPI = async (userId) => {
  return await api.get(`/posts/user/${userId}`);
};

export const createPostAPI = async (postData) => {
  return await api.post("/posts/create", postData);
};

export const updatePostAPI = async (postId, postData) => {
  return await api.put(`/posts/${postId}`, postData);
};

export const deletePostAPI = async (postId) => {
  return await api.delete(`/posts/${postId}`);
};

export const likePostAPI = async (postId) => {
  return await api.post(`/posts/like/${postId}`);
};

// -------- Tags --------
export const fetchTagsAPI = async () => {
  return await api.get("/tags");
};

// -------- Comments --------
export const createCommentAPI = async (commentData) => {
  return await api.post(`/comments/create`, commentData);
};

export const getCommentsByPostIdAPI = async (postId) => {
  return await api.get(`/comments/post/${postId}`);
};

export const updateCommentAPI = async (commentId, commentData) => {
  return await api.put(`/comments/${commentId}`, commentData);
};

export const deleteCommentAPI = async (commentId) => {
  return await api.delete(`/comments/${commentId}`);
};
