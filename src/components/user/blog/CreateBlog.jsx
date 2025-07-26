import { useState } from "react";
import { ArrowLeft, Save, ImageIcon, Tag, FileText } from "lucide-react";
import { toast } from "react-toastify";

const CreateBlog = ({ onSubmit, onCancel, tags = [] }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    tag: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      image: "",
      tag: "",
    });
    setError(null);
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, content, image, tag } = formData;

    // Validation đầy đủ các trường required
    if (!title.trim()) {
      toast.warning("Vui lòng nhập tiêu đề bài viết!");
      return;
    }

    if (!content.trim()) {
      toast.warning("Vui lòng nhập nội dung bài viết!");
      return;
    }

    if (!tag) {
      toast.warning("Vui lòng chọn thẻ chủ đề!");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Format data đúng chuẩn - tags phải là array
      const postData = {
        title: title.trim(),
        content: content.trim(),
        image: image.trim(),
        tags: [tag], // Chuyển thành array như backend expect
      };

      await onSubmit(postData);
      toast.success("Bài viết đã được tạo thành công!");
      resetForm(); // Reset form trước khi cancel
      onCancel();
    } catch (err) {
      setError(err.message || "Không thể tạo bài viết");
      toast.error("Có lỗi xảy ra khi tạo bài viết!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center">
          <div className="p-2 bg-red-100 rounded-lg mr-3">
            <FileText className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h4 className="font-medium">Có lỗi xảy ra</h4>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Quay lại
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition rounded-lg px-8 py-2 h-10 text-white flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Đang xử lý...
            </span>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Xuất bản
            </>
          )}
        </button>
      </div>

      <div className="transition hover:shadow-lg border border-slate-200 rounded-2xl bg-white overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-purple-50 via-white to-blue-50 border-b border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-1">
                Tạo bài viết mới
              </h1>
              <p className="text-sm text-gray-500">
                Chia sẻ kinh nghiệm và câu chuyện của bạn
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <FileText className="h-4 w-4 mr-2 text-blue-500" />
              Tiêu đề bài viết *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Nhập tiêu đề bài viết..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 transition"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <FileText className="h-4 w-4 mr-2 text-purple-500" />
              Nội dung bài viết *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Viết nội dung bài viết tại đây..."
              rows="15"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 transition resize-none"
              required
            />
          </div>

          {/* Image */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <ImageIcon className="h-4 w-4 mr-2 text-green-500" />
              URL hình ảnh
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => handleInputChange("image", e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 transition"
            />
          </div>

          {/* Tag */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <Tag className="h-4 w-4 mr-2 text-orange-500" />
              Thẻ chủ đề
            </label>
            <select
              value={formData.tag}
              onChange={(e) => handleInputChange("tag", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 transition"
              required
            >
              <option value="">Chọn thẻ chủ đề...</option>
              {tags.map((tag) => (
                <option key={tag._id} value={tag._id}>
                  {tag.title}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-2 flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              Chọn thẻ phù hợp để độc giả dễ tìm thấy bài viết của bạn
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
