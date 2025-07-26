import React from "react";
import { Card, Button, Typography, Alert, Space } from "antd";
import { CrownOutlined, StarOutlined, RocketOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const SubscriptionUpgradeCard = ({
  title = "Cần nâng cấp gói thành viên",
  description = "Tính năng này chỉ dành cho thành viên Plus và Premium",
  showPricing = true,
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    // Điều hướng đến trang pricing
    navigate("/#pricing");
    // Scroll to pricing section
    setTimeout(() => {
      const pricingSection = document.getElementById("pricing");
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const features = [
    {
      icon: <StarOutlined className="text-yellow-500" />,
      title: "Gói Plus",
      description: "Truy cập đầy đủ huấn luyện viên cá nhân",
      features: [
        "Huấn luyện viên chuyên nghiệp",
        "Kế hoạch cá nhân hóa",
        "Hỗ trợ 24/7",
      ],
    },
    {
      icon: <CrownOutlined className="text-purple-500" />,
      title: "Gói Premium",
      description: "Tất cả tính năng cao cấp",
      features: [
        "Mọi tính năng của Plus",
        "Phân tích chi tiết",
        "Ưu tiên hỗ trợ",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
            <RocketOutlined className="text-6xl mb-4 opacity-90" />
            <Title level={2} className="text-white mb-2">
              {title}
            </Title>
            <Text className="text-blue-100 text-lg">{description}</Text>
          </div>

          {/* Content */}
          <div className="p-8">
            <Alert
              message="Thông báo quan trọng"
              description="Để sử dụng tính năng huấn luyện viên cá nhân, bạn cần nâng cấp lên gói Plus hoặc Premium."
              type="info"
              showIcon
              className="mb-6 border-blue-200 bg-blue-50"
            />

            {showPricing && (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-3">{feature.icon}</div>
                      <Title level={4} className="mb-2">
                        {feature.title}
                      </Title>
                      <Paragraph className="text-gray-600 mb-4">
                        {feature.description}
                      </Paragraph>
                      <ul className="text-left space-y-2">
                        {feature.features.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-center text-sm text-gray-700"
                          >
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="text-center space-y-4">
              <Button
                type="primary"
                size="large"
                icon={<CrownOutlined />}
                onClick={handleUpgrade}
                className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 shadow-lg hover:shadow-xl px-8 py-2 h-12"
              >
                Nâng cấp ngay
              </Button>

              <div className="mt-4">
                <Text type="secondary" className="text-sm">
                  Bạn có thể nâng cấp gói bất kỳ lúc nào để truy cập đầy đủ tính
                  năng
                </Text>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <Title level={4} className="text-green-800 mb-3 text-center">
                🎯 Lợi ích khi nâng cấp
              </Title>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-2">👨‍⚕️</div>
                  <Text strong className="text-green-700">
                    Huấn luyện viên chuyên nghiệp
                  </Text>
                </div>
                <div>
                  <div className="text-2xl mb-2">📋</div>
                  <Text strong className="text-green-700">
                    Kế hoạch cá nhân hóa
                  </Text>
                </div>
                <div>
                  <div className="text-2xl mb-2">📞</div>
                  <Text strong className="text-green-700">
                    Hỗ trợ 24/7
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionUpgradeCard;
