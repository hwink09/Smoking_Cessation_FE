// src/contexts/AuthProvider.js
import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import authService from "~/services/authService";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Init: check localStorage
  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = authService.getCurrentUser();
        if (user?.userId) {
          setCurrentUser(user);
        } else {
          authService.logout();
        }
      } catch {
        authService.logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Helpers: Validate Forms
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

  const validateRegistrationForm = (data) => {
    const errors = {};
    if (!data.name || data.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }
    if (!data.password || data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
      errors.password =
        "Password must contain uppercase, lowercase, and numbers";
    }
    if (!data.confirmPassword || data.confirmPassword !== data.password) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!data.terms) {
      errors.terms = "You must accept the terms and conditions";
    }
    return errors;
  };

  const validateForgotPasswordForm = (email) => {
    if (!email || email.trim() === "") {
      return "Email không được để trống";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Định dạng email không hợp lệ";
    }
    return null;
  };
  const isFormValid = (errors) => Object.keys(errors).length === 0;

  // Core Actions
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      console.log("AuthProvider - Login response:", data);

      // Check if we have user data from the API response
      if (data.user && data.user.userId) {
        // Use the user from the API response
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      }

      // If API returned no user data but has a token, try to extract user from token
      if (data.token) {
        try {
          // Store the token first
          localStorage.setItem("token", data.token);

          // Try to get user from token using getCurrentUser
          const userFromToken = authService.getCurrentUser();

          if (userFromToken && userFromToken.userId) {
            console.log("User extracted from token:", userFromToken);
            setCurrentUser(userFromToken);
            return { success: true, user: userFromToken };
          }
        } catch (tokenError) {
          console.error("Failed to extract user from token:", tokenError);
        }
      }

      // If we get here, we couldn't get a valid user
      console.error("Login success but missing valid user object:", data);
      return {
        success: true,
        user: null,
        error: "Không thể lấy thông tin người dùng",
      };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed";
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
      await authService.loginWithGoogle(credential);
      const user = authService.getCurrentUser();
      setCurrentUser(user);
      return { success: true, user };
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
      const res = await authService.register(data);
      // Lưu lại nếu có token/user
      if (res.token) {
        authService.getCurrentUser();
        setCurrentUser(authService.getCurrentUser());
      }
      return { success: true, user: authService.getCurrentUser() };
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
      const data = await authService.verifyEmail(token);
      return { success: true, message: data.message };
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
      const data = await authService.resendVerification(email);
      return { success: true, message: data.message };
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
      const data = await authService.forgotPassword(email);
      return { success: true, message: data.message };
    } catch (err) {
      const msg = err.response?.data?.message || "Forgot password failed";
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
      const data = await authService.resetPassword(token, newPassword);
      return { success: true, message: data.message };
    } catch (err) {
      const msg = err.response?.data?.message || "Reset password failed";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setError(null);
    return { success: true, message: "Đăng xuất thành công" };
  };

  const clearError = () => setError(null);

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
    validateRegistrationForm,
    validateForgotPasswordForm,
    isFormValid,
    formatAuthError: (msg) => msg || "An error occurred",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
