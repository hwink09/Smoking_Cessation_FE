import React from "react";
import { Spin, Typography, Button } from "antd";
import { TrophyOutlined, ReloadOutlined } from "@ant-design/icons";

// Import components
import FilterSection from "./FilterSection";
import OverallStatsCard from "./OverallStatsCard";
import UserStatsCard from "./UserStatsCard";
import ProgressTable from "./ProgressTable";

// Import hooks
import {
  useProgressData,
  useOverallStats,
  useUserStats,
} from "~/hooks/useProgress";

const { Title } = Typography;

function CoachProgress() {
  // Sử dụng custom hooks
  const {
    users,
    filteredProgressData,
    loading,
    selectedUser,
    dateRange,
    handleUserSelect,
    handleRefresh,
    setDateRange,
  } = useProgressData();

  const overallStats = useOverallStats(filteredProgressData);
  const userStats = useUserStats(selectedUser, filteredProgressData);

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
        {/* Header */}
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
        <FilterSection
          users={users}
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          filteredDataLength={filteredProgressData.length}
        />

        {/* Overall Stats - Hiển thị khi không chọn user cụ thể */}
        {!selectedUser && filteredProgressData.length > 0 && (
          <OverallStatsCard overallStats={overallStats} />
        )}

        {/* User Detail Stats - Hiển thị khi chọn user cụ thể */}
        {selectedUser && <UserStatsCard userStats={userStats} />}

        {/* Progress Table */}
        <ProgressTable data={filteredProgressData} loading={loading} />
      </div>
    </div>
  );
}

export default CoachProgress;
