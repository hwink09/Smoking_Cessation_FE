import React from "react";
import { Card } from "antd";
import CoachCard from "./CoachCard";
import QuitPlanModal from "./QuitPlanModal";
import QuitPlanHeader from "./QuitPlanHeader";

const CoachSelectionView = ({
  coaches,
  selectedCoach,
  onSelectCoach,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="min-h-screen text-slate-800 p-4 max-w-6xl mx-auto">
      <QuitPlanHeader />

      <Card
        className="border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
        title={
          <div className="flex items-center gap-3 py-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Danh sách huấn luyện viên
              </h3>
              <p className="text-sm text-gray-500">
                Chọn một huấn luyện viên phù hợp để bắt đầu hành trình cai thuốc
              </p>
            </div>
          </div>
        }
        styles={{
          header: {
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            borderBottom: "1px solid #e2e8f0",
          },
          body: { padding: 24 },
        }}
      >
        {coaches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {coaches.map((coach) => (
              <CoachCard
                key={coach._id}
                coach={coach}
                onSelectCoach={onSelectCoach}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12 text-gray-500">
            <svg
              className="w-12 h-12 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <div className="text-lg font-medium mb-1">
              Chưa có huấn luyện viên
            </div>
            <p className="text-sm text-gray-400">
              Hiện tại chưa có huấn luyện viên khả dụng!
            </p>
          </div>
        )}
      </Card>

      <QuitPlanModal
        visible={!!selectedCoach}
        onCancel={onCancel}
        onSubmit={onSubmit}
        coach={selectedCoach}
      />
    </div>
  );
};

export default CoachSelectionView;
