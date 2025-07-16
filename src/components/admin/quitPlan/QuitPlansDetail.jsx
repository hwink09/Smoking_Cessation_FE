import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Card, Typography, Button, Result, Row, Col, Space } from "antd";

const { Title, Text } = Typography;

const QuitPlanDetailPageAdmin = () => {
  const navigate = useNavigate();
  const { plan } = useLocation().state || {};

  if (!plan) {
    return (
      <Result
        status="404"
        title="Không tìm thấy kế hoạch"
        extra={
          <Button type="primary" onClick={() => navigate("/admin/quit-plans")}>Quay lại danh sách Kế Hoạch</Button>
        }
      />
    );
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: '40px 0' }}>
      <Row justify="center" style={{ marginTop: 40 }}>
        <Col xs={24} sm={22} md={20} lg={16} xl={12}>
          <Card
            bordered={false}
            style={{ boxShadow: "0 2px 8px #f0f1f2" }}
            bodyStyle={{ padding: 32 }}
          >
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/admin/quit-plans")}
              style={{ marginBottom: 24, paddingLeft: 0 }}
            >
              Quay lại danh sách Kế Hoạch
            </Button>

            <Title level={2} style={{ marginBottom: 8 }}>{plan.name}</Title>
            <Space direction="vertical" size="middle" style={{ marginBottom: 24 }}>
              <Text type="secondary">Lý do: {plan.reason}</Text>
              <Text type="secondary">
                Người dùng: {typeof plan.user_id === 'object' && plan.user_id !== null
                  ? `${plan.user_id.name} (${plan.user_id.email})`
                  : plan.user_id}
              </Text>
              <Text type="secondary">
                Ngày bắt đầu: {plan.start_date ? new Date(plan.start_date).toLocaleDateString('vi-VN') : ''}
              </Text>
              <Text type="secondary">
                Ngày mục tiêu: {plan.target_quit_date ? new Date(plan.target_quit_date).toLocaleDateString('vi-VN') : ''}
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default QuitPlanDetailPageAdmin;
