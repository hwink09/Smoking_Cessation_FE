import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
              EXHELA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white/80 hover:text-white transition-colors"
            >
              Trang Chủ
            </Link>
            <Link
              to="*"
              className="text-white/80 hover:text-white transition-colors"
            >
              Bài Viết
            </Link>
            <Link
              to="*"
              className="text-white/80 hover:text-white transition-colors"
            >
              Kế Hoạch
            </Link>

            <Link
              to="/ranking"
              className="text-white/80 hover:text-white transition-colors"
            >
              Bảng Xếp Hạng
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 transition-all"
            >
              Đăng Nhập
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
