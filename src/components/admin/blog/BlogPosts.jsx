import React, { useState } from "react";
import { Card, Button, Modal, Input, Tag, Spin } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { usePostData } from "~/hooks/usePostData";

const BlogPosts = () => {
  const {
    posts: blogs,
    tags,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
  } = usePostData();

  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    tags: [],
  });
  const [errors, setErrors] = useState({});
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const handleNew = () => {
    setIsNew(true);
    setFormData({ title: "", content: "", image: "", tags: [] });
    setEditingBlog(true);
    setErrors({});
  };

  const validate = () => {
    const err = {};
    if (!formData.title) err.title = "Tiêu đề không được để trống.";
    if (!formData.content) err.content = "Nội dung không được để trống.";
    if (!formData.image) err.image = "Hình ảnh không được để trống.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (isNew) {
        await createPost(formData);
      } else if (editingBlog) {
        await updatePost(editingBlog._id, formData);
      }
      setEditingBlog(null);
      setIsNew(false);
      setFormData({ title: "", content: "", image: "", tags: [] });
    } catch (e) {
      console.error("Save failed:", e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  const getTagTitle = (id) => {
    const tag = tags.find((t) => t._id === id || t.id === id);
    return tag?.title || "Không rõ";
  };

  const modalForm = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input
        placeholder="Tiêu đề bài viết"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        status={errors.title ? "error" : ""}
      />
      {errors.title && <div style={{ color: "#ff4d4f" }}>{errors.title}</div>}
      <Input.TextArea
        placeholder="Nội dung bài viết"
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        rows={5}
        status={errors.content ? "error" : ""}
      />
      {errors.content && (
        <div style={{ color: "#ff4d4f" }}>{errors.content}</div>
      )}
      <Input
        placeholder="URL hình ảnh"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        status={errors.image ? "error" : ""}
      />
      {errors.image && <div style={{ color: "#ff4d4f" }}>{errors.image}</div>}
      {formData.image && (
        <img
          src={formData.image}
          alt="Xem trước"
          style={{
            marginTop: 12,
            width: "100%",
            height: 160,
            objectFit: "cover",
            borderRadius: 8,
          }}
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/300x200?text=Không+tìm+thấy+hình+ảnh")
          }
        />
      )}
      <div>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>Thẻ</div>
        <div
          style={{
            maxHeight: 160,
            overflowY: "auto",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 12,
          }}
        >
          {tags.map((tag) => (
            <label
              key={tag._id}
              style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
            >
              <input
                type="checkbox"
                checked={formData.tags.includes(tag._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      tags: [...formData.tags, tag._id],
                    });
                  } else {
                    setFormData({
                      ...formData,
                      tags: formData.tags.filter((id) => id !== tag._id),
                    });
                  }
                }}
                style={{ marginRight: 8 }}
              />
              <span>{tag.title}</span>
            </label>
          ))}
        </div>
        {formData.tags.length > 0 && (
          <div
            style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}
          >
            {formData.tags.map((id) => (
              <Tag key={id} color="cyan">
                {getTagTitle(id)}
              </Tag>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (loading && blogs.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#ff4d4f",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <section
      style={{ padding: "40px 0", background: "#f9fafb", minHeight: "100vh" }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto 32px",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          shape="round"
          size="large"
          onClick={handleNew}
        >
          Bài viết mới
        </Button>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 24,
        }}
      >
        {blogs.map((blog) => (
          <Card
            key={blog._id}
            hoverable
            style={{ borderRadius: 16, boxShadow: "0 2px 8px #f0f1f2" }}
            cover={
              blog.image ? (
                <img
                  src={blog.image}
                  alt={blog.title}
                  style={{
                    width: "100%",
                    height: 192,
                    objectFit: "cover",
                    borderRadius: "16px 16px 0 0",
                  }}
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/300x200?text=Không+tìm+thấy+hình+ảnh")
                  }
                />
              ) : null
            }
            actions={[
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setBlogToDelete(blog._id);
                  setShowConfirm(true);
                }}
                key="delete"
              >
                Xoá
              </Button>,
            ]}
          >
            <Link
              to={`/admin/blogs/${blog._id}`}
              state={{ blog }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Card.Meta
                title={<div style={{ fontWeight: 600 }}>{blog.title}</div>}
                description={
                  <>
                    <div style={{ color: "#666", marginBottom: 8 }}>
                      Bởi {blog.user_id?.name || "Tác giả không xác định"}
                    </div>
                    <div
                      style={{
                        color: "#888",
                        minHeight: 48,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {blog.content}
                    </div>
                    {blog.tags && blog.tags.length > 0 && (
                      <div
                        style={{
                          marginTop: 8,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <Tag key={tag._id || tag || index} color="cyan">
                            {getTagTitle(tag._id || tag)}
                          </Tag>
                        ))}
                        {blog.tags.length > 3 && (
                          <span style={{ color: "#888" }}>
                            +{blog.tags.length - 3} thêm
                          </span>
                        )}
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        fontSize: 13,
                        color: "#888",
                        marginTop: 12,
                      }}
                    >
                      <span>❤️ {blog.reaction_count}</span>
                      <span>💬 {blog.comment_count}</span>
                      <span>
                        📅 {new Date(blog.post_date).toLocaleDateString()}
                      </span>
                    </div>
                  </>
                }
              />
            </Link>
          </Card>
        ))}
      </div>

      <Modal
        open={!!editingBlog}
        title={isNew ? "Tạo bài viết mới" : "Chỉnh sửa bài viết"}
        onCancel={() => {
          setEditingBlog(null);
          setIsNew(false);
        }}
        onOk={handleSave}
        confirmLoading={loading}
        okText={isNew ? "Thêm" : "Lưu"}
        cancelText="Hủy"
        destroyOnClose
      >
        {modalForm}
      </Modal>

      <Modal
        open={showConfirm}
        title="Xác nhận xoá"
        onCancel={() => {
          setShowConfirm(false);
          setBlogToDelete(null);
        }}
        onOk={() => {
          handleDelete(blogToDelete);
          setShowConfirm(false);
          setBlogToDelete(null);
        }}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
        icon={<ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />}
        destroyOnClose
      >
        Bạn có chắc chắn muốn xoá bài viết này không?
      </Modal>
    </section>
  );
};

export default BlogPosts;
