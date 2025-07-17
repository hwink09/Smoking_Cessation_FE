import { Card } from "antd";
import { TrendingDown } from "lucide-react";
import dayjs from "dayjs";

const Stat = ({ label, value, unit = "" }) => (
  <div className="text-center p-4 bg-white rounded-lg border border-blue-100">
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <p className="text-2xl font-bold text-blue-700">
      {value} {unit && <span className="text-sm text-gray-500">{unit}</span>}
    </p>
  </div>
);

function calculateMoneySaved(smokingStatus, cigarettesSmoked) {
  if (!smokingStatus || smokingStatus.cigarettesPerDay <= 0) return 0;
  const { cigarettesPerDay, costPerPack, cigarettesPerPack } = smokingStatus;
  const reduction = Math.max(0, cigarettesPerDay - cigarettesSmoked);
  const costPerCigarette = costPerPack / cigarettesPerPack;
  return Math.round(reduction * costPerCigarette);
}

function calculateSmokeFreeStreak(entries) {
  const sorted = [...entries].sort(
    (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
  );

  let streak = 0;
  for (const entry of sorted) {
    if ((entry.cigarettes_smoked || 0) === 0) streak++;
    else break;
  }
  return streak;
}

const JournalStats = ({
  entries,
  groupedEntries,
  smokingStatus,
  planTotalStats,
}) => {
  if (!(entries.length > 0 || planTotalStats) || !smokingStatus) return null;

  return (
    entries.length > 0 && (
      <Card
        title={
          <div className="flex items-center">
            <TrendingDown className="text-2xl text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-cyan-700 bg-clip-text text-transparent">
              Thống Kê Theo Giai Đoạn Hiện Tại
            </h2>
          </div>
        }
        className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 text-blue-900"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Stat label="Số ngày đã ghi nhật ký" value={groupedEntries.length} />
          <Stat
            label="Số ngày cai thuốc hoàn toàn"
            value={
              entries.filter((e) => (e.cigarettes_smoked || 0) === 0).length
            }
          />
          <Stat
            label="Tiền tiết kiệm trong giai đoạn này"
            value={entries
              .reduce(
                (sum, e) =>
                  sum +
                  calculateMoneySaved(smokingStatus, e.cigarettes_smoked || 0),
                0
              )
              .toLocaleString("vi-VN")}
            unit="VND"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Stat
            label="Điếu đã hút trong giai đoạn này"
            value={entries.reduce(
              (sum, e) => sum + (e.cigarettes_smoked || 0),
              0
            )}
          />
          <Stat
            label="Chuỗi ngày không hút trong giai đoạn này"
            value={calculateSmokeFreeStreak(entries)}
          />
        </div>
      </Card>
    )
  );
};

export default JournalStats;
