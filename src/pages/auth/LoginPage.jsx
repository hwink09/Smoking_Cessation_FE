import React, { useEffect, useState, useRef } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  useParams,
  useLocation,
} from "react-router-dom";
import { useAuth } from "~/hooks/useAuth";
import { sanitizeInput } from "~/utils/authValidation";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const navigate = useNavigate();
  const { token } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const {
    login,
    loginWithGoogle,
    verifyEmail,
    loading,
    error,
    validateLoginForm,
    isFormValid,
    formatAuthError,
    clearError,
    currentUser,
  } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const verificationAttemptedRef = useRef(false);
  const tokenVerificationAttemptedRef = useRef(false);

  const getRedirectPath = (role) => {
    if (role === "admin") return "/admin/dashboard";
    if (role === "coach") return "/coach/dashboard";
    return "/";
  };

  useEffect(() => {
    if (verificationAttemptedRef.current) return;
    verificationAttemptedRef.current = true;

    if (searchParams.get("verified") === "true") {
      toast.success("Xác minh email thành công.");
      setEmailVerified(true);
      return;
    }

    if (searchParams.get("error") === "invalid_token") {
      toast.error("Liên kết xác minh không hợp lệ hoặc đã hết hạn.");
      return;
    }

    if (searchParams.get("error") === "server_error") {
      toast.error("Lỗi máy chủ khi xác minh email.");
      return;
    }

    if (token && !emailVerified && !tokenVerificationAttemptedRef.current) {
      tokenVerificationAttemptedRef.current = true;

      const verifyEmailToken = async () => {
        try {
          const result = await verifyEmail(token);
          toast.success(result.message || "Xác minh email thành công.");
          setEmailVerified(true);
        } catch (error) {
          const errorMsg =
            error?.error ||
            error?.message ||
            "Liên kết xác minh không hợp lệ hoặc đã hết hạn.";
          toast.error(errorMsg);
        }
      };

      verifyEmailToken();
    }

    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentUser?.userId) {
      const targetPath = getRedirectPath(currentUser.role);
      navigate(targetPath);
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (location.state?.message) {
      setRedirectMessage(location.state.message);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: sanitizeInput(value),
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateLoginForm(formData);
    if (!isFormValid(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (result.success && result.user?.userId) {
        toast.success(result.message || "Đăng nhập thành công!");
        navigate(getRedirectPath(result.user.role));
      } else if (result.success && !result.user?.userId) {
        const localUser = JSON.parse(localStorage.getItem("user") || "{}");

        if (localUser && localUser.userId) {
          toast.success("Đăng nhập thành công!");
          navigate(getRedirectPath(localUser.role));
        } else {
          toast.error(
            "Đăng nhập thành công nhưng không thể lấy thông tin người dùng. Vui lòng thử lại."
          );
          setFormData((prev) => ({ ...prev, password: "" }));
        }
      } else {
        toast.error(
          formatAuthError(
            result.error || "Đăng nhập thất bại vì lý do không xác định"
          )
        );
        setFormData((prev) => ({ ...prev, password: "" }));
      }
    } catch (error) {
      toast.error(
        formatAuthError(error?.message || "Lỗi đăng nhập không xác định")
      );
      setFormData((prev) => ({ ...prev, password: "" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    if (!response?.credential) {
      toast.error("Đăng nhập Google thất bại: Thiếu thông tin xác thực.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await loginWithGoogle(response.credential);

      if (result.success && result.user?.role) {
        toast.success("Đăng nhập Google thành công!");
        navigate(getRedirectPath(result.user.role));
      } else {
        const errorMessage = formatAuthError(
          result.error || "Không thể xác thực với Google"
        );
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = formatAuthError(
        error?.message || "Đăng nhập Google thất bại"
      );
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formIsValid =
    isFormValid(errors) && formData.email && formData.password;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-950">
      <div className="max-w-md w-full bg-gray-900 p-10 rounded-xl shadow-lg border border-gray-800 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-center text-white">
            Chào mừng quay lại
          </h1>
          <p className="mt-3 text-center text-sm text-gray-400">
            Đăng nhập để tiếp tục hành trình bỏ thuốc lá
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md text-sm">
            {formatAuthError(error)}
          </div>
        )}
        {redirectMessage && (
          <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-md text-sm">
            {redirectMessage}
          </div>
        )}

        <div className="flex flex-col gap-4 mt-8 w-full">
          <div className="flex justify-center">
            {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={(error) => {
                  console.error("Google login error:", error);
                  toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.");
                }}
                useOneTap={false}
                shape="rectangular"
                theme="filled_blue"
              />
            ) : (
              <div className="p-2 bg-red-900/20 border border-red-800 rounded-md text-center text-red-300 text-sm">
                Chưa cấu hình Client ID Google
              </div>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">
                Hoặc đăng nhập bằng email
              </span>
            </div>
          </div>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-700"
                } bg-gray-800 text-white rounded-md`}
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div>
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-300">
                  Mật khẩu
                </label>
                <Link
                  to="/fogot-password"
                  className="text-sm text-indigo-500 hover:text-indigo-400"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-700"
                } bg-gray-800 text-white rounded-md`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || isSubmitting || !formIsValid}
            className={`w-full py-2.5 px-4 text-sm font-medium rounded-md text-white ${
              formIsValid && !loading && !isSubmitting
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-700 cursor-not-allowed"
            }`}
          >
            {loading || isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          <div className="text-sm text-center pt-2">
            <span className="text-gray-400">Chưa có tài khoản?</span>{" "}
            <Link
              to="/register"
              className="text-indigo-500 hover:text-indigo-400"
            >
              Tạo tài khoản mới
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
