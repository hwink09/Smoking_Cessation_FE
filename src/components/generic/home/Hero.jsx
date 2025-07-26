import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Hiệu ứng ánh sáng nhẹ */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-300/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-300/20 rounded-full filter blur-3xl" />
      </div>

      {/* Nội dung chính */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center py-24">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
              Trao Quyền
            </span>{" "}
            Cho Cuộc Sống Không Khói Thuốc
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
            Chúng tôi mang đến giải pháp tư vấn và hỗ trợ toàn diện giúp bạn cai
            thuốc lá, cải thiện sức khỏe và làm chủ cuộc sống.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 transition-all text-white font-semibold shadow-lg"
            >
              Bắt đầu ngay
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 rounded-full border border-gray-300 hover:bg-gray-100 transition-all text-gray-800 font-medium flex items-center justify-center gap-2"
            >
              Dịch vụ của chúng tôi <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
