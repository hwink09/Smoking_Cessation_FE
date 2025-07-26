import React, { useEffect, useState } from "react";
import { message } from "antd";
import QuitPlanService from "~/services/quitPlanService";
import QuitPlanLoadingState from "./QuitPlanLoadingState";
import QuitPlanTableHeader from "./QuitPlanTableHeader";
import QuitPlanDataTable from "./QuitPlanDataTable";

const CoachQuitPlanTable = () => {
  const [quitPlans, setQuitPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuitPlans = async () => {
      setLoading(true);
      try {
        const response = await QuitPlanService.coach.getMyUsers();
        const plansWithKeys = (response || []).map((plan, index) => ({
          ...plan,
          key: plan._id || `plan-${index}`,
        }));
        setQuitPlans(plansWithKeys);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách kế hoạch:", err);
        message.error("Không thể lấy dữ liệu kế hoạch bỏ thuốc");
      } finally {
        setLoading(false);
      }
    };

    fetchQuitPlans();
  }, []);

  // Loading state cho lần tải đầu tiên
  if (loading && quitPlans.length === 0) {
    return <QuitPlanLoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Component */}
        <QuitPlanTableHeader />

        {/* Data Table Component */}
        <QuitPlanDataTable quitPlans={quitPlans} loading={loading} />
      </div>
    </div>
  );
};

export default CoachQuitPlanTable;
