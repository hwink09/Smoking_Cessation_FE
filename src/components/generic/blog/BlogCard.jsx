import { Heart, MessageCircle, Calendar, User, Tag } from "lucide-react";
;
import { useNavigate } from "react-router-dom";
import { useAuth } from "~/hooks/useAuth";

const BlogCard = ({ post, likePost, refetchPosts }) => {
  const {currentUser: user } = useAuth();
  const userId = user?._id;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/user/blog/${post._id}`);
  };

  const hasLiked = userId ? post.like_user_ids?.includes(userId) : false;

  const handleLikeClick = async (e) => {
    e.stopPropagation(); // Ngăn sự kiện click card
    try {
      await likePost(post._id); // API xử lý toggle like
      await refetchPosts();     // Đồng bộ lại dữ liệu
    } catch (err) {
      console.error("Lỗi khi like bài viết:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const renderTitle = () => {
    return post.content?.substring(0, 50) + "..." || "Untitled";
  };

  return (
    <div
      className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={post.image || "/placeholder.svg"}
          alt={renderTitle()}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "/placeholder.svg";
          }}
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <User className="h-4 w-4 mr-1" />
          <span className="mr-4">{post.user_id?.name || "Anonymous"}</span>
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatDate(post.post_date)}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.map((tag) => (
            <span
              key={tag._id}
              className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag.title}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLikeClick}
              className="flex items-center hover:text-purple-600 transition-colors group/like"
            >
              <Heart
                className={`h-4 w-4 mr-1 transition-transform ${
                  hasLiked ? "fill-purple-600 text-purple-600" : ""
                } group-hover/like:scale-110`}
              />
              {post.reaction_count || 0}
            </button>

            <span className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.comment_count || 0}
            </span>
          </div>
          <span className="text-purple-600 font-medium">{post.post_type}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
