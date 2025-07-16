import { useState } from "react";
import {  Plus, Edit, Trash2, Calendar, Tag } from "lucide-react";
import { Button, Modal, message } from "antd";
import EditPostModal from "./EditPostModal";
import { usePostData } from "~/hooks/usePostData";



const MyPosts = ({ posts, onCreateNew, refetchUserPosts}) => {
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [multiDeleteVisible, setMultiDeleteVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const { deletePost } = usePostData();

  const handleSelectPost = (postId) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map((post) => post._id));
    }
  };

  const handleOpenEditModal = (post) => {
    setEditingPost(post);
  };

  const handleCloseEditModal = () => {
    setEditingPost(null);
  };

  const handleDeleteSingle = (postId) => {
    setPostToDelete(postId);
    setConfirmVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePost(postToDelete);
      message.success("Đã xóa bài viết.");
      setSelectedPosts(selectedPosts.filter(id => id !== postToDelete));
      await refetchUserPosts();
    } catch (err) {
      message.error("Xóa thất bại", err);
    } finally {
      setPostToDelete(null);
      setConfirmVisible(false);
    }
  };

  const handleDeleteCancel = () => {
    setPostToDelete(null);
    setConfirmVisible(false);
  };

  const handleDeleteMultiple = async () => {
    if (selectedPosts.length > 0) {
      setMultiDeleteVisible(true);
    }
  };

  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onCreateNew}
          className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Viết bài mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Bài viết của tôi ({posts.length})
          </h1>

          {posts.length > 0 && (
            <div className="flex items-center space-x-4">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={
                    selectedPosts.length === posts.length && posts.length > 0
                  }
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                Chọn tất cả
              </label>
              {selectedPosts.length > 0 && (
                <Button
                  danger
                  onClick={handleDeleteMultiple}
                  className="flex items-center px-4 py-2 rounded-lg"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa ({selectedPosts.length})
                </Button>
              )}
            </div>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Chưa có bài viết nào
            </h3>
            <p className="text-gray-600 mb-6">
              Hãy bắt đầu chia sẻ câu chuyện và kinh nghiệm của bạn!
            </p>
            <Button
              onClick={onCreateNew}
              className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mx-auto"
            >
              <Plus className="h-5 w-5 mr-2" />
              Viết bài đầu tiên
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedPosts.includes(post._id)}
                    onChange={() => handleSelectPost(post._id)}
                    className="mt-2"
                  />

                  <img
                    src={post.image || "/placeholder.svg?height=100&width=150"}
                    alt={post.title}
                    className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.content}
                    </p>

                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="mr-4">
                        {new Date(post.post_date).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag._id}
                          className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          <Tag className="h-2 w-2 mr-1" />
                          {tag.title}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{post.tags.length - 3} khác
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleOpenEditModal(post)}
                      className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteSingle(post._id)}
                      className="flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingPost && (
        <EditPostModal
          visible={!!editingPost}
          onClose={handleCloseEditModal}
          postId={editingPost._id}
          initialData={editingPost}
          refetchUserPosts={refetchUserPosts}
        />
      )}

      <Modal
        open={confirmVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        title="Xác nhận xóa bài viết?"
      >
        Bạn có chắc chắn muốn xóa bài viết này không?
      </Modal>

      {/* Modal xác nhận xóa nhiều bài */}
      <Modal
        open={multiDeleteVisible}
        onOk={async () => {
          try {
            await Promise.all(selectedPosts.map((id) => deletePost(id)));
            message.success("Đã xóa các bài viết.");
            setSelectedPosts([]);
            await refetchUserPosts();
          } catch (err) {
            message.error("Có lỗi xảy ra khi xóa nhiều bài",err);
          } finally {
            setMultiDeleteVisible(false);
          }
        }}
        onCancel={() => setMultiDeleteVisible(false)}
        okText="Xóa tất cả"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        title="Xác nhận xóa nhiều bài viết?"
      >
        Bạn có chắc chắn muốn xóa {selectedPosts.length} bài viết đã chọn không?
      </Modal>
    </div>
  );
};

export default MyPosts;
