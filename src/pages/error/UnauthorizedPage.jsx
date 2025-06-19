import React from "react";
import { Link } from "react-router-dom";

function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-950">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-10 rounded-xl shadow-lg border border-gray-800">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-400 mb-5">
            Bạn không có quyền truy cập vào trang này. Vui lòng quay lại trang
            chủ hoặc đăng nhập với tài khoản có quyền phù hợp.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Về trang chủ
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Đăng nhập lại
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
