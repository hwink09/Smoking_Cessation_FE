import React, { useState, useEffect, createContext } from "react";
import api from "~/services/api";
import authService from "~/services/authService";
import {
  validateEmail,
  validatePassword,
  validateName,
  passwordsMatch,
} from "~/utils/validations";

// Create the AuthContext
const AuthContext = createContext(null);

// Create AuthProvider component
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Authentication status check failed:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });

      // Store token in localStorage
      if (response.token) {
        localStorage.setItem("token", response.token);
        setCurrentUser(response.user);
      }

      return {
        success: true,
        user: response.user,
        token: response.token,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Invalid email or password";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await authService.register({
        name,
        email,
        password,
      });

      return { success: true, message: response.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      return {
        success: true,
        message: "Password reset email sent successfully",
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send password reset email";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      authService.logout();
      setCurrentUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to logout" };
    }
  };

  // Reset password function
  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      const response = await api.post(`/auth/reset-password/${token}`, {
        newPassword,
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to reset password";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Form validation functions
  const validateLoginForm = (formData) => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const validateRegistrationForm = (formData) => {
    const errors = {};

    if (!validateName(formData.name)) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0];
    }

    if (!passwordsMatch(formData.password, formData.confirmPassword)) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.terms) {
      errors.terms = "You must agree to the Terms and Conditions";
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const validateForgotPasswordForm = (email) => {
    if (!email) {
      return { isValid: false, error: "Email is required" };
    }

    if (!validateEmail(email)) {
      return { isValid: false, error: "Please enter a valid email" };
    }

    return { isValid: true, error: "" };
  };

  // Validation function for reset password form
  const validateResetPasswordForm = (password, confirmPassword) => {
    const errors = {};

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0];
    }

    if (!passwordsMatch(password, confirmPassword)) {
      errors.confirmPassword = "Passwords do not match";
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  // Google login function
  const loginWithGoogle = async (tokenId) => {
    try {
      setLoading(true);
      const response = await authService.loginWithGoogle(tokenId);

      if (response.user) {
        setCurrentUser(response.user);
      }

      return {
        success: true,
        user: response.user,
        token: response.token,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Google login failed. Please try again.";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    loginWithGoogle,
    register,
    forgotPassword,
    logout,
    resetPassword,
    validateLoginForm,
    validateRegistrationForm,
    validateForgotPasswordForm,
    validateResetPasswordForm,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
