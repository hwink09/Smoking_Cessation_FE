import { useState } from "react";
import {
  MessageCircle,
  Send,
  Edit,
  Trash2,
  Check,
  X,
  User,
  Calendar,
} from "lucide-react";

const CommentsSection = ({ 
  comments, 
  newComment, 
  setNewComment, 
  onSubmitComment, 
  onEditComment, 
  onDeleteComment,
  currentUser 
}) => {
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.comment_text);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) return;
    
    try {
      await onEditComment(commentId, editText.trim());
      setEditingComment(null);
      setEditText("");
    } catch (err) {
      console.error("Lỗi khi cập nhật bình luận:", err);
      alert("Không thể cập nhật bình luận. Vui lòng thử lại.");
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText("");
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;
    
    try {
      await onDeleteComment(commentId);
    } catch (err) {
      console.error("Lỗi khi xóa bình luận:", err);
      alert("Không thể xóa bình luận. Vui lòng thử lại.");
    }
  };

  const isCommentOwner = (comment) => {
    return String(comment.userId) === String(currentUser?._id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg mt-8 p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
        <MessageCircle className="h-6 w-6 mr-3 text-purple-600" />
        Bình luận ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={onSubmitComment} className="mb-10">
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white transition-all duration-200"
            rows="4"
          />
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Send className="h-4 w-4 mr-2" />
              Gửi bình luận
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Chưa có bình luận nào</p>
            <p className="text-gray-400 text-sm">Hãy là người đầu tiên bình luận về bài viết này!</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div 
              key={comment.id} 
              className={`bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ${
                index % 2 === 0 ? 'ml-0' : 'ml-4'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={comment.avatar || "/default-avatar.png"}
                    alt={comment.author}
                    className="w-12 h-12 rounded-full object-cover mr-4 shadow-md border border-purple-200 bg-white"
                    onError={e => { e.target.src = "/default-avatar.png"; }}
                  />
                  <div>
                    <span className="font-semibold text-gray-800 text-lg">
                      {comment.author}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(comment.date).toLocaleDateString("vi-VN", {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Action buttons - only show for comment owner */}
                {isCommentOwner(comment) && (
                  <div className="flex items-center space-x-2">
                    {editingComment === comment.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-200"
                          title="Lưu"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                          title="Hủy"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditComment(comment)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Comment content */}
              <div className="ml-16">
                {editingComment === comment.id ? (
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                    rows="3"
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed text-base">
                    {comment.comment_text}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;