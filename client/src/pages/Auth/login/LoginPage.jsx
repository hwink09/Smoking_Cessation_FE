import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "~/hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, validateLoginForm } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // Clear auth error when form changes
    if (authError) {
      setAuthError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setAuthError("");

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } else {
      setAuthError(result.error);
    }

    setIsLoading(false);
  };
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setAuthError("");

    const result = await loginWithGoogle();

    if (result.success) {
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } else {
      setAuthError(result.error);
    }

    setIsLoading(false);
  };

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
            {authError}
          </div>
        )}

        <div className="flex flex-col gap-4 mt-8">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="group relative w-full flex justify-center items-center py-2.5 px-4 border border-gray-700 text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <FcGoogle className="h-5 w-5" />
            </span>
            Continue with Google
          </button>

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
            disabled={isLoading}
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
