import React from "react";
import { Spin, Typography } from "antd";
import {
  useProgressData,
  useOverallStats,
  useUserStats,
} from "~/hooks/useProgress";

import FilterSection from "./FilterSection";
import OverallStatsCard from "./OverallStatsCard";
import UserStatsCard from "./UserStatsCard";
import ProgressTable from "./ProgressTable";

const { Title } = Typography;

function CoachProgress() {
  const {
    users,
    filteredProgressData,
    loading,
    selectedUser,
    dateRange,
    handleUserSelect,
    setDateRange,
  } = useProgressData();

  const overallStats = useOverallStats(filteredProgressData);
  const userStats = useUserStats(selectedUser, filteredProgressData);

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Spin size="large">
          <div className="pt-8">
            <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
          </div>
        </Spin>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Tiêu đề trung tâm */}
        <div className="text-center mb-6">
          <Title
            level={2}
            className="!m-0 text-gray-800 flex justify-center items-center"
          >
            Tiến độ học viên
          </Title>
        </div>

        {/* Bộ lọc */}
        <div className="bg-white border shadow-sm rounded-2xl p-4">
          <FilterSection
            users={users}
            selectedUser={selectedUser}
            onUserSelect={handleUserSelect}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            filteredDataLength={filteredProgressData.length}
          />
        </div>

        {/* Thống kê tổng quát hoặc theo học viên */}
        {filteredProgressData.length > 0 && !selectedUser && (
          <div className="bg-white border shadow-sm rounded-2xl p-4">
            <OverallStatsCard overallStats={overallStats} />
          </div>
        )}

        {selectedUser && (
          <div className="bg-white border shadow-sm rounded-2xl p-4">
            <UserStatsCard userStats={userStats} />
          </div>
        )}

        {/* Bảng tiến độ */}
        <div className="bg-white border shadow-sm rounded-2xl p-4">
          <ProgressTable data={filteredProgressData} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default CoachProgress;
