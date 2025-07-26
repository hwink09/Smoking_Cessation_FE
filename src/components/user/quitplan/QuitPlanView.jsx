import React from "react";
import { Card } from "antd";
import { DetailedCoachInfo } from "~/components/common/QuitPlanComponents";
import UserStageView from "./UserStageView";
import QuitPlanHeader from "./QuitPlanHeader";

const SectionTitle = ({ iconBg, iconSvg, title, subtitle, gradient }) => (
  <div className="flex items-center gap-3 py-2">
    <div className={`p-2 ${iconBg} rounded-lg`}>{iconSvg}</div>
    <div>
      <h3
        className={`text-xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
      >
        {title}
      </h3>
      <p className="text-sm text-gray-500 m-0">{subtitle}</p>
    </div>
  </div>
);

const QuitPlanView = ({ userQuitPlan }) => {
  const cardStyles = {
    header: {
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      borderBottom: "1px solid #e2e8f0",
    },
    body: { padding: 24 },
  };

  return (
    <div className="min-h-screen text-slate-800 p-4 max-w-7xl mx-auto">
      <QuitPlanHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Huấn luyện viên */}
        <div className="lg:col-span-1">
          <Card
            className="hover:shadow-lg border border-slate-200 rounded-2xl overflow-hidden h-fit sticky top-4 transition-all"
            title={
              <SectionTitle
                iconBg="bg-green-100"
                iconSvg={
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
                title="Huấn luyện viên của bạn"
                subtitle="Thông tin người hướng dẫn"
                gradient="from-green-700 to-blue-700"
              />
            }
            styles={cardStyles}
          >
            <DetailedCoachInfo
              coach={userQuitPlan.coach_id}
              plan={userQuitPlan}
            />
          </Card>
        </div>

        {/* Giai đoạn và nhiệm vụ */}
        <div className="lg:col-span-2">
          <Card
            className="hover:shadow-lg border border-slate-200 rounded-2xl overflow-hidden transition-all"
            title={
              <SectionTitle
                iconBg="bg-purple-100"
                iconSvg={
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                }
                title="Giai đoạn & nhiệm vụ"
                subtitle="Theo dõi tiến trình của bạn"
                gradient="from-purple-700 to-pink-700"
              />
            }
            styles={cardStyles}
          >
            <UserStageView quitPlan={userQuitPlan} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuitPlanView;
