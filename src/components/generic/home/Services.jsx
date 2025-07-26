import {
  Code,
  Layers,
  Smartphone,
  Globe,
  Rocket,
  LineChart,
} from "lucide-react";

export function Services() {
  const services = [
    {
      icon: <Smartphone className="w-10 h-10 text-purple-500" />,
      title: "Ứng dụng bỏ thuốc",
      description:
        "Theo dõi tiến trình, đặt mục tiêu và nhận động lực mỗi ngày với ứng dụng dễ sử dụng của chúng tôi.",
    },
    {
      icon: <Globe className="w-10 h-10 text-cyan-500" />,
      title: "Tư vấn trực tuyến",
      description:
        "Kết nối với chuyên gia được chứng nhận để nhận kế hoạch cá nhân hóa và hỗ trợ mọi lúc, mọi nơi.",
    },
    {
      icon: <Layers className="w-10 h-10 text-purple-500" />,
      title: "Liệu pháp hành vi",
      description:
        "Tiếp cận các chiến lược đã được khoa học chứng minh để kiểm soát cơn thèm thuốc và thay đổi thói quen lâu dài.",
    },
    {
      icon: <Rocket className="w-10 h-10 text-cyan-500" />,
      title: "Chương trình tạo động lực",
      description:
        "Mẹo, câu chuyện và sự động viên mỗi ngày giúp bạn kiên định trên hành trình không khói thuốc.",
    },
    {
      icon: <LineChart className="w-10 h-10 text-purple-500" />,
      title: "Theo dõi tiến độ",
      description:
        "Quan sát các mốc thành tựu, cải thiện sức khỏe và số tiền tiết kiệm được – tất cả trong một bảng điều khiển.",
    },
    {
      icon: <Code className="w-10 h-10 text-cyan-500" />,
      title: "Cộng đồng hỗ trợ",
      description:
        "Tham gia cộng đồng những người cùng hành trình để chia sẻ kinh nghiệm và lời khuyên hữu ích.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-white relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Dịch vụ{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
              của chúng tôi
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Chúng tôi cung cấp giải pháp hỗ trợ bỏ thuốc toàn diện, phù hợp với
            hành trình sức khỏe của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-purple-400 transition-all group shadow-sm"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
