import React, { useState, useEffect, useRef } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "~/hooks/useAuth";
import { toast } from "react-toastify";
import authService from "~/services/authService";

function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { resendVerification } = useAuth();

  const token = searchParams.get("token");
  const emailFromQuery = searchParams.get("email");
  const emailFromState = location.state?.email;
  const email = emailFromState || emailFromQuery || "";

  const COOLDOWN_PERIOD = 60000; // 1 minute
  const COOLDOWN_KEY = "emailVerificationLastResendTime";
  const cooldownTimerRef = useRef(null);

  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    isVerified: false,
    message: "",
    error: "",
  });
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // Load cooldown from localStorage
  useEffect(() => {
    const savedTime = localStorage.getItem(COOLDOWN_KEY);
    if (savedTime) {
      const lastTime = parseInt(savedTime, 10);
      const now = Date.now();
      const elapsed = now - lastTime;
      if (elapsed < COOLDOWN_PERIOD) {
        setCooldownRemaining(Math.ceil((COOLDOWN_PERIOD - elapsed) / 1000));
      }
    }

    return () => {
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
      }
    };
  }, []);

  // Countdown effect
  useEffect(() => {
    if (cooldownRemaining <= 0) return;

    cooldownTimerRef.current = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
      }
    };
  }, [cooldownRemaining]);

  // Verify email token
  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) return;
      setIsVerifying(true);

      try {
        const { data } = await authService.verifyEmail(token);
        setVerificationStatus({
          isVerified: true,
          message: data.message || "Email đã được xác thực thành công!",
          error: "",
        });
        toast.success(
          "Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ."
        );
        setTimeout(() => navigate("/login"), 3000);
      } catch (error) {
        const msg =
          error.response?.data?.message ||
          "Liên kết xác thực không hợp lệ hoặc đã hết hạn";
        setVerificationStatus({ isVerified: false, message: "", error: msg });
        toast.error(msg);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmailToken();
  }, [token, navigate]);

  const handleBackToLogin = () => navigate("/login");

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Không tìm thấy email để gửi lại xác thực.");
      return;
    }

    const now = Date.now();
    const lastResend = parseInt(localStorage.getItem(COOLDOWN_KEY) || 0);
    const elapsed = now - lastResend;

    if (elapsed < COOLDOWN_PERIOD) {
      const remaining = Math.ceil((COOLDOWN_PERIOD - elapsed) / 1000);
      toast.error(`Vui lòng đợi ${remaining} giây trước khi gửi lại.`);
      return;
    }

    setIsResending(true);
    setResendError("");

    try {
      const result = await resendVerification(email);
      if (result?.success) {
        toast.success("Gửi lại email xác thực thành công!");
        setResendSuccess(true);
        localStorage.setItem(COOLDOWN_KEY, now.toString());
        setCooldownRemaining(60);
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        const errorMsg = result?.error || "Không thể gửi lại email xác thực.";
        setResendError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = error.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.";
      setResendError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-950">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-10 rounded-xl shadow-lg border border-gray-800">
        {token ? (
          <div className="text-center">
            {isVerifying ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin h-10 w-10 text-indigo-500 mb-4">
                  🔄
                </div>
                <p className="text-white">Đang xác thực email...</p>
              </div>
            ) : verificationStatus.isVerified ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Xác thực thành công!
                </h2>
                <p className="text-green-400">{verificationStatus.message}</p>
                <p className="text-gray-400 mt-2">
                  Bạn sẽ được chuyển đến trang đăng nhập...
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Xác thực thất bại
                </h2>
                <p className="text-red-400">{verificationStatus.error}</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
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

            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-sm text-blue-300">
              <ol className="list-decimal list-inside space-y-1">
                <li>Kiểm tra hộp thư của bạn</li>
                <li>Nhấn vào liên kết xác thực trong email</li>
                <li>Quay lại đăng nhập với tài khoản của bạn</li>
              </ol>
            </div>

            {resendSuccess && (
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-green-300 text-sm">
                Đã gửi lại email xác thực!
              </div>
            )}
            {resendError && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300 text-sm">
                {resendError}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleBackToLogin}
                className="w-full py-2.5 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Quay lại đăng nhập
              </button>
              <button
                onClick={handleResendVerification}
                disabled={isResending || cooldownRemaining > 0}
                className={`w-full py-2.5 px-4 text-sm font-medium rounded-md text-gray-300 border 
                  ${
                    isResending
                      ? "bg-gray-700 cursor-wait"
                      : "hover:bg-gray-800"
                  }
                `}
              >
                {isResending
                  ? "Đang gửi..."
                  : cooldownRemaining > 0
                  ? `Gửi lại email xác thực (${cooldownRemaining}s)`
                  : "Gửi lại email xác thực"}
              </button>
            </div>

            <div className="text-sm text-center text-gray-400">
              Nhập sai email?{" "}
              <Link
                to="/register"
                className="text-indigo-400 hover:text-indigo-300"
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
