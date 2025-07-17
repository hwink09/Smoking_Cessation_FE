import React from "react";
import { Card, Typography, Row, Col, Statistic } from "antd";
import { BarChartOutlined } from "@ant-design/icons";

const { Title } = Typography;

const OverallStatsCard = ({ overallStats }) => {
  if (!overallStats) return null;

  return (
    <Card className="mb-6 shadow-sm">
      <Title level={4} className="mb-4">
        <BarChartOutlined className="mr-2" />
        Thống kê tổng quan (theo bộ lọc)
      </Title>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Tổng ngày không hút"
            value={overallStats.totalSmokeFreeDays}
            suffix="ngày"
            valueStyle={{ color: "#52c41a" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Tổng tiền tiết kiệm"
            value={overallStats.totalMoneySaved}
            suffix="VNĐ"
            valueStyle={{ color: "#faad14" }}
            formatter={(value) => value.toLocaleString()}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="TB điếu/ngày"
            value={overallStats.averageCigarettes}
            suffix="điếu"
            valueStyle={{ color: "#1890ff" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Tỷ lệ không hút"
            value={overallStats.smokeFreeRate}
            suffix="%"
            valueStyle={{ color: "#722ed1" }}
          />
        </Col>
      </Row>
      <Row gutter={16} className="mt-4">
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Số người dùng"
            value={overallStats.uniqueUsers}
            suffix="người"
            valueStyle={{ color: "#f5222d" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Tổng bản ghi"
            value={overallStats.totalRecords}
            suffix="ngày"
            valueStyle={{ color: "#13c2c2" }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default OverallStatsCard;
