import React from "react";
import { Card, Typography, Row, Col, Select, DatePicker, Avatar } from "antd";
import { FilterOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const FilterSection = ({
  users,
  selectedUser,
  onUserSelect,
  dateRange,
  onDateRangeChange,
  filteredDataLength,
}) => {
  return (
    <Card className="mb-6 shadow-sm">
      <Title level={4} className="mb-4">
        <FilterOutlined className="mr-2" />
        Bộ lọc
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Text strong className="block mb-2">
            Người dùng:
          </Text>
          <Select
            placeholder="Chọn người dùng"
            value={selectedUser}
            onChange={onUserSelect}
            className="w-full"
            allowClear
          >
            <Option key="all" value={null}>
              <div className="flex items-center gap-2">
                <Avatar icon={<UserOutlined />} size={20} />
                <Text strong>Tất cả người dùng</Text>
              </div>
            </Option>
            {users.map((user) => (
              <Option key={user.key} value={user.user_id || user._id}>
                <div className="flex items-center gap-2">
                  <Avatar
                    src={user.avatar}
                    icon={!user.avatar && <UserOutlined />}
                    size={20}
                  />
                  {user.name || "Không có tên"}
                </div>
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Text strong className="block mb-2">
            Khoảng thời gian:
          </Text>
          <RangePicker
            className="w-full"
            format="DD/MM/YYYY"
            value={dateRange}
            onChange={onDateRangeChange}
            placeholder={["Từ ngày", "Đến ngày"]}
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Text strong className="block mb-2">
            Tổng bản ghi:
          </Text>
          <div className="text-2xl font-bold text-blue-600">
            {filteredDataLength}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default FilterSection;
