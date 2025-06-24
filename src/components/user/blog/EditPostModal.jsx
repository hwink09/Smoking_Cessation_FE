import { Modal, Form, Input, message } from "antd";
import { useEffect } from "react";
import { usePostData } from "~/hooks/usePostData";


function EditPostModal({ visible, onClose, postId, initialData, refetchUserPosts }) {
  const { updatePost } = usePostData();
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialData) {
      form.setFieldsValue({
        title: initialData.title,
        content: initialData.content,
        image: initialData.image,
        tag: initialData.tag?.join(", ") || "", // chuyển mảng thành chuỗi
      });
    }
  }, [visible, initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        title: values.title,
        content: values.content,
        image: values.image,
        tag: values.tag.split(",").map((tag) => tag.trim()), // chuỗi → mảng
      };

      await updatePost(postId, payload);
      message.success("Cập nhật bài viết thành công!");
       await refetchUserPosts?.();
      onClose();
    } catch (err) {
      console.error("Validation or update error:", err);
      message.error("Có lỗi xảy ra khi cập nhật");
    }
  };

  return (
    <Modal
      title="Chỉnh sửa bài viết"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập nội dung tiều đề" />
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập nội dung bài viết" />
        </Form.Item>

        <Form.Item
          name="image"
          label="Link ảnh"
          rules={[{ required: true, message: "Vui lòng nhập link ảnh" }]}
        >
          <Input placeholder="https://example.com/image.jpg" />
        </Form.Item>

        <Form.Item name="tag" label="Tags (phân cách bằng dấu phẩy)">
          <Input placeholder="tag1, tag2, tag3" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditPostModal;
