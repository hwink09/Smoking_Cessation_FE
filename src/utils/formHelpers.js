// Form utilities and helpers
import { message } from "antd";
import { formatValidationError } from "./userValidation";

// ==================== FORM HELPERS ====================

/**
 * Handle form submission with loading state
 */
export const handleFormSubmit = async (
  submitFunction,
  values,
  {
    setLoading,
    onSuccess,
    onError,
    successMessage = "Thành công!",
    errorMessage = "Đã xảy ra lỗi!",
  }
) => {
  setLoading(true);
  try {
    const result = await submitFunction(values);

    if (result.success) {
      message.success(successMessage);
      onSuccess?.(result);
    } else {
      const error = formatValidationError(result.error) || errorMessage;
      message.error(error);
      onError?.(result);
    }
  } catch (error) {
    const errorMsg = formatValidationError(error) || errorMessage;
    message.error(errorMsg);
    onError?.(error);
  } finally {
    setLoading(false);
  }
};

/**
 * Reset form fields
 */
export const resetForm = (form, initialValues = {}) => {
  form.resetFields();
  form.setFieldsValue(initialValues);
};

/**
 * Validate form fields before submit
 */
export const validateFields = async (form, fields = null) => {
  try {
    const values = await form.validateFields(fields);
    return { isValid: true, values };
  } catch (error) {
    return { isValid: false, error };
  }
};

/**
 * Set form errors
 */
export const setFormErrors = (form, errors) => {
  const formErrors = Object.keys(errors).map((field) => ({
    name: field,
    errors: [errors[field]],
  }));
  form.setFields(formErrors);
};

/**
 * Get form values with sanitization
 */
export const getSanitizedFormValues = (form) => {
  const values = form.getFieldsValue();
  const sanitized = {};

  Object.keys(values).forEach((key) => {
    const value = values[key];
    if (typeof value === "string") {
      sanitized[key] = value.trim();
    } else {
      sanitized[key] = value;
    }
  });

  return sanitized;
};

// ==================== DATE HELPERS ====================

/**
 * Format date for display
 */
export const formatDate = (date, locale = "vi-VN") => {
  if (!date) return "";
  return new Date(date).toLocaleDateString(locale);
};

/**
 * Format datetime for display
 */
export const formatDateTime = (date, locale = "vi-VN") => {
  if (!date) return "";
  return new Date(date).toLocaleString(locale);
};

/**
 * Check if date is in the future
 */
export const isFutureDate = (date) => {
  if (!date) return false;
  return new Date(date) > new Date();
};

/**
 * Check if date is in the past
 */
export const isPastDate = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

/**
 * Get days between two dates
 */
export const getDaysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// ==================== VALIDATION HELPERS ====================

/**
 * Check if all required fields are filled
 */
export const checkRequiredFields = (values, requiredFields) => {
  const missing = [];

  requiredFields.forEach((field) => {
    const value = values[field];
    if (!value || (typeof value === "string" && value.trim() === "")) {
      missing.push(field);
    }
  });

  return {
    isValid: missing.length === 0,
    missingFields: missing,
  };
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate URL format
 */
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ==================== INPUT HELPERS ====================

/**
 * Sanitize text input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/[<>]/g, "");
};

/**
 * Capitalize first letter
 */
export const capitalizeFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  // Format as needed (example: +84 123 456 789)
  if (cleaned.length === 10) {
    return `+84 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(
      7
    )}`;
  }
  return phone;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// ==================== UPLOAD HELPERS ====================

/**
 * Check file size
 */
export const checkFileSize = (file, maxSizeInMB = 5) => {
  const maxSize = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSize;
};

/**
 * Check file type
 */
export const checkFileType = (
  file,
  allowedTypes = ["image/jpeg", "image/png"]
) => {
  return allowedTypes.includes(file.type);
};

/**
 * Get file extension
 */
export const getFileExtension = (filename) => {
  return filename.split(".").pop().toLowerCase();
};

/**
 * Convert file to base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// ==================== PROGRESS HELPERS ====================

/**
 * Calculate progress percentage
 */
export const calculateProgress = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Get progress color
 */
export const getProgressColor = (percentage) => {
  if (percentage >= 100) return "green";
  if (percentage >= 75) return "blue";
  if (percentage >= 50) return "orange";
  return "red";
};

/**
 * Get progress status text
 */
export const getProgressStatusText = (percentage) => {
  if (percentage >= 100) return "Hoàn thành";
  if (percentage >= 75) return "Gần hoàn thành";
  if (percentage >= 50) return "Đang thực hiện";
  if (percentage > 0) return "Mới bắt đầu";
  return "Chưa bắt đầu";
};

// ==================== MESSAGE HELPERS ====================

/**
 * Show success message
 */
export const showSuccess = (content = "Thành công!", duration = 3) => {
  message.success(content, duration);
};

/**
 * Show error message
 */
export const showError = (content = "Đã xảy ra lỗi!", duration = 3) => {
  message.error(content, duration);
};

/**
 * Show warning message
 */
export const showWarning = (content = "Cảnh báo!", duration = 3) => {
  message.warning(content, duration);
};

/**
 * Show info message
 */
export const showInfo = (content = "Thông tin!", duration = 3) => {
  message.info(content, duration);
};

/**
 * Show loading message
 */
export const showLoading = (content = "Đang tải...", duration = 0) => {
  return message.loading(content, duration);
};

// ==================== STORAGE HELPERS ====================

/**
 * Save to localStorage
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

/**
 * Get from localStorage
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch {
    return defaultValue;
  }
};

/**
 * Remove from localStorage
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

/**
 * Clear all localStorage
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch {
    return false;
  }
};

// ==================== EXPORT ALL ====================

export default {
  handleFormSubmit,
  resetForm,
  validateFields,
  setFormErrors,
  getSanitizedFormValues,
  formatDate,
  formatDateTime,
  isFutureDate,
  isPastDate,
  getDaysBetween,
  checkRequiredFields,
  validateEmail,
  validatePhone,
  validateUrl,
  sanitizeInput,
  capitalizeFirst,
  formatPhoneNumber,
  truncateText,
  checkFileSize,
  checkFileType,
  getFileExtension,
  fileToBase64,
  calculateProgress,
  getProgressColor,
  getProgressStatusText,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showLoading,
  saveToStorage,
  getFromStorage,
  removeFromStorage,
  clearStorage,
};
