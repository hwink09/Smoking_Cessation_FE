import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  Card,
  Avatar,
  message,
  Select,
  Tag,
  Spin,
  Typography,
  Row,
  Col,
  Statistic,
  Button,
  DatePicker,
  Progress,
  Empty,
} from "antd";
import {
  UserOutlined,
  TrophyOutlined,
  CalendarOutlined,
  SmileOutlined,
  FilterOutlined,
  ReloadOutlined,
  BarChartOutlined,
  FireOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import QuitPlanService from "~/services/quitPlanService";
import { getAllProgress } from "~/services/progressService";
import { getUserOverallProgressAPI } from "~/services/progressService";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

function CoachProgress() {
  const [users, setUsers] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [healthStatusFilter, setHealthStatusFilter] = useState(null);

  // Fetch danh sách user của coach
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await QuitPlanService.coach.getMyUsers();
      const usersWithKeys = (response || []).map((user, index) => ({
        ...user,
        key: user._id || user.user_id || `user-${index}`,
      }));
      setUsers(usersWithKeys);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách user:", err);
      message.error("Không thể lấy danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch progress data của tất cả users
  const fetchProgressData = useCallback(async () => {
    if (users.length === 0) return;

    setLoading(true);
    try {
      const response = await getAllProgress();
      // Lọc chỉ lấy progress của users mà coach đang quản lý
      const userIds = users.map((user) => user.user_id || user._id);
      const filteredProgress = (response || []).filter((progress) =>
        userIds.includes(progress.user_id?._id || progress.user_id)
      );
      setProgressData(filteredProgress);
    } catch (err) {
      console.error("Lỗi khi lấy tiến độ:", err);
      message.error("Không thể lấy dữ liệu tiến độ");
    } finally {
      setLoading(false);
    }
  }, [users]);

  // Fetch thống kê của user được chọn
  const fetchUserStats = useCallback(async (userId) => {
    setStatsLoading(true);
    try {
      const response = await getUserOverallProgressAPI(userId);
      setUserStats(response);
    } catch (err) {
      console.error("Lỗi khi lấy thống kê user:", err);
      message.error("Không thể lấy thống kê người dùng");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  // Handle chọn user
  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    if (userId) {
      fetchUserStats(userId);
    } else {
      setUserStats(null);
    }
  };

  // Handle refresh data
  const handleRefresh = useCallback(async () => {
    await fetchUsers();
    if (selectedUser) {
      await fetchUserStats(selectedUser);
    }
  }, [fetchUsers, fetchUserStats, selectedUser]);

  // Filter progress data theo các điều kiện
  const filteredProgressData = useMemo(() => {
    let filtered = progressData;

    // Filter theo user được chọn
    if (selectedUser) {
      filtered = filtered.filter(
        (progress) =>
          (progress.user_id?._id || progress.user_id) === selectedUser
      );
    }

    // Filter theo date range
    if (dateRange && dateRange.length === 2) {
      filtered = filtered.filter((progress) => {
        const progressDate = dayjs(progress.date);
        return (
          progressDate.isAfter(dateRange[0]) &&
          progressDate.isBefore(dateRange[1])
        );
      });
    }

    // Filter theo health status
    if (healthStatusFilter) {
      filtered = filtered.filter(
        (progress) => progress.health_status === healthStatusFilter
      );
    }

    return filtered;
  }, [progressData, selectedUser, dateRange, healthStatusFilter]);

  // Tính toán thống kê tổng quan
  const overallStats = useMemo(() => {
    const totalSmokeFreeDays = filteredProgressData.filter(
      (p) => p.cigarettes_smoked === 0
    ).length;
    const totalMoneySaved = filteredProgressData.reduce(
      (sum, p) => sum + (p.money_saved || 0),
      0
    );
    const averageCigarettes =
      filteredProgressData.length > 0
        ? filteredProgressData.reduce(
            (sum, p) => sum + (p.cigarettes_smoked || 0),
            0
          ) / filteredProgressData.length
        : 0;

    return {
      totalSmokeFreeDays,
      totalMoneySaved,
      averageCigarettes: Math.round(averageCigarettes * 10) / 10,
      totalRecords: filteredProgressData.length,
    };
  }, [filteredProgressData]);

  // Columns cho bảng tiến độ
  const columns = [
    {
      title: "Người dùng",
      dataIndex: "user_id",
      key: "user_id",
      width: 200,
      fixed: "left",
      render: (user) => (
        <div className="flex items-center gap-2">
          <Avatar
            src={user?.avatar_url}
            icon={!user?.avatar_url && <UserOutlined />}
            size={32}
          />
          <div>
            <div className="font-medium">{user?.name || "Không có tên"}</div>
            <div className="text-gray-500 text-sm">
              {user?.email || "Không có email"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "Số điếu thuốc",
      dataIndex: "cigarettes_smoked",
      key: "cigarettes_smoked",
      width: 150,
      render: (count) => (
        <div className="flex items-center gap-2">
          <Tag color={count === 0 ? "green" : count <= 5 ? "orange" : "red"}>
            {count} điếu
          </Tag>
          {count === 0 && <FireOutlined style={{ color: "#52c41a" }} />}
        </div>
      ),
      sorter: (a, b) => a.cigarettes_smoked - b.cigarettes_smoked,
    },
    {
      title: "Tiền tiết kiệm",
      dataIndex: "money_saved",
      key: "money_saved",
      width: 150,
      render: (money) => (
        <div className="flex items-center gap-2">
          <DollarOutlined style={{ color: "#52c41a" }} />
          <Text className="font-medium text-green-600">
            {(money || 0).toLocaleString()} VNĐ
          </Text>
        </div>
      ),
      sorter: (a, b) => (a.money_saved || 0) - (b.money_saved || 0),
    },
    {
      title: "Sức khỏe",
      dataIndex: "health_status",
      key: "health_status",
      width: 120,
      render: (status) => {
        const statusConfig = {
          good: { color: "green", text: "Tốt" },
          fair: { color: "orange", text: "Trung bình" },
          poor: { color: "red", text: "Kém" },
        };
        const config = statusConfig[status] || statusConfig.fair;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: "Tốt", value: "good" },
        { text: "Trung bình", value: "fair" },
        { text: "Kém", value: "poor" },
      ],
      onFilter: (value, record) => record.health_status === value,
    },
    {
      title: "Giai đoạn",
      dataIndex: "stage_id",
      key: "stage_id",
      width: 200,
      render: (stage) => (
        <div>
          <div className="font-medium">
            {stage?.title || "Không có tiêu đề"}
          </div>
          <div className="text-gray-500 text-sm">
            Giai đoạn {stage?.stage_number || "N/A"}
          </div>
        </div>
      ),
    },
  ];

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large">
          <div className="pt-12">
            <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
          </div>
        </Spin>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="m-0">
            <TrophyOutlined className="mr-2" />
            Tiến độ của học viên
          </Title>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Làm mới
          </Button>
        </div>

        {/* Filter Section */}
        <Card className="mb-6 shadow-sm">
          <Title level={4} className="mb-4">
            <FilterOutlined className="mr-2" />
            Bộ lọc
          </Title>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Text strong className="block mb-2">
                Người dùng:
              </Text>
              <Select
                placeholder="Chọn người dùng"
                value={selectedUser}
                onChange={handleUserSelect}
                className="w-full"
                allowClear
              >
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
                onChange={setDateRange}
                placeholder={["Từ ngày", "Đến ngày"]}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Text strong className="block mb-2">
                Trạng thái sức khỏe:
              </Text>
              <Select
                placeholder="Chọn trạng thái"
                value={healthStatusFilter}
                onChange={setHealthStatusFilter}
                className="w-full"
                allowClear
              >
                <Option value="good">Tốt</Option>
                <Option value="fair">Trung bình</Option>
                <Option value="poor">Kém</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Text strong className="block mb-2">
                Tổng bản ghi:
              </Text>
              <div className="text-2xl font-bold text-blue-600">
                {filteredProgressData.length}
              </div>
            </Col>
          </Row>
        </Card>

        {/* User Detail Stats */}
        {selectedUser && userStats && (
          <Card className="mb-6 shadow-sm" loading={statsLoading}>
            <Title level={4} className="mb-4">
              <SmileOutlined className="mr-2" />
              Thống kê chi tiết người dùng
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
                <div>
                  <Text strong>Tiến độ trung bình</Text>
                  <div className="mt-2">
                    <Progress
                      percent={userStats.average_progress || 0}
                      strokeColor={{
                        from: "#108ee9",
                        to: "#87d068",
                      }}
                      trailColor="#f5f5f5"
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Progress Table */}
        <Card className="shadow-sm">
          <Title level={4} className="mb-4">
            Bảng tiến độ chi tiết
          </Title>

          {filteredProgressData.length === 0 ? (
            <Empty
              description={
                selectedUser
                  ? "Người dùng này chưa có dữ liệu tiến độ"
                  : "Chưa có dữ liệu tiến độ"
              }
              className="py-8"
            />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredProgressData}
              rowKey={(record) => record._id || record.id}
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} bản ghi`,
              }}
              scroll={{ x: 1200 }}
              size="middle"
            />
          )}
        </Card>
      </div>
    </div>
  );
}

export default CoachProgress;
