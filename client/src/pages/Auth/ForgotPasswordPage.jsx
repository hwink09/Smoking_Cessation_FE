import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "~/hooks/useAuth";
import { useDispatch } from "react-redux";
import { forgotPassword } from "~/redux/slices/authSlice";
import { toast } from "react-toastify";

function ForgotPassword() {
  const { validateForgotPasswordForm } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);

    // Clear messages when input changes
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    const validation = validateForgotPasswordForm(email);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await dispatch(forgotPassword(email)).unwrap();
      toast.success("Password reset link sent to your email.");
      setIsLoading(false);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by Redux
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-950">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-10 rounded-xl shadow-lg border border-gray-800">
        <div>
          <h1 className="text-3xl font-extrabold text-center text-white">
            Reset Password
          </h1>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your email to receive a password reset link
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-md text-sm">
            {successMessage}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
              value={email}
              onChange={handleChange}
              required
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || isSubmitted}
            className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
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
              "Send Reset Link"
            )}
          </button>

          <div className="text-sm text-center">
            <span className="text-gray-400">Remember your password?</span>{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-500 hover:text-indigo-400 transition-colors"
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
