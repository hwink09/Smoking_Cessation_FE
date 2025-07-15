// User validation utilities and rules
// This file contains all validation logic for user-related forms and data

// ==================== VALIDATION RULES FOR ANT DESIGN FORMS ====================

/**
 * Common validation rules for user forms
 */
export const userValidationRules = {
  // Name validation
  name: [
    { required: true, message: "Vui lòng nhập họ và tên!" },
    { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự!" },
    { max: 50, message: "Họ và tên không được vượt quá 50 ký tự!" },
    {
      pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
      message: "Họ và tên chỉ được chứa chữ cái và khoảng trắng!",
    },
  ],

  // Email validation
  email: [
    { required: true, message: "Vui lòng nhập email!" },
    { type: "email", message: "Email không hợp lệ!" },
    { max: 100, message: "Email không được vượt quá 100 ký tự!" },
  ],

  // Password validation
  password: [
    { required: true, message: "Vui lòng nhập mật khẩu!" },
    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
    { max: 50, message: "Mật khẩu không được vượt quá 50 ký tự!" },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: "Mật khẩu phải có ít nhất 1 chữ thường, 1 chữ hoa và 1 số!",
    },
  ],

  // Simple password validation (for login)
  loginPassword: [
    { required: true, message: "Vui lòng nhập mật khẩu!" },
    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
  ],

  // Phone validation
  phone: [
    { required: false },
    {
      pattern: /^[+]?[0-9]{10,15}$/,
      message: "Số điện thoại không hợp lệ!",
    },
  ],

  // Age validation
  age: [
    { required: false },
    { type: "number", message: "Tuổi phải là một số!" },
    { min: 13, message: "Tuổi phải từ 13 trở lên!" },
    { max: 120, message: "Tuổi phải dưới 120!" },
  ],

  // Avatar URL validation
  avatar_url: [
    { required: false },
    { type: "url", message: "URL avatar không hợp lệ!" },
  ],

  // Terms and conditions
  terms: [
    {
      validator: (_, value) =>
        value
          ? Promise.resolve()
          : Promise.reject("Vui lòng đồng ý với điều khoản sử dụng!"),
    },
  ],

  // Role validation
  role: [
    { required: true, message: "Vui lòng chọn vai trò!" },
    {
      enum: ["user", "admin", "coach"],
      message: "Vai trò không hợp lệ!",
    },
  ],
};

// ==================== QUIT PLAN VALIDATION RULES ====================

