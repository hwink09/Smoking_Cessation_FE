import React, { useState, useEffect, createContext } from "react";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { provider } from "~/configs/firebase";
import {
  validateEmail,
  validatePassword,
  validateName,
  passwordsMatch,
  formatAuthError,
} from "~/utils/validations";
import axios from "axios";

// Create the AuthContext
const AuthContext = createContext(null);

// Create AuthProvider component
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);

      // Call the API endpoint
      const apiResponse = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        }
      );
      console.log("apiResponse:", apiResponse);

      return {
        success: true,
        // user: result.user,
        apiData: apiResponse.data, // Include API response data if needed
      };
    } catch (error) {
      // Handle errors from both API and Firebase
      const errorMessage =
        error.response?.data?.message ||
        formatAuthError(error.code) ||
        "An error occurred";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Google login function
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      return { success: true, user: result.user, token };
    } catch (error) {
      return { success: false, error: formatAuthError(error.code) };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      // Create user with email and password
      const apiResponse = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      console.log("API registration response:", apiResponse);

      // Update profile with name

      return { success: true };
    } catch (error) {
      return { success: false, error: formatAuthError(error.code) };
    } finally {
      setLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: formatAuthError(error.code) };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: formatAuthError(error.code) };
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

  const value = {
    currentUser,
    loading,
    login,
    loginWithGoogle,
    register,
    forgotPassword,
    logout,
    validateLoginForm,
    validateRegistrationForm,
    validateForgotPasswordForm,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
