import React, { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "~/hooks/useAuth";
import authService from "~/services/authService";
import { toast } from "react-toastify";

function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { resendVerification } = useAuth();

  // Lấy token từ URL nếu có
  const token = searchParams.get("token");

  // Lấy email từ state điều hướng
  const email = location.state?.email || "";

  // UI states
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    isVerified: false,
    message: "",
    error: "",
  });
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");

  // Xử lý xác thực email khi có token trong URL
  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) return;

      setIsVerifying(true);

      try {
        const result = await authService.verifyEmail(token);

        setVerificationStatus({
          isVerified: true,
          message: result.message || "Email đã được xác thực thành công!",
          error: "",
        });

        toast.success(
          "Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ."
        );

        // Sau 3 giây sẽ chuyển hướng về trang đăng nhập
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        console.error("Lỗi xác thực email:", error);

        setVerificationStatus({
          isVerified: false,
          message: "",
          error:
            error.response?.data?.message ||
            "Liên kết xác thực không hợp lệ hoặc đã hết hạn",
        });

        toast.error(
          error.response?.data?.message ||
            "Liên kết xác thực không hợp lệ hoặc đã hết hạn"
        );
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmailToken();
  }, [token, navigate]);

  // Quay lại trang đăng nhập
  const handleBackToLogin = () => {
    navigate("/login");
  };

  // Gửi lại email xác thực
  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Không tìm thấy email để gửi lại xác thực.");
      setTimeout(() => setResendError(""), 3000);
      return;
    }

    setIsResending(true);
    setResendError("");

    try {
      const result = await resendVerification(email);

      if (result.success) {
        setResendSuccess(true);
        toast.success("Gửi lại email xác thực thành công!");
        setTimeout(() => {
          setResendSuccess(false);
        }, 5000);
      } else {
        setResendError(result.error || "Không thể gửi lại email xác thực.");
        toast.error(result.error || "Không thể gửi lại email xác thực.");
      }
    } catch (error) {
      console.error("Lỗi gửi lại email:", error);
      setResendError(error.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
      toast.error(error.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-950">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-10 rounded-xl shadow-lg border border-gray-800">
        {/* Hiển thị trạng thái xác thực nếu đang xác thực token */}
        {token && (
          <div className="text-center">
            {isVerifying ? (
              <div className="flex flex-col items-center">
                <svg
                  className="animate-spin h-10 w-10 text-indigo-500 mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-white">Đang xác thực email...</p>
              </div>
            ) : verificationStatus.isVerified ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-extrabold text-white mb-2">
                  Xác thực thành công!
                </h2>
                <p className="text-green-400">{verificationStatus.message}</p>
                <p className="text-gray-400 mt-2">
                  Bạn sẽ được chuyển hướng đến trang đăng nhập...
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <svg
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-extrabold text-white mb-2">
                  Xác thực thất bại
                </h2>
                <p className="text-red-400">{verificationStatus.error}</p>
              </div>
            )}
          </div>
        )}

        {/* Hiển thị thông tin xác thực email ban đầu khi không có token */}
        {!token && (
          <>
            {/* Biểu tượng thành công */}
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-2">
                Xác thực email của bạn
              </h2>
              <p className="text-gray-400 text-sm">
                Chúng tôi đã gửi email xác thực đến:
              </p>
              {email && (
                <p className="text-indigo-400 font-medium text-sm mt-1">
                  {email}
                </p>
              )}
            </div>

            {/* Hướng dẫn */}
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-200">
                    Các bước tiếp theo:
                  </h3>
                  <div className="mt-2 text-sm text-blue-300">
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Kiểm tra hộp thư của bạn</li>
                      <li>Nhấn vào liên kết xác thực trong email</li>
                      <li>Quay lại đăng nhập với tài khoản của bạn</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông báo phản hồi */}
            {resendSuccess && (
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-green-300 text-sm">
                Đã gửi lại email xác thực! Vui lòng kiểm tra hộp thư.
              </div>
            )}

            {resendError && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300 text-sm">
                {resendError}
              </div>
            )}

            {/* Thông tin bổ sung */}
            <div className="text-center text-sm text-gray-400">
              <p>Không nhận được email? Kiểm tra thư rác hoặc spam.</p>
              <p className="mt-2">
                Cần hỗ trợ?{" "}
                <a href="#" className="text-indigo-400 hover:text-indigo-300">
                  Liên hệ hỗ trợ
                </a>
              </p>
            </div>

            {/* Nút hành động */}
            <div className="space-y-3">
              <button
                onClick={handleBackToLogin}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Quay lại đăng nhập
              </button>

              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className={`w-full flex justify-center py-2.5 px-4 border border-gray-600 text-sm font-medium rounded-md text-gray-300 
                  ${
                    isResending
                      ? "bg-gray-700 cursor-wait"
                      : "bg-transparent hover:bg-gray-800"
                  } 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200`}
              >
                {isResending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang gửi...
                  </>
                ) : (
                  "Gửi lại email xác thực"
                )}
              </button>
            </div>

            {/* Liên kết quay lại đăng ký */}
            <div className="text-sm text-center">
              <span className="text-gray-400">Nhập sai email?</span>{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-500 hover:text-indigo-400 transition-colors"
              >
                Đăng ký lại
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyPage;
