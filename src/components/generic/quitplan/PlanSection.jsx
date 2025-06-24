import { Alert ,Col, Row, Spin } from "antd";

import PlanCard from "./PlanCard";
import { useQuitPlanData } from "~/hooks/useQuitPlanData";
import ColourfulText from "~/components/ui/colourful-text";

function PlanSection() {
  const { quitPlans, loading, error } = useQuitPlanData();

  return (
    <section id="resources" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            <ColourfulText text="Kế Hoạch" />
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá các kế hoạch bỏ thuốc được cá nhân hóa và hỗ trợ chi tiết
            cho bạn.
          </p>
        </div>
        {loading ? (
          <div className="text-center">
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert
            type="error"
            message="Lỗi tải dữ liệu"
            description={error.message}
            className="mb-8"
          />
        ) : (
          <Row gutter={[24, 24]} justify="center">
            {quitPlans.map((plan, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={plan._id}>
                <PlanCard
                  id={plan._id}
                  image={plan.image || "/placeholder.svg"}
                  title={plan.name}
                  description={
                    <>
                      <p className="text-sm text-gray-500 mb-2">
                        {plan.reason}
                      </p>
                      <p className="text-xs text-gray-400">
                        Bắt đầu:{" "}
                        {new Date(plan.start_date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        Mục tiêu:{" "}
                        {new Date(plan.target_quit_date).toLocaleDateString()}
                      </p>
                    </>
                  }
                  delay={index}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </section>
  );
}

export default PlanSection;
