// src/contexts/AuthProvider.js
import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import authService from "~/services/authService";
import {
  validateLoginForm,
  validateRegisterForm,
  validateRegistrationForm,
  validateForgotPasswordForm,
  validateEmail,
  isFormValid,
  formatAuthError,
} from "~/utils/validations";

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
    formatAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
