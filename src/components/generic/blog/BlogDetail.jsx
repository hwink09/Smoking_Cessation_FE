import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  Calendar,
  User,
  Tag,
  Facebook,
  Twitter,
  Eye,
  MessageCircle,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "~/hooks/useAuth";
import { usePostData } from "~/hooks/usePostData";
import CommentsSection from "~/components/user/blog/CommentsSection";

const BlogDetail = ({ post: propPost, onBack }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const userId = user?._id;

  const {
    getPostById,
    likePost,
    createComment,
    getCommentsByPostId,
    updateComment,
    deleteComment,
  } = usePostData();

  const [post, setPost] = useState(propPost || null);
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const formatComment = (comment, currentUser) => {
    const isOwner =
      String(comment.user_id?._id || comment.user_id) ===
      String(currentUser?._id);

    const author = isOwner
      ? currentUser.name || "Bạn"
      : comment.user_id?.name || "Ẩn danh";

    const avatar = isOwner
      ? currentUser.avatar_url
      : comment.user_id?.avatar_url;

    return {
      id: comment._id || Date.now(),
      author,
      avatar: avatar || "/default-avatar.png",
      comment_text: comment.comment_text || "",
      date: comment.createdAt || new Date().toISOString(),
      userId: comment.user_id?._id || comment.user_id,
      replies: [],
    };
  };

  useEffect(() => {
    // Luôn fetch lại post từ server theo id khi mount
    const fetchData = async () => {
      try {
        setError(null);
        setPost(null);

        const postId = propPost?._id || id;
        if (!postId) {
          setError("Không tìm thấy bài viết");
          return;
        }

        const postData = await getPostById(postId);
        setPost(postData);

        // So sánh userId kiểu string để tránh lỗi
        const hasLiked = user?._id
          ? postData.like_user_ids?.map(String).includes(String(user?._id))
          : false;
        setLiked(hasLiked);

        const commentList = await getCommentsByPostId(postId);
        const formatted = commentList.map((c) => formatComment(c, user));
        setComments(formatted);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải bài viết hoặc bình luận.");
      }
    };

    fetchData();
  }, [id, user?._id, propPost]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentData = {
      comment_text: newComment.trim(),
      post_id: post._id || post.id,
      user_id: user._id,
      createdAt: new Date().toISOString(),
    };
    try {
      const newCommentRes = await createComment(commentData);
      const commentToShow = formatComment({ ...newCommentRes, user_id: user }, user);
      setComments([...comments, commentToShow]);
      setNewComment("");
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
      alert("Không thể gửi bình luận. Vui lòng thử lại.");
    }
  };

  const handleEditComment = async (commentId, newText) => {
    await updateComment(commentId, { comment_text: newText });
    setComments(comments.map(c =>
      c.id === commentId
        ? { ...c, comment_text: newText }
        : c
    ));
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setComments(comments.filter(c => c.id !== commentId));
  };

  const handleBack = () => {
    if (onBack) return onBack();
    navigate("/blog");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-4xl mx-auto p-8">
          <button 
            onClick={handleBack} 
            className="group flex items-center text-purple-600 hover:text-purple-700 mb-6 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Quay lại</span>
          </button>
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-600 p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-red-500 rounded-full mr-3"></div>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-4xl mx-auto p-8">
          <button 
            onClick={handleBack} 
            className="group flex items-center text-purple-600 hover:text-purple-700 mb-6 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Quay lại</span>
          </button>
          <div className="flex items-center justify-center h-96">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-pink-400 animate-spin" style={{animationDelay: '0.5s', animationDirection: 'reverse'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        {/* Back Button */}
        <button 
          onClick={handleBack} 
          className="group flex items-center text-purple-600 hover:text-purple-700 mb-8 transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Quay lại danh sách</span>
        </button>

        {/* Main Article */}
        <article className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl border border-white/20">
          {/* Hero Image */}
          <div className="relative overflow-hidden">
            <img
              src={post.image || post.banner || post.thumbnail || "/placeholder.svg"}
              alt={post.title || "Blog image"}
              className="w-full h-64 md:h-96 lg:h-[28rem] object-cover transition-transform duration-700 hover:scale-105"
              onError={(e) => { e.target.src = "/placeholder.svg"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            
            {/* Floating Stats */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
             
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {comments.length}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 lg:p-10">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6 leading-tight">
              {post.title || "Untitled"}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center group">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-2 rounded-full mr-3 group-hover:scale-110 transition-transform duration-300">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
                <span className="font-medium">{post.user_id?.name || "Anonymous"}</span>
              </div>
              <div className="flex items-center group">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-2 rounded-full mr-3 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <span>{new Date(post.post_date || post.date).toLocaleDateString("vi-VN")}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mb-8">
              {(Array.isArray(post.tags) ? post.tags : [post.tags])
                .filter(Boolean)
                .map((tag, idx) => (
                  <span
                    key={tag._id || tag || idx}
                    className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-700 text-sm rounded-full transition-all duration-300 hover:scale-105 cursor-pointer border border-purple-200/50 hover:shadow-md"
                  >
                    <Tag className="h-3 w-3 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    {tag.title || tag}
                  </span>
                ))}
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-10 text-gray-800 leading-relaxed">
              {post.content ? (
                <div className="space-y-4">{post.content}</div>
              ) : (
                <p className="text-gray-500 italic">Không có nội dung</p>
              )}
            </div>

            {/* Action Bar */}
            <div className="border-t border-gradient-to-r from-purple-100 to-pink-100 pt-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Like Button */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={async () => {
                      // Xác định trạng thái thực tế từ post.like_user_ids
                      const hasLiked = (post.like_user_ids || []).map(String).includes(String(userId));
                      let newLiked = !hasLiked;
                      let newReactionCount = post.reaction_count || 0;
                      let newLikeUserIds;

                      if (newLiked) {
                        newReactionCount += 1;
                        newLikeUserIds = [...(post.like_user_ids || []), userId];
                      } else {
                        newReactionCount = Math.max(0, newReactionCount - 1);
                        newLikeUserIds = (post.like_user_ids || []).filter(id => String(id) !== String(userId));
                      }

                      setLiked(newLiked);
                      setPost({
                        ...post,
                        reaction_count: newReactionCount,
                        like_user_ids: newLikeUserIds,
                      });

                      try {
                        await likePost(post._id || post.id);
                        // Fetch lại post từ server để đảm bảo đồng bộ
                        const updatedPost = await getPostById(post._id || post.id);
                        setPost(updatedPost);
                        setLiked(
                          updatedPost.like_user_ids?.map(String).includes(String(userId))
                        );
                        localStorage.setItem("should_reload_blog_list", "true");
                      } catch (error) {
                        // Nếu lỗi, rollback lại state cũ
                        setLiked(hasLiked);
                        setPost(post);
                        console.error("Lỗi khi xử lý like:", error);
                      }
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      liked
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                    <span>{post.reaction_count || 0}</span>
                  </button>
                </div>

                {/* Share Buttons */}
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600 font-medium mr-2">Chia sẻ:</span>
                  <button className="group p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                    <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </button>
                  <button className="group p-3 bg-gradient-to-r from-sky-400 to-sky-500 text-white rounded-full hover:from-sky-500 hover:to-sky-600 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                    <Twitter className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </button>
                  <button className="group p-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full hover:from-gray-500 hover:to-gray-600 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                    <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8">
          <CommentsSection
            comments={comments}
            newComment={newComment}
            setNewComment={setNewComment}
            onSubmitComment={handleSubmitComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
            currentUser={user}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;