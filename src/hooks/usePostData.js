import { useState, useEffect, useCallback } from "react";
import postService from "~/services/postService";
import commentService from "~/services/commentService";
import tagService from "~/services/tagService";

export function usePostData() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      const response = await tagService.getAllTags();
      const data = response;
      if (Array.isArray(data.data)) setTags(data.data);
      else if (Array.isArray(data.tags)) setTags(data.tags);
      else if (Array.isArray(data)) setTags(data);
      else setTags([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postService.getAllPosts();
      let rawPosts = response.posts || response.data || response || [];
      if (!Array.isArray(rawPosts)) {
        // If API returns an object, get the first array value (if any)
        rawPosts = Object.values(rawPosts).find((v) => Array.isArray(v)) || [];
      }
      const formatted = rawPosts.map((post) => ({
        _id: post._id || post.id,
        title: post.title || post.content?.substring(0, 50) || "Untitled",
        content: post.content || "",
        image:
          post.image || post.banner || post.thumbnail || "/placeholder.svg",
        post_date: post.post_date || post.createdAt || new Date().toISOString(),
        user_id: post.user_id || { name: "Anonymous" },
        tags: Array.isArray(post.tags) ? post.tags : [],
        reaction_count: post.reaction_count || 0,
        comment_count: post.comment_count || 0,
        post_type: post.post_type || "blog",
        like_user_ids: Array.isArray(post.like_user_ids)
          ? post.like_user_ids
          : [],
      }));

      setPosts(formatted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchTags();
  }, [fetchPosts, fetchTags]);

  const createPost = async (postData, onSuccess) => {
    try {
      setLoading(true);
      const response = await postService.createPost(postData);
      await fetchPosts();
      if (onSuccess) onSuccess(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (postId, postData) => {
    try {
      setLoading(true);
      const response = await postService.updatePost(postId, postData);
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, ...response } : post
        )
      );
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId) => {
    try {
      setLoading(true);
      await postService.deletePost(postId);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPostById = async (postId) => {
    try {
      setLoading(true);
      const response = await postService.getPostById(postId);
      const data = response?.data || response?.post || response;

      return {
        _id: data._id || postId,
        title: data.title || data.content?.substring(0, 50) || "Untitled",
        content: data.content || "",
        image:
          data.image || data.banner || data.thumbnail || "/placeholder.svg",
        post_date: data.post_date || data.createdAt || new Date().toISOString(),
        user_id: data.user_id || { name: "Anonymous" },
        tags: Array.isArray(data.tags) ? data.tags : [],
        reaction_count: data.reaction_count || 0,
        comment_count: data.comment_count || 0,
        post_type: data.post_type || "blog",
        like_user_ids: Array.isArray(data.like_user_ids)
          ? data.like_user_ids
          : [],
      };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPostsByUserId = async (userId) => {
    try {
      setLoading(true);
      const response = await postService.getPostsByUserId(userId);
      return Array.isArray(response)
        ? response
        : response.posts || response.data || [];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId) => {
    try {
      setLoading(true);
      const response = await postService.likePost(postId);
      await fetchPosts();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (commentData, onSuccess) => {
    try {
      setLoading(true);
      const response = await commentService.createComment(commentData);
      if (onSuccess) onSuccess(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCommentsByPostId = async (postId) => {
    try {
      setLoading(true);
      const response = await commentService.getCommentsByPostId(postId);
      return Array.isArray(response)
        ? response
        : response.comments || response.data || [];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateComment = async (commentId, commentData, onSuccess) => {
    try {
      setLoading(true);
      const response = await commentService.updateComment(
        commentId,
        commentData
      );
      if (onSuccess) onSuccess(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId, onSuccess) => {
    try {
      setLoading(true);
      await commentService.deleteComment(commentId);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    tags,
    loading,
    error,
    fetchTags,
    createPost,
    updatePost,
    deletePost,
    getPostById,
    getPostsByUserId,
    likePost,
    refetchPosts: fetchPosts,
    createComment,
    getCommentsByPostId,
    updateComment,
    deleteComment,
  };
}
