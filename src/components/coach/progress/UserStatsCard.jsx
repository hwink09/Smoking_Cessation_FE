import React from "react";
import { Card, Typography, Row, Col, Statistic } from "antd";
import { SmileOutlined } from "@ant-design/icons";

const { Title } = Typography;

const UserStatsCard = ({ userStats }) => {
  if (!userStats) return null;

  return (
    <Card className="mb-6 shadow-sm">
      <Title level={4} className="mb-4">
        <SmileOutlined className="mr-2" />
        Thống kê chi tiết người dùng (theo bộ lọc)
      </Title>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Ngày không hút thuốc"
            value={userStats.total_smoke_free_days || 0}
            suffix="ngày"
            valueStyle={{ color: "#52c41a" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Tổng tiền tiết kiệm"
            value={userStats.total_money_saved || 0}
            suffix="VNĐ"
            valueStyle={{ color: "#faad14" }}
            formatter={(value) => value.toLocaleString()}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Điếu thuốc tiết kiệm"
            value={userStats.total_cigarettes_saved || 0}
            suffix="điếu"
            valueStyle={{ color: "#1890ff" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="TB điếu/ngày"
            value={userStats.average_cigarettes_per_day || 0}
            suffix="điếu"
            valueStyle={{ color: "#722ed1" }}
          />
        </Col>
      </Row>
      <Row gutter={16} className="mt-4">
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Tổng số bản ghi"
            value={userStats.total_records || 0}
            suffix="ngày"
            valueStyle={{ color: "#f5222d" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Tỷ lệ không hút"
            value={
              userStats.total_records > 0
                ? Math.round(
                    (userStats.total_smoke_free_days /
                      userStats.total_records) *
                      100
                  )
                : 0
            }
            suffix="%"
            valueStyle={{ color: "#52c41a" }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default UserStatsCard;
