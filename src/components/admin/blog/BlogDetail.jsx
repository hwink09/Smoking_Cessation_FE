import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Card,
  Typography,
  Tag,
  Button,
  Result,
  Image,
  Row,
  Col,
  Space,
} from "antd";

const { Title, Text, Paragraph } = Typography;

const BlogDetail = () => {
  const navigate = useNavigate();
  const { blog } = useLocation().state || {};

  if (!blog) {
    return (
      <Result
        status="404"
        title="Không tìm thấy bài viết"
        extra={
          <Button type="primary" onClick={() => navigate("/admin/blogs")}>
            Quay lại danh sách Blog
          </Button>
        }
      />
    );
  }

  return (
    <Row justify="center" style={{ marginTop: 40 }}>
      <Col xs={24} sm={22} md={20} lg={16} xl={12}>
        <Card
          bordered={false}
          style={{ boxShadow: "0 2px 8px #f0f1f2" }}
          styles={{ body: { padding: 32 } }}
        >
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/blogs")}
            style={{ marginBottom: 24, paddingLeft: 0 }}
          >
            Quay lại danh sách Blog
          </Button>

          <Title level={2} style={{ marginBottom: 8 }}>
            {blog.title}
          </Title>
          <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
            Tác giả: {blog.user_id?.name || "Không xác định"}
          </Text>

          <Image
            src={
              blog.image ||
              "https://via.placeholder.com/600x300?text=Không+tìm+thấy+hình+ảnh"
            }
            alt="Hình ảnh bài viết"
            style={{
              width: "100%",
              maxHeight: 300,
              objectFit: "cover",
              borderRadius: 8,
              marginBottom: 24,
            }}
            fallback="https://via.placeholder.com/600x300?text=Không+tìm+thấy+hình+ảnh"
            preview={!!blog.image}
          />

          <Paragraph style={{ marginBottom: 24, color: "#444" }}>
            {blog.content}
          </Paragraph>

          {blog.tags && blog.tags.length > 0 && (
            <Space wrap style={{ marginBottom: 24 }}>
              {blog.tags.map((tag, idx) => (
                <Tag color="cyan" key={tag._id || tag || idx}>
                  {tag.title || tag}
                </Tag>
              ))}
            </Space>
          )}

          <Space size="large" style={{ marginBottom: 0 }}>
            <Text type="danger">❤️ {blog.reaction_count || 0}</Text>
            <Text type="secondary">💬 {blog.comment_count || 0}</Text>
            <Text type="success">
              📅{" "}
              {blog.post_date
                ? new Date(blog.post_date).toLocaleDateString("vi-VN")
                : ""}
            </Text>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default BlogDetail;
