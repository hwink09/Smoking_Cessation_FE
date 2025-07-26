import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#e6f0f8] border-t border-blue-200 py-10 mt-12 font-sans">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          {/* Logo + mô tả bên trái */}
          <div className="flex-1 max-w-md">
            <Link to="/" className="inline-block mb-3">
              <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-500 tracking-wide">
                EXHELA
              </span>
            </Link>
            <p className="text-gray-700 text-[15px] mb-3 leading-relaxed font-medium">
              Chúng tôi cung cấp các giải pháp bỏ thuốc lá hiệu quả, hỗ trợ cuộc
              sống khỏe mạnh hơn và giúp mọi người bỏ thuốc thành công.
            </p>
            <p className="text-gray-500 text-sm italic">
              © {new Date().getFullYear()} EXHELA. Tất cả quyền được bảo lưu.
            </p>
          </div>

          {/* Dịch vụ + Liên hệ sát bên phải */}
          <div className="flex flex-col sm:flex-row gap-10 text-left">
            {/* Dịch vụ */}
            <div>
              <h4 className="text-gray-900 font-bold text-lg mb-4 uppercase tracking-wider">
                Dịch vụ
              </h4>
              <ul className="space-y-2 text-[15px] font-medium">
                {[
                  "Kế hoạch bỏ thuốc",
                  "Bài viết hữu ích",
                  "Tư vấn cùng huấn luyện viên",
                  "Theo dõi tiến độ",
                  "Bảng xếp hạng",
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-purple-600 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Liên hệ */}
            <div>
              <h4 className="text-gray-900 font-bold text-lg mb-4 uppercase tracking-wider">
                Liên hệ
              </h4>
              <ul className="space-y-2 text-[15px] text-gray-700 font-medium">
                <li>
                  Email:{" "}
                  <span className="text-purple-600 font-semibold">
                    help.smokingcessation@gmail.com
                  </span>
                </li>
                <li>
                  Hotline:{" "}
                  <span className="text-purple-600 font-semibold">
                    1900 123 456
                  </span>
                </li>
                <li>
                  Địa chỉ:{" "}
                  <span className="text-purple-600 font-semibold">
                    FPT University
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
