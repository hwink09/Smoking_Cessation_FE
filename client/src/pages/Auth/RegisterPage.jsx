import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "~/hooks/useAuth";
import { toast } from "react-toastify";
import { validateRegisterForm, formatAuthError } from "~/utils/validations";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear auth error when form changes
    if (authError) {
      setAuthError("");
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const validationErrors = validateRegisterForm(formData);

    // Add terms validation
    if (!formData.terms) {
      validationErrors.terms = "You must agree to the Terms and Conditions";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setAuthError("");

    try {
      const result = await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password
      );

      if (result.success) {
        // Navigate to verify page with email
        navigate("/verify", {
          state: {
            email: formData.email.trim(),
          },
        });
        toast.success(
          "Account created successfully! Please verify your email."
        );
      } else {
        setAuthError(formatAuthError(result.error));
      }
    } catch (error) {
      setAuthError(formatAuthError(error.message || "Registration failed"));
    } finally {
      setIsLoading(false);
    }
  };

  // Render form field
  const renderFormField = (
    name,
    label,
    type = "text",
    placeholder = "",
    autoComplete = ""
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={formData[name]}
        onChange={handleChange}
        className={`mt-1 appearance-none block w-full px-3 py-2 border ${
          errors[name] ? "border-red-500" : "border-gray-700"
        } bg-gray-800 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
      )}
    </div>
  );

  // Render loading spinner
  const renderLoadingSpinner = () => (
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
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-950">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-10 rounded-xl shadow-lg border border-gray-800">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-center text-white">
            Create Account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-400">
            Join our community to start your journey
          </p>
        </div>

        {/* Auth Error Alert */}
        {authError && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md text-sm">
            {authError}
          </div>
        )}

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {renderFormField("name", "Full Name", "text", "John Doe", "name")}
            {renderFormField(
              "email",
              "Email address",
              "email",
              "you@example.com",
              "email"
            )}
            {renderFormField(
              "password",
              "Password",
              "password",
              "••••••••",
              "new-password"
            )}
            {renderFormField(
              "confirmPassword",
              "Confirm Password",
              "password",
              "••••••••",
              "new-password"
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleChange}
                className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-700 rounded bg-gray-900 ${
                  errors.terms ? "border-red-500" : ""
                }`}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-300">
                I agree to the{" "}
                <a href="#" className="text-indigo-500 hover:text-indigo-400">
                  Terms and Conditions
                </a>
              </label>
              {errors.terms && (
                <p className="mt-1 text-sm text-red-500">{errors.terms}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? renderLoadingSpinner() : null}
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Login Link */}
          <div className="text-sm text-center">
            <span className="text-gray-400">Already have an account?</span>{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-500 hover:text-indigo-400 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
