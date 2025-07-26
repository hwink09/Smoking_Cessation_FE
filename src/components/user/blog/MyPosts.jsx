import { useState } from "react";
import { Plus, Edit, Trash2, Calendar, Tag } from "lucide-react";
import { Button, Modal } from "antd";
import { toast } from "react-toastify";
import EditPostModal from "./EditPostModal";
import { usePostData } from "~/hooks/usePostData";

const MyPosts = ({ posts, onCreateNew, refetchUserPosts }) => {
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
    setSelectedPosts(
      selectedPosts.length === posts.length ? [] : posts.map((p) => p._id)
    );
  };

  const handleOpenEditModal = (post) => setEditingPost(post);
  const handleCloseEditModal = () => setEditingPost(null);

  const handleDeleteSingle = (postId) => {
    setPostToDelete(postId);
    setConfirmVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePost(postToDelete);
      toast.success("Đã xóa bài viết!");
      setSelectedPosts((prev) => prev.filter((id) => id !== postToDelete));
      await refetchUserPosts();
    } catch {
      toast.error("Lỗi khi xóa bài viết!");
    } finally {
      setPostToDelete(null);
      setConfirmVisible(false);
    }
  };

  const handleDeleteMultiple = () => {
    if (selectedPosts.length > 0) {
      setMultiDeleteVisible(true);
    }
  };

  const renderPostCard = (post) => (
    <div
      key={post._id}
      className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-white to-gray-50 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={selectedPosts.includes(post._id)}
          onChange={() => handleSelectPost(post._id)}
          className="mt-3 w-4 h-4 text-blue-600"
        />

        <img
          src={post.image || "/placeholder.svg?height=100&width=150"}
          alt={post.title}
          className="w-28 h-20 object-cover rounded-xl border"
        />

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 hover:text-blue-600">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {post.content}
          </p>

          <div className="flex items-center text-xs text-gray-500 mb-2">
            <Calendar className="h-3 w-3 mr-1 text-blue-500" />
            <span>{new Date(post.post_date).toLocaleDateString("vi-VN")}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag._id}
                className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border"
              >
                <Tag className="h-2 w-2 mr-1" />
                {tag.title}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                +{post.tags.length - 3} khác
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleOpenEditModal(post)}
            className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
          >
            <Edit className="h-4 w-4 mr-2" />
            Sửa
          </button>
          <button
            onClick={() => handleDeleteSingle(post._id)}
            className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-6">
        <button
          onClick={onCreateNew}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg rounded-lg px-8 py-3 text-white flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Viết bài mới
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-shadow hover:shadow-lg">
        <div className="flex justify-between items-center p-6 bg-gradient-to-br from-purple-50 via-white to-blue-50 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Edit size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Bài viết của tôi ({posts.length})
              </h3>
              <p className="text-sm text-gray-500">
                Quản lý và chỉnh sửa các bài viết của bạn
              </p>
            </div>
          </div>

          {posts.length > 0 && (
            <div className="flex items-center gap-4">
              <label className="flex items-center text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border">
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
                  className="flex items-center px-4 py-2 rounded-lg h-10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa ({selectedPosts.length})
                </Button>
              )}
            </div>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Edit className="h-12 w-12 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Chưa có bài viết nào
            </h3>
            <p className="text-gray-600 mb-6">
              Hãy chia sẻ kinh nghiệm bỏ thuốc để giúp cộng đồng!
            </p>
            <button
              onClick={onCreateNew}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2 inline" />
              Viết bài đầu tiên
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">{posts.map(renderPostCard)}</div>
        )}
      </div>

      {editingPost && (
        <EditPostModal
          visible
          onClose={handleCloseEditModal}
          postId={editingPost._id}
          initialData={editingPost}
          refetchUserPosts={refetchUserPosts}
        />
      )}

      {/* Modal xác nhận xóa 1 */}
      <Modal
        open={confirmVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setConfirmVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, className: "rounded-lg px-6 h-10" }}
        cancelButtonProps={{ className: "rounded-lg px-6 h-10" }}
        title={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-700">Xác nhận xóa</h3>
              <p className="text-sm text-gray-500">
                Hành động không thể hoàn tác
              </p>
            </div>
          </div>
        }
        className="modern-modal"
      >
        <p className="text-gray-600">
          Bạn có chắc muốn xóa bài viết này không? Dữ liệu sẽ bị mất vĩnh viễn.
        </p>
      </Modal>

      {/* Modal xác nhận xóa nhiều */}
      <Modal
        open={multiDeleteVisible}
        onOk={async () => {
          try {
            await Promise.all(selectedPosts.map((id) => deletePost(id)));
            toast.success(`Đã xóa ${selectedPosts.length} bài viết!`);
            setSelectedPosts([]);
            await refetchUserPosts();
          } catch {
            toast.error("Lỗi khi xóa nhiều bài viết!");
          } finally {
            setMultiDeleteVisible(false);
          }
        }}
        onCancel={() => setMultiDeleteVisible(false)}
        okText="Xóa tất cả"
        cancelText="Hủy"
        okButtonProps={{ danger: true, className: "rounded-lg px-6 h-10" }}
        cancelButtonProps={{ className: "rounded-lg px-6 h-10" }}
        title={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-700">
                Xóa nhiều bài viết
              </h3>
              <p className="text-sm text-gray-500">
                {selectedPosts.length} bài viết đã chọn
              </p>
            </div>
          </div>
        }
        className="modern-modal"
      >
        <p className="text-gray-600">
          Bạn chắc chắn muốn xóa <strong>{selectedPosts.length}</strong> bài
          viết này? Dữ liệu sẽ bị mất.
        </p>
      </Modal>
    </div>
  );
};

export default MyPosts;
