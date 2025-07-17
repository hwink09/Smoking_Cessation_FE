import { Card, List, Empty, Badge, Spin } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { Calendar, Cigarette, Heart, TrendingDown } from "lucide-react";
import dayjs from "dayjs";

function calculateMoneySaved(smokingStatus, cigarettesSmoked) {
  if (!smokingStatus || smokingStatus.cigarettesPerDay <= 0) return 0;
  const { cigarettesPerDay, costPerPack, cigarettesPerPack } = smokingStatus;
  const reduction = Math.max(0, cigarettesPerDay - cigarettesSmoked);
  const costPerCigarette = costPerPack / cigarettesPerPack;
  return Math.round(reduction * costPerCigarette);
}

const JournalHistory = ({ groupedEntries, smokingStatus, isLoading }) => {
  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarOutlined className="text-2xl text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
              Lịch Sử Nhật Ký
            </h2>
          </div>
          <Badge count={groupedEntries.length} showZero />
        </div>
      }
      className="bg-gradient-to-br from-white to-purple-50 border border-purple-200"
    >
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : groupedEntries.length === 0 ? (
          <Empty description="Chưa có nhật ký nào" className="py-12" />
        ) : (
          <List
            dataSource={groupedEntries}
            renderItem={([date, entriesForDate]) => {
              const latestEntry = entriesForDate[entriesForDate.length - 1];
              return (
                <List.Item className="px-0 py-4 border-b border-purple-100 last:border-0">
                  <Card className="bg-gradient-to-r from-white to-purple-50 border border-purple-200">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-800 flex items-center mb-3">
                        <CalendarOutlined className="mr-2" />
                        {dayjs(date).format("DD/MM/YYYY")} -{" "}
                        {dayjs(date).format("dddd")}
                      </h3>

                      <div className="p-3 bg-white rounded-lg border border-purple-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <p className="flex items-center">
                            <Cigarette className="inline w-4 h-4 mr-2 text-red-500" />
                            <span className="font-medium">Số điếu: </span>{" "}
                            {latestEntry.cigarettes_smoked || 0}
                          </p>
                          {latestEntry.health_status && (
                            <p className="flex items-center">
                              <Heart className="inline w-4 h-4 mr-2 text-pink-500" />
                              <span className="font-medium">Triệu chứng:</span>{" "}
                              {latestEntry.health_status}
                            </p>
                          )}
                          <p className="flex items-center">
                            <TrendingDown className="inline w-4 h-4 mr-2 text-green-500" />
                            <span className="font-medium">Tiết kiệm:</span>{" "}
                            <span className="font-semibold text-green-600 ml-1">
                              {(
                                latestEntry.money_saved ||
                                calculateMoneySaved(
                                  smokingStatus,
                                  latestEntry.cigarettes_smoked || 0
                                )
                              ).toLocaleString("vi-VN")}{" "}
                              VND
                            </span>
                          </p>
                        </div>
                        {latestEntry.time && (
                          <p className="text-sm text-gray-500 mt-2">
                            Ghi lúc: {latestEntry.time}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </List.Item>
              );
            }}
          />
        )}
      </div>
    </Card>
  );
};

export default JournalHistory;
