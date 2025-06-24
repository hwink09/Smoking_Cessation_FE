import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "~/hooks/useAuth";
import { toast } from "react-toastify";

function ForgotPassword() {
  const { validateForgotPasswordForm, forgotPassword, formatAuthError } =
    useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForgotPasswordForm(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        toast.success("Đã gửi liên kết đặt lại mật khẩu đến email của bạn.");
        setIsSubmitted(true);
      } else {
        setError(formatAuthError(result.error || "Yêu cầu thất bại."));
      }
    } catch (err) {
      toast.error(
        formatAuthError(
          err?.message || "Gửi liên kết đặt lại mật khẩu thất bại."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-950">
      <div className="max-w-md w-full bg-gray-900 p-10 rounded-xl shadow-lg border border-gray-800 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-center text-white">
            Đặt lại mật khẩu
          </h1>
          <p className="mt-2 text-center text-sm text-gray-400">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email-address"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || isSubmitted}
            className={`w-full flex justify-center py-2.5 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
              isLoading || isSubmitted ? "opacity-70 cursor-not-allowed" : ""
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
              "Gửi liên kết đặt lại mật khẩu"
            )}
          </button>

          <div className="text-sm text-center">
            <span className="text-gray-400">Đã nhớ mật khẩu?</span>{" "}
            <Link to="/login" className="text-indigo-500 hover:text-indigo-400">
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
