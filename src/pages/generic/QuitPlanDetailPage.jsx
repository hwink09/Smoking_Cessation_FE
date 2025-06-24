import { Alert, Card, Descriptions, Spin, Badge, Divider, Button } from "antd";
import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CalendarOutlined,
  BulbOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useQuitPlanData } from "~/hooks/useQuitPlanData";


function QuitPlanDetailPage() {
  const { id } = useParams();
  const { getQuitPlanById } = useQuitPlanData();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Wrap fetchPlan trong useCallback
  const fetchPlan = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getQuitPlanById(id);
      setPlan(data);
    } catch (error) {
      setError(error.message || "Lỗi khi tải kế hoạch bỏ thuốc");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600 text-lg">Đang tải kế hoạch...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-md w-full mx-4">
          <Alert
            type="error"
            message="Có lỗi xảy ra"
            description={error}
            showIcon
            className="shadow-lg"
          />
        </div>
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-gradient-to-r py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg text-gray-800">
            {plan.name}
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto text-gray-800">
            Chi tiết kế hoạch bỏ thuốc lá của bạn
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
              <img
                alt="Hình ảnh kế hoạch"
                src={plan.image}
                className="w-full h-80 object-cover rounded-lg"
              />
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Chi tiết kế hoạch
                </h2>
                <p className="text-gray-600">
                  Thông tin chi tiết về kế hoạch bỏ thuốc của bạn
                </p>
                <Divider className="my-6" />
              </div>

              <Descriptions
                column={{ xs: 1, sm: 1, md: 1 }}
                size="large"
                labelStyle={{
                  fontWeight: "bold",
                  color: "#374151",
                  fontSize: "16px",
                }}
                contentStyle={{
                  fontSize: "16px",
                }}
              >
                <Descriptions.Item
                  label={
                    <span className="flex items-center">
                      <BulbOutlined className="mr-2 text-yellow-500 text-lg" />
                      Lý do bỏ thuốc
                    </span>
                  }
                >
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-l-4 border-yellow-400 shadow-sm">
                    <p className="text-gray-800 font-medium text-lg leading-relaxed">
                      {plan.reason}
                    </p>
                  </div>
                </Descriptions.Item>
              </Descriptions>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-3">
                    <CalendarOutlined className="mr-2 text-blue-500 text-lg" />
                    Ngày bắt đầu
                  </h4>
                  <div className="bg-blue-50 px-6 py-4 rounded-lg border border-blue-200">
                    <span className="text-blue-700 font-semibold text-lg">
                      {new Date(plan.start_date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-3">
                    <TrophyOutlined className="mr-2 text-green-500 text-lg" />
                    Ngày kết thúc
                  </h4>
                  <div className="bg-green-50 px-6 py-4 rounded-lg border border-green-200">
                    <span className="text-green-700 font-semibold text-lg">
                      {new Date(plan.target_quit_date).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                </div>

                <div className="col-span-full flex justify-center mt-6">
               <Link to={`/stages/${id}`}>
                    <Button
                      type="primary"
                      size="large"
                      className="px-10 py-5 text-lg"
                    >
                      Bắt đầu
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuitPlanDetailPage;
