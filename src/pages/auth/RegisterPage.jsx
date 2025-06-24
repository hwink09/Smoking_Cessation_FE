import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "~/hooks/useAuth";

function Register() {
  const navigate = useNavigate();
  const {
    register,
    validateRegistrationForm,
    isFormValid,
    formatAuthError,
    clearError,
  } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const validationErrors = validateRegistrationForm(formData);
    setErrors(validationErrors);
    return isFormValid(validationErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await register(formData);
      if (result.success) {
        toast.success("Đăng ký thành công! Vui lòng xác minh email.");
        navigate("/verify", {
          state: { email: formData.email.trim() },
        });
      } else {
        toast.error(formatAuthError(result.error));
      }
    } catch (error) {
      toast.error(formatAuthError(error?.message || "Đăng ký thất bại"));
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (
    name,
    label,
    type = "text",
    placeholder = "",
    autoComplete = ""
  ) => (
    <div className="relative">
      <label htmlFor={name} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={
          ["password", "confirmPassword"].includes(name) && showPassword
            ? "text"
            : type
        }
        autoComplete={autoComplete}
        value={formData[name]}
        onChange={handleChange}
        className={`mt-1 block w-full px-3 py-2 border ${
          errors[name] ? "border-red-500" : "border-gray-700"
        } bg-gray-800 placeholder-gray-500 text-white rounded-md`}
        placeholder={placeholder}
      />
      {["password", "confirmPassword"].includes(name) && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-8 right-3 text-gray-400 hover:text-gray-200"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-950">
      <div className="max-w-md w-full bg-gray-900 p-10 rounded-xl shadow-lg border border-gray-800 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-center text-white">
            Tạo tài khoản
          </h1>
          <p className="mt-2 text-center text-sm text-gray-400">
            Tham gia cộng đồng của chúng tôi ngay hôm nay
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {renderInput("name", "Họ và tên", "text", "Nguyễn Văn A", "name")}
            {renderInput("email", "Email", "email", "you@example.com", "email")}
            {renderInput(
              "password",
              "Mật khẩu",
              "password",
              "••••••••",
              "new-password"
            )}
            {renderInput(
              "confirmPassword",
              "Nhập lại mật khẩu",
              "password",
              "••••••••",
              "new-password"
            )}
          </div>

          <div className="flex items-start">
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
            <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
              Tôi đồng ý với{" "}
              <a href="#" className="text-indigo-500 hover:text-indigo-400">
                Điều khoản dịch vụ
              </a>
            </label>
          </div>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-500">{errors.terms}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </button>

          <div className="text-sm text-center">
            <span className="text-gray-400">Đã có tài khoản?</span>{" "}
            <Link to="/login" className="text-indigo-500 hover:text-indigo-400">
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