export const quitPlanValidationRules = {
  // Plan name validation
  planName: [
    { required: true, message: "Vui lòng nhập tên kế hoạch!" },
    { min: 3, message: "Tên kế hoạch phải có ít nhất 3 ký tự!" },
    { max: 100, message: "Tên kế hoạch không được vượt quá 100 ký tự!" },
  ],

  // Start date validation
  startDate: [
    { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
    {
      validator: (_, value) =>
        value && value.isAfter(new Date(), "day")
          ? Promise.resolve()
          : Promise.reject("Ngày bắt đầu phải là ngày trong tương lai!"),
    },
  ],

  // Target quit date validation
  targetQuitDate: [
    { required: true, message: "Vui lòng chọn ngày mục tiêu!" },
    {
      validator: (_, value) =>
        value && value.isAfter(new Date(), "day")
          ? Promise.resolve()
          : Promise.reject("Ngày mục tiêu phải là ngày trong tương lai!"),
    },
  ],

  // Reason validation
  reason: [
    { required: true, message: "Vui lòng nhập lý do cai thuốc!" },
    { min: 10, message: "Lý do phải có ít nhất 10 ký tự!" },
    { max: 500, message: "Lý do không được vượt quá 500 ký tự!" },
  ],

  // Cigarettes per day validation
  cigarettesPerDay: [
    { required: true, message: "Vui lòng nhập số điếu thuốc mỗi ngày!" },
    { type: "number", message: "Số điếu thuốc phải là một số!" },
    { min: 1, message: "Số điếu thuốc phải lớn hơn 0!" },
    { max: 100, message: "Số điếu thuốc không được vượt quá 100!" },
  ],

  // Years smoking validation
  yearsSmoking: [
    { required: true, message: "Vui lòng nhập số năm hút thuốc!" },
    { type: "number", message: "Số năm hút thuốc phải là một số!" },
    { min: 0, message: "Số năm hút thuốc phải lớn hơn hoặc bằng 0!" },
    { max: 80, message: "Số năm hút thuốc không được vượt quá 80!" },
  ],
};

// ==================== PROGRESS VALIDATION RULES ====================

export const progressValidationRules = {
  // Mood validation (1-10 scale)
  mood: [
    { required: true, message: "Vui lòng đánh giá tâm trạng!" },
    { type: "number", message: "Tâm trạng phải là một số!" },
    { min: 1, message: "Tâm trạng phải từ 1 đến 10!" },
    { max: 10, message: "Tâm trạng phải từ 1 đến 10!" },
  ],

  // Cigarettes smoked validation
  cigarettesSmoked: [
    { required: true, message: "Vui lòng nhập số điếu thuốc đã hút!" },
    { type: "number", message: "Số điếu thuốc phải là một số!" },
    { min: 0, message: "Số điếu thuốc phải lớn hơn hoặc bằng 0!" },
    { max: 100, message: "Số điếu thuốc không được vượt quá 100!" },
  ],

  // Notes validation
  notes: [
    { required: false },
    { max: 500, message: "Ghi chú không được vượt quá 500 ký tự!" },
  ],
};

// ==================== TASK VALIDATION RULES ====================

export const taskValidationRules = {
  // Task title validation
  title: [
    { required: true, message: "Vui lòng nhập tiêu đề nhiệm vụ!" },
    { min: 3, message: "Tiêu đề phải có ít nhất 3 ký tự!" },
    { max: 100, message: "Tiêu đề không được vượt quá 100 ký tự!" },
  ],

  // Task description validation
  description: [
    { required: true, message: "Vui lòng nhập mô tả nhiệm vụ!" },
    { min: 10, message: "Mô tả phải có ít nhất 10 ký tự!" },
    { max: 500, message: "Mô tả không được vượt quá 500 ký tự!" },
  ],

  // Deadline validation
  deadline: [
    { required: false },
    {
      validator: (_, value) =>
        !value || value.isAfter(new Date(), "day")
          ? Promise.resolve()
          : Promise.reject("Hạn chót phải là ngày trong tương lai!"),
    },
  ],
};

// ==================== CUSTOM VALIDATORS ====================

/**
 * Validate password confirmation
 */
export const validatePasswordConfirmation = (getFieldValue) => ({
  validator(_, value) {
    if (!value || getFieldValue("password") === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
  },
});

/**
 * Validate date range (end date must be after start date)
 */
export const validateDateRange = (startFieldName, endFieldName) => ({
  validator(_, value) {
    const form = this.form;
    const startDate = form.getFieldValue(startFieldName);
    const endDate = form.getFieldValue(endFieldName);

    if (!startDate || !endDate) {
      return Promise.resolve();
    }

    if (endDate.isAfter(startDate)) {
      return Promise.resolve();
    }

    return Promise.reject(new Error("Ngày kết thúc phải sau ngày bắt đầu!"));
  },
});

/**
 * Validate file size
 */
export const validateFileSize = (maxSizeInMB = 5) => ({
  validator(_, value) {
    if (!value || !value.file) {
      return Promise.resolve();
    }

    const file = value.file;
    const isLt5M = file.size / 1024 / 1024 < maxSizeInMB;

    if (!isLt5M) {
      return Promise.reject(
        new Error(`Kích thước file phải nhỏ hơn ${maxSizeInMB}MB!`)
      );
    }

    return Promise.resolve();
  },
});

/**
 * Validate file type
 */
export const validateFileType = (
  allowedTypes = ["image/jpeg", "image/png"]
) => ({
  validator(_, value) {
    if (!value || !value.file) {
      return Promise.resolve();
    }

    const file = value.file;
    const isValidType = allowedTypes.includes(file.type);

    if (!isValidType) {
      const allowedTypesString = allowedTypes
        .map((type) => type.split("/")[1])
        .join(", ");
      return Promise.reject(
        new Error(`Chỉ chấp nhận file: ${allowedTypesString}!`)
      );
    }

    return Promise.resolve();
  },
});

// ==================== HELPER FUNCTIONS ====================

/**
 * Check if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if password is strong
 */
export const isStrongPassword = (password) => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
  return password.length >= 8 && strongPasswordRegex.test(password);
};

/**
 * Check if phone number is valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Sanitize string input
 */
export const sanitizeString = (str) => {
  if (typeof str !== "string") return "";
  return str.trim().replace(/[<>]/g, "");
};

/**
 * Format validation error message
 */
export const formatValidationError = (error) => {
  if (typeof error === "string") return error;
  if (error && error.message) return error.message;
  return "Dữ liệu không hợp lệ!";
};

/**
 * Get validation rules by field name
 */
export const getValidationRules = (category, fieldName) => {
  const categories = {
    user: userValidationRules,
    quitPlan: quitPlanValidationRules,
    progress: progressValidationRules,
    task: taskValidationRules,
  };

  return categories[category]?.[fieldName] || [];
};

/**
 * Validate form data before submission
 */
export const validateFormData = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = data[field];

    fieldRules.forEach((rule) => {
      if (
        rule.required &&
        (!value || (typeof value === "string" && value.trim() === ""))
      ) {
        errors[field] = rule.message;
        return;
      }

      if (rule.min && value && value.length < rule.min) {
        errors[field] = rule.message;
        return;
      }

      if (rule.max && value && value.length > rule.max) {
        errors[field] = rule.message;
        return;
      }

      if (rule.pattern && value && !rule.pattern.test(value)) {
        errors[field] = rule.message;
        return;
      }

      if (rule.type === "email" && value && !isValidEmail(value)) {
        errors[field] = rule.message;
        return;
      }
    });
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  userValidationRules,
  quitPlanValidationRules,
  progressValidationRules,
  taskValidationRules,
  validatePasswordConfirmation,
  validateDateRange,
  validateFileSize,
  validateFileType,
  isValidEmail,
  isStrongPassword,
  isValidPhone,
  sanitizeString,
  formatValidationError,
  getValidationRules,
  validateFormData,
};
