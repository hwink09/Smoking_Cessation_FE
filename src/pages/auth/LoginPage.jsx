import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, googleAuth } from "~/redux/slices/authSlice";
import {
  selectAuthLoading,
  selectAuthError,
} from "~/redux/selectors/authSelectors";
import {
  validateLoginForm,
  formatAuthError,
  sanitizeInput,
  isFormValid,
} from "~/utils/validations";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);

  // Kiểm tra các tham số truy vấn khi trang được tải
  useEffect(() => {
    // Xử lý kết quả từ quá trình xác thực email
    if (searchParams.get("verified") === "true") {
      toast.success("Email đã được xác thực thành công. Vui lòng đăng nhập.");
    }

    if (searchParams.get("error") === "invalid_token") {
      toast.error("Liên kết xác thực không hợp lệ hoặc đã hết hạn.");
    }

    if (searchParams.get("error") === "server_error") {
      toast.error("Đã xảy ra lỗi khi xác thực email. Vui lòng thử lại sau.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (user && user.userId) {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
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
      const result = await dispatch(login(formData)).unwrap();
      if (result.message) {
        toast.success(result.message);
        navigate("/admin/dashboard");
      } else {
        toast.error(formatAuthError(result.error));
      }
    } catch (error) {
      toast.error(formatAuthError(error.message || error));

      setFormData((prev) => ({ ...prev, password: "" }));
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleGoogleLogin = async (response) => {
    const { credential } = response;

    if (!credential) {
      toast.error("Google login failed - No credential received");
      return;
    }

    try {
      toast.info("Authenticating with Google...");
      const result = await dispatch(googleAuth({ credential })).unwrap();

      if (result && result.success) {
        toast.success("Google login successful!");
        navigate(
          result.user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"
        );
      } else {
        toast.error(
          "Google login failed - Server returned unsuccessful response"
        );
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const formIsValid =
    isFormValid(errors) && formData.email && formData.password;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-950">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-10 rounded-xl shadow-lg border border-gray-800">
        <div>
          <h1 className="text-3xl font-extrabold text-center text-white">
            Welcome Back
          </h1>
          <p className="mt-3 text-center text-sm text-gray-400">
            Sign in to your account to continue your journey
          </p>
        </div>

        {authError && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md text-sm">
            {formatAuthError(authError)}
          </div>
        )}

        <div className="flex flex-col gap-4 mt-8 w-full">
          {/* Google Login Button */}{" "}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              useOneTap
              size="large"
              text="Continue with Google"
              theme="outline"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">
                Or continue with email
              </span>
            </div>
          </div>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email-address"
                className="block text-sm font-medium text-gray-300"
              >
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-700"
                } bg-gray-800 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-indigo-500 hover:text-indigo-400 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-700"
                } bg-gray-800 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
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
            className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-all duration-200 ${
              formIsValid && !loading && !isSubmitting
                ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                : "bg-gray-700 cursor-not-allowed"
            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            {loading || isSubmitting ? (
              <>
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
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>

          <div className="text-sm text-center pt-2">
            <span className="text-gray-400">Don't have an account?</span>{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-500 hover:text-indigo-400 transition-colors"
            >
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
