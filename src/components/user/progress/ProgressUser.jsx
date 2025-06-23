import React, { useState, useEffect, useMemo } from "react";
import ProgressHeader from "./ProgressHeader";
import JournalSection from "./JournalSection";
import { Card } from "antd";
import {
  SmileOutlined,
  HeartOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { TrendingUp } from "lucide-react";
import dayjs from "dayjs";

const getLocalJSON = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

function ProgressUser() {
  // Mock data - sẽ được thay thế bằng API sau này
  const mockQuitData = {
    quitDate: "2024-01-15",
    cigarettesPerDay: 20,
    pricePerPack: 50000,
    cigarettesPerPack: 20,
  };

  const [quitDate] = useState(new Date(mockQuitData.quitDate));
  const [cigarettesPerDay] = useState(mockQuitData.cigarettesPerDay);
  const [pricePerPack] = useState(mockQuitData.pricePerPack);
  const [cigarettesPerPack] = useState(mockQuitData.cigarettesPerPack);
  const [isLoading, setIsLoading] = useState(false);
  const [entries, setEntries] = useState(() =>
    getLocalJSON("smoke-free-journal", [])
  );
  const healthMilestones = useMemo(
    () => [
      {
        days: 1,
        title: "Giảm một nửa nguy cơ bệnh tim",
        description:
          "Sau chỉ 1 ngày không hút thuốc, huyết áp của bạn bắt đầu giảm.",
      },
      {
        days: 2,
        title: "Khí CO bị loại bỏ",
        description:
          "Sau 48 giờ không hút thuốc, carbon monoxide được loại bỏ khỏi cơ thể.",
      },
      {
        days: 3,
        title: "Hô hấp cải thiện",
        description:
          "Các ống phế quản bắt đầu thư giãn và hơi thở trở nên dễ dàng hơn.",
      },
      {
        days: 14,
        title: "Tuần hoàn cải thiện",
        description:
          "Tuần hoàn máu được cải thiện và chức năng phổi tăng lên đến 30%.",
      },
      {
        days: 30,
        title: "Phục hồi lông chuyển",
        description:
          "Phổi của bạn hiện đang bắt đầu lành lại và lông chuyển đang phục hồi.",
      },
      {
        days: 90,
        title: "Giảm nguy cơ đau tim",
        description: "Nguy cơ bị đau tim của bạn đã giảm đáng kể.",
      },
      {
        days: 180,
        title: "Chức năng phổi cải thiện",
        description: "Chức năng phổi của bạn đã được cải thiện đáng kể.",
      },
      {
        days: 270,
        title: "Giảm nhiễm trùng hô hấp",
        description: "Bạn đang gặp ít các bệnh nhiễm trùng đường hô hấp hơn.",
      },
      {
        days: 365,
        title: "Giảm một nửa nguy cơ bệnh tim",
        description:
          "Nguy cơ mắc bệnh tim mạch vành của bạn chỉ còn một nửa so với người hút thuốc.",
      },
      {
        days: 1825,
        title: "Nguy cơ đột quỵ bình thường hóa",
        description:
          "Nguy cơ đột quỵ của bạn đã giảm xuống như người không hút thuốc.",
      },
      {
        days: 3650,
        title: "Giảm một nửa nguy cơ ung thư phổi",
        description: "Nguy cơ ung thư phổi của bạn đã giảm 50%.",
      },
    ],
    []
  );
  useEffect(() => {
    localStorage.setItem("smoke-free-journal", JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = (entry) => {
    setEntries((prev) => {
      const filtered = prev.filter((e) => e.date !== entry.date);
      return [...filtered, entry].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    });
  };

  const stats = useMemo(() => {
    const now = new Date();
    const daysDiff = Math.floor((now - quitDate) / (1000 * 3600 * 24));
    const cigarettesAvoided = daysDiff * cigarettesPerDay;
    const packsAvoided = cigarettesAvoided / cigarettesPerPack;
    const moneySaved = packsAvoided * pricePerPack;
    const healthImprovement = Math.min((daysDiff / 365) * 100, 100);
    return {
      days: daysDiff,
      moneySaved,
      healthImprovement: healthImprovement.toFixed(1),
      cigarettesAvoided,
    };
  }, [quitDate, cigarettesPerDay, cigarettesPerPack, pricePerPack]);
  const currentMilestone = useMemo(
    () =>
      [...healthMilestones]
        .filter((m) => m.days <= stats.days)
        .sort((a, b) => b.days - a.days)[0],
    [stats.days, healthMilestones]
  );

  const last7DaysEntries = useMemo(
    () =>
      entries.filter(
        (entry) =>
          dayjs().diff(dayjs(entry.date), "day") >= 0 &&
          dayjs().diff(dayjs(entry.date), "day") < 7
      ),
    [entries]
  );
  return (
    <div className="w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <ProgressHeader
          quitDate={quitDate}
          stats={stats}
          healthMilestone={currentMilestone}
        />{" "}
        <JournalSection
          entries={entries}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />{" "}
        {stats.days >= 7 && last7DaysEntries.length > 0 && (
          <Card
            title={
              <div className="flex items-center">
                <TrendingUp className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
                  {" "}
                  Tóm Tắt 7 Ngày Gần Nhất{" "}
                </h2>
              </div>
            }
            className="bg-gradient-to-br from-white to-purple-50 border border-purple-200 text-purple-900 mt-12 shadow-md mb-12 rounded-xl overflow-hidden"
            styles={{
              header: {
                borderBottom: "1px solid #e5d8fd",
                padding: "20px 24px",
                backgroundColor: "white",
              },
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
              <div className="text-center p-6 bg-gradient-to-b from-white to-yellow-50 rounded-xl border border-yellow-200 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 hover:border-yellow-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                  <SmileOutlined className="text-2xl text-yellow-500" />
                </div>
                <h4 className="text-yellow-800 font-medium mb-3 text-lg">
                  Tâm trạng trung bình
                </h4>
                <p className="text-3xl font-bold text-yellow-600">
                  {last7DaysEntries.length > 0
                    ? (
                        last7DaysEntries.reduce((sum, e) => sum + e.mood, 0) /
                        last7DaysEntries.length
                      ).toFixed(1)
                    : "N/A"}
                  <span className="text-yellow-500 text-lg ml-1">/10</span>
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-b from-white to-blue-50 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 hover:border-blue-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <HeartOutlined className="text-2xl text-blue-500" />
                </div>
                <h4 className="text-blue-800 font-medium mb-3 text-lg">
                  Sức khỏe trung bình
                </h4>
                <p className="text-3xl font-bold text-blue-600">
                  {last7DaysEntries.length > 0
                    ? (
                        last7DaysEntries.reduce((sum, e) => sum + e.health, 0) /
                        last7DaysEntries.length
                      ).toFixed(1)
                    : "N/A"}
                  <span className="text-blue-500 text-lg ml-1">/10</span>
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-b from-white to-green-50 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 hover:border-green-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircleOutlined className="text-2xl text-green-500" />
                </div>
                <h4 className="text-green-800 font-medium mb-3 text-lg">
                  Ngày không thuốc
                </h4>
                <p className="text-3xl font-bold text-green-600">
                  {last7DaysEntries.length > 0
                    ? (
                        100 -
                        (last7DaysEntries.filter((e) => e.smoked).length /
                          last7DaysEntries.length) *
                          100
                      ).toFixed(0)
                    : "N/A"}
                  <span className="text-green-500 text-lg ml-1">%</span>
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ProgressUser;
