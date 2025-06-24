import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { validatePassword, passwordsMatch } from "~/utils/validations";
import { toast } from "react-toastify";
import api from "~/services/api";

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isResetComplete, setIsResetComplete] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    if (!token || token.length < 10) {
      setIsTokenValid(false);
      toast.error("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
    }
  }, [token]);

  const validateForm = () => {
    const newErrors = {};

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      newErrors.password = passwordCheck.errors[0];
    }

    if (!passwordsMatch(password, confirmPassword)) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api.post(`/auth/resset-password/${token}`, {
        newPassword: password,
      });

      toast.success("Đặt lại mật khẩu thành công! Đang chuyển hướng...");
      setIsResetComplete(true);

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Đặt lại mật khẩu thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-950">
        <div className="max-w-md w-full bg-gray-900 p-10 rounded-xl shadow-lg border border-gray-800 space-y-6">
          <h1 className="text-3xl font-extrabold text-center text-red-500">
            Liên kết không hợp lệ
          </h1>
          <p className="text-center text-gray-400">
            Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
          </p>
          <div className="text-center">
            <Link
              to="/fogot-password"
              className="text-indigo-500 hover:text-indigo-400"
            >
              Yêu cầu liên kết mới
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isResetComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-950">
        <div className="max-w-md w-full bg-gray-900 p-10 rounded-xl shadow-lg border border-gray-800 space-y-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h1 className="text-3xl font-extrabold text-white">
            Đặt lại mật khẩu thành công
          </h1>
          <p className="text-gray-400">
            Mật khẩu mới của bạn đã được cập nhật. Đang chuyển hướng về trang
            đăng nhập.
          </p>
          <Link to="/login" className="text-indigo-500 hover:text-indigo-400">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-950">
      <div className="max-w-md w-full bg-gray-900 p-10 rounded-xl shadow-lg border border-gray-800 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-center text-white">
            Đặt lại mật khẩu
          </h1>
          <p className="mt-2 text-center text-sm text-gray-400">
            Vui lòng nhập mật khẩu mới
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-500 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Mật khẩu ít nhất 6 ký tự, có chữ hoa, chữ thường và số.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-500 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2.5 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            ) : (
              "Đặt lại mật khẩu"
            )}
          </button>

          <div className="text-sm text-center">
            <Link to="/login" className="text-indigo-500 hover:text-indigo-400">
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
