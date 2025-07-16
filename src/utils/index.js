// Main utilities export file
// This file consolidates all utility functions and components for easy importing

// Validation utilities
export * from "./userValidation";
export { default as userValidation } from "./userValidation";

// Form helpers
export * from "./formHelpers";
export { default as formHelpers } from "./formHelpers";

// Export individual validation rule sets for convenience
export {
  userValidationRules,
  quitPlanValidationRules,
  progressValidationRules,
  taskValidationRules,
} from "./userValidation";

// Export commonly used helper functions
export {
  handleFormSubmit,
  validateFields,
  formatDate,
  formatDateTime,
  sanitizeInput,
  showSuccess,
  showError,
  showWarning,
  calculateProgress,
  getProgressColor,
  getProgressStatusText,
} from "./formHelpers";

// Export validation functions
export {
  validatePasswordConfirmation,
  validateDateRange,
  validateFileSize,
  validateFileType,
  isValidEmail,
  isStrongPassword,
  isValidPhone,
  getValidationRules,
  validateFormData,
} from "./userValidation";

// Common constants
export const VALIDATION_MESSAGES = {
  REQUIRED: "Trường này là bắt buộc",
  EMAIL_INVALID: "Email không hợp lệ",
  PASSWORD_WEAK:
    "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số",
  PASSWORD_MISMATCH: "Mật khẩu xác nhận không khớp",
  PHONE_INVALID: "Số điện thoại không hợp lệ",
  FILE_TOO_LARGE: "File quá lớn",
  FILE_TYPE_INVALID: "Định dạng file không được hỗ trợ",
  DATE_INVALID: "Ngày không hợp lệ",
  FUTURE_DATE_REQUIRED: "Ngày phải là ngày trong tương lai",
  PAST_DATE_REQUIRED: "Ngày phải là ngày trong quá khứ",
};

export const PROGRESS_COLORS = {
  DANGER: "red",
  WARNING: "orange",
  SUCCESS: "green",
  INFO: "blue",
  PRIMARY: "purple",
};

export const FORM_LAYOUTS = {
  VERTICAL: "vertical",
  HORIZONTAL: "horizontal",
  INLINE: "inline",
};

export const FILE_TYPES = {
  IMAGE: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  DOCUMENT: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  SPREADSHEET: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  VIDEO: ["video/mp4", "video/webm", "video/ogg"],
  AUDIO: ["audio/mp3", "audio/wav", "audio/ogg"],
};

export const DEFAULT_FORM_RULES = {
  required: { required: true, message: VALIDATION_MESSAGES.REQUIRED },
  email: { type: "email", message: VALIDATION_MESSAGES.EMAIL_INVALID },
  phone: {
    pattern: /^[+]?[0-9]{10,15}$/,
    message: VALIDATION_MESSAGES.PHONE_INVALID,
  },
  url: { type: "url", message: "URL không hợp lệ" },
  min: (length) => ({ min: length, message: `Tối thiểu ${length} ký tự` }),
  max: (length) => ({ max: length, message: `Tối đa ${length} ký tự` }),
  minNumber: (value) => ({
    min: value,
    message: `Giá trị tối thiểu là ${value}`,
  }),
  maxNumber: (value) => ({ max: value, message: `Giá trị tối đa là ${value}` }),
};

// Helper function to create common validation rules
export const createValidationRules = (type, options = {}) => {
  const rules = [];

  switch (type) {
    case "email":
      rules.push(DEFAULT_FORM_RULES.email);
      break;
    case "phone":
      rules.push(DEFAULT_FORM_RULES.phone);
      break;
    case "url":
      rules.push(DEFAULT_FORM_RULES.url);
      break;
    case "password":
      rules.push(DEFAULT_FORM_RULES.min(6));
      rules.push({
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: VALIDATION_MESSAGES.PASSWORD_WEAK,
      });
      break;
    case "text":
      if (options.min) rules.push(DEFAULT_FORM_RULES.min(options.min));
      if (options.max) rules.push(DEFAULT_FORM_RULES.max(options.max));
      break;
    case "number":
      if (options.min !== undefined)
        rules.push(DEFAULT_FORM_RULES.minNumber(options.min));
      if (options.max !== undefined)
        rules.push(DEFAULT_FORM_RULES.maxNumber(options.max));
      break;
  }

  if (options.required) {
    rules.unshift(DEFAULT_FORM_RULES.required);
  }

  return rules;
};

// Export everything as default
export default {
  VALIDATION_MESSAGES,
  PROGRESS_COLORS,
  FORM_LAYOUTS,
  FILE_TYPES,
  DEFAULT_FORM_RULES,
  createValidationRules,
};
