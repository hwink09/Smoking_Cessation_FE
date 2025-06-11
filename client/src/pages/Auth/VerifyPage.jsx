import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from navigation state or default
  const email = location.state?.email || "";

  // Handle back to login
  const handleBackToLogin = () => {
    navigate("/login");
  };

  // Handle resend verification (if needed in the future)
  const handleResendVerification = () => {
    // TODO: Implement resend verification logic
    console.log("Resend verification email");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-950">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-10 rounded-xl shadow-lg border border-gray-800">
        {/* Success Icon */}
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
            Verify Your Email
          </h2>
          <p className="text-gray-400 text-sm">
            We've sent a verification email to
          </p>
          {email && (
            <p className="text-indigo-400 font-medium text-sm mt-1">
              {email}
            </p>
          )}
        </div>

        {/* Instructions */}
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
                Next steps:
              </h3>
              <div className="mt-2 text-sm text-blue-300">
                <ol className="list-decimal list-inside space-y-1">
                  <li>Check your email inbox</li>
                  <li>Click the verification link we sent</li>
                  <li>Return to login with your credentials</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center text-sm text-gray-400">
          <p>Didn't receive the email? Check your spam folder.</p>
          <p className="mt-2">
            Need help?{" "}
            <a href="#" className="text-indigo-400 hover:text-indigo-300">
              Contact support
            </a>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Continue to Login Button */}
          <button
            onClick={handleBackToLogin}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            Continue to Login
          </button>

          {/* Resend Email Button */}
          <button
            onClick={handleResendVerification}
            className="w-full flex justify-center py-2.5 px-4 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            Resend Verification Email
          </button>
        </div>

        {/* Back to Register Link */}
        <div className="text-sm text-center">
          <span className="text-gray-400">Wrong email?</span>{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-500 hover:text-indigo-400 transition-colors"
          >
            Register again
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyPage;