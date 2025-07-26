import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { usePostData } from "~/hooks/usePostData";
import { Edit3, Save, FileText, ImageIcon, Tag } from "lucide-react";

const FormLabel = ({ icon: Icon, text, color }) => (
  <span className="flex items-center text-sm font-semibold text-gray-700">
    <Icon size={16} className={`mr-2 ${color}`} />
    {text}
  </span>
);

function EditPostModal({
  visible,
  onClose,
  postId,
  initialData,
  refetchUserPosts,
}) {
  const { updatePost } = usePostData();
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialData) {
      form.setFieldsValue({
        title: initialData.title,
        content: initialData.content,
        image: initialData.image,
        tag: initialData.tag?.join(", ") || "",
      });
    }
  }, [visible, initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        tag: values.tag.split(",").map((tag) => tag.trim()),
      };

      await updatePost(postId, payload);
      toast.success("Bài viết đã được cập nhật thành công!");
      await refetchUserPosts?.();
      onClose();
    } catch {
      toast.error("Có lỗi xảy ra khi cập nhật bài viết!");
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-3 py-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Edit3 size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
              Chỉnh sửa bài viết
            </h3>
            <p className="text-sm text-gray-500">
              Cập nhật thông tin bài viết của bạn
            </p>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={
        <span className="flex items-center">
          <Save size={16} className="mr-2" />
          Cập nhật
        </span>
      }
      cancelText="Hủy"
      okButtonProps={{
        className:
          "bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700 rounded-lg px-6 h-10 text-white font-medium",
      }}
      cancelButtonProps={{
        className:
          "border border-gray-300 hover:border-gray-400 rounded-lg px-6 h-10 text-gray-700 font-medium",
      }}
      width={700}
      className="rounded-2xl shadow-2xl"
      styles={{
        body: {
          padding: 32,
          background: "linear-gradient(to bottom right, #ffffff, #f9fafb)",
        },
      }}
    >
      <Form layout="vertical" form={form} className="space-y-6">
        <Form.Item
          name="title"
          label={
            <FormLabel
              icon={FileText}
              text="Tiêu đề bài viết"
              color="text-blue-500"
            />
          }
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input.TextArea
            rows={2}
            placeholder="Nhập tiêu đề bài viết..."
            className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </Form.Item>

        <Form.Item
          name="content"
          label={
            <FormLabel
              icon={FileText}
              text="Nội dung bài viết"
              color="text-purple-500"
            />
          }
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <Input.TextArea
            rows={8}
            placeholder="Nhập nội dung bài viết..."
            className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </Form.Item>

        <Form.Item
          name="image"
          label={
            <FormLabel
              icon={ImageIcon}
              text="URL hình ảnh"
              color="text-green-500"
            />
          }
          rules={[{ required: true, message: "Vui lòng nhập link ảnh" }]}
        >
          <Input
            placeholder="https://example.com/image.jpg"
            className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
          />
        </Form.Item>

        <Form.Item
          name="tag"
          label={
            <FormLabel
              icon={Tag}
              text="Thẻ chủ đề (phân cách bằng dấu phẩy)"
              color="text-orange-500"
            />
          }
        >
          <Input
            placeholder="tag1, tag2, tag3"
            className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditPostModal;
