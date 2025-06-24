// src/contexts/AuthProvider.js
import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import api from "~/services/api";
import authService from "~/services/authService";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: Clear localStorage
  const clearAuthStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Form validation helpers
  const validateLoginForm = (data) => {
    const errors = {};
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }

    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const isFormValid = (errors) => {
    return Object.keys(errors).length === 0;
  };

  // Registration form validation
  const validateRegistrationForm = (data) => {
    const errors = {};

    // Name validation
    if (!data.name || data.name.trim() === "") {
      errors.name = "Name is required";
    } else if (data.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }

    // Password validation
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
      errors.password =
        "Password must contain uppercase, lowercase, and numbers";
    }

    // Confirm password validation
    if (!data.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (data.confirmPassword !== data.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Terms validation
    if (!data.terms) {
      errors.terms = "You must accept the terms and conditions";
    }

    return errors;
  };

  // Init: check token & stored user
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          clearAuthStorage();
          return;
        }
        const user =
          authService.getCurrentUser() ||
          JSON.parse(localStorage.getItem("user"));
        if (user?.userId) {
          setCurrentUser(user);
        } else {
          clearAuthStorage();
        }
      } catch {
        clearAuthStorage();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  // Core actions
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      console.log("AuthProvider: Đang gọi authService.login");
      const result = await authService.login(credentials);
      console.log("AuthProvider: Kết quả đăng nhập:", result);

      // Kiểm tra kỹ cấu trúc dữ liệu
      const token = result.token || result.user?.token;
      const user = result.user || result;

      if (!token) {
        console.error(
          "AuthProvider: Không tìm thấy token trong kết quả:",
          result
        );
        throw new Error("Đăng nhập thành công nhưng thiếu thông tin xác thực");
      }

      if (!user || (!user.userId && !user.id && !user._id)) {
        console.error(
          "AuthProvider: Không tìm thấy thông tin user hợp lệ:",
          user
        );
        throw new Error(
          "Đăng nhập thành công nhưng thiếu thông tin người dùng"
        );
      }

      const userToStore = {
        ...user,
        userId: user.userId || user.id || user._id,
        _id: user._id || user.userId || user.id,
        id: user.id || user.userId || user._id,
      };

      console.log("AuthProvider: Lưu thông tin user:", userToStore);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userToStore));
      setCurrentUser(userToStore);

      return {
        success: true,
        user: userToStore,
        token,
        message: "Đăng nhập thành công!",
      };
    } catch (err) {
      console.error("AuthProvider: Lỗi đăng nhập:", err);
      // Ghi log chi tiết phản hồi
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Data:", err.response.data);
        console.error("Headers:", err.response.headers);
      }

      const msg =
        err.response?.data?.message ||
        err.message ||
        "Tên đăng nhập hoặc mật khẩu không đúng";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credential) => {
    setLoading(true);
    setError(null);
    try {
      if (!credential) throw new Error("Missing Google credential");
      const res = await authService.loginWithGoogle(credential);
      const token = res.token || res.user?.token;
      if (!token || !res.user) throw new Error("Missing token or user");
      const user = {
        ...res.user,
        userId: res.user.userId || res.user.id || res.user._id,
        name: res.user.name || res.user.username || res.user.displayName,
        email: res.user.email,
        avatar: res.user.avatar_url || res.user.picture,
        token,
      };
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
      return { success: true, user, token };
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Google login failed";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await authService.register(data);
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setCurrentUser(user);
      }
      return { success: true, user, token };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };
  const verifyEmail = async (token) => {
    setLoading(true);
    setError(null);
    try {
      // Thử phương thức đầu tiên: /auth/verify/{token}
      try {
        const res = await api.get(`/auth/verify/${token}`);
        return { success: true, message: res.data.message };
      } catch (pathError) {
        // Nếu trả về 404 hoặc 400, thử phương thức thứ hai: /auth/verify?token=
        if (
          pathError.response &&
          (pathError.response.status === 404 ||
            pathError.response.status === 400)
        ) {
          const altResponse = await api.get(`/auth/verify`, {
            params: { token },
          });
          return { success: true, message: altResponse.data.message };
        }
        throw pathError;
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Verification failed";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/resend-verification", { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || "Resend failed";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Gửi yêu cầu quên mật khẩu cho email:", email);
      const res = await api.post("/auth/fogot-password", { email });
      console.log("Phản hồi quên mật khẩu:", res.data);
      return {
        success: true,
        message: res.data.message || "Đã gửi email khôi phục mật khẩu",
      };
    } catch (err) {
      console.error("Lỗi quên mật khẩu:", err);
      const msg =
        err.response?.data?.message || "Lỗi khi gửi email đặt lại mật khẩu";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`/auth/resset-password/${token}`, {
        newPassword,
      });
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to reset password";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    try {
      authService.logout();
      clearAuthStorage();
      setCurrentUser(null);
      setError(null);
      return { success: true, message: "Đăng xuất thành công" };
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      return { success: false, error: "Có lỗi xảy ra khi đăng xuất" };
    }
  };

  const clearError = () => setError(null);

  // Validation for forgot password form
  const validateForgotPasswordForm = (email) => {
    if (!email || email.trim() === "") {
      return "Email không được để trống";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Định dạng email không hợp lệ";
    }

    return null; // No error
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    logout,
    clearError,
    validateLoginForm,
    isFormValid,
    validateRegistrationForm,
    validateForgotPasswordForm,
    formatAuthError: (msg) => msg || "An error occurred",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
