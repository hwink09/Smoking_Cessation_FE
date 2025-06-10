/**
 * Email validation using regex
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

/**
 * Password validation - Requires:
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * @param {string} password - Password to validate
 * @returns {object} - Validation result and error message
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Simple password validation for login (only check if exists and minimum length)
 * @param {string} password - Password to validate
 * @returns {object} - Validation result and error message
 */
export const validateLoginPassword = (password) => {
  const errors = [];

  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate login form data
 * @param {object} data - Form data with email and password
 * @returns {object} - Validation errors object
 */
export const validateLoginForm = (data) => {
  const errors = {};

  // Validate email
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  // Validate password for login (simpler validation)
  const passwordValidation = validateLoginPassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors[0];
  }

  return errors;
};

/**
 * Validate registration form data
 * @param {object} data - Form data
 * @returns {object} - Validation errors object
 */
export const validateRegisterForm = (data) => {
  const errors = {};

  // Validate name
  if (!data.name || !data.name.trim()) {
    errors.name = "Name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  // Validate email
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Validate password (strict validation for registration)
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors[0];
  }

  // Validate confirm password
  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

/**
 * Name validation
 * @param {string} name - Name to validate
 * @returns {boolean} - Whether name is valid
 */
export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

/**
 * Check if passwords match
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirm password
 * @returns {boolean} - Whether passwords match
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether phone is valid
 */
export const validatePhone = (phone) => {
  const regex = /^[+]?[1-9][\d]{0,15}$/;
  return regex.test(phone);
};

/**
 * Validate age
 * @param {number} age - Age to validate
 * @returns {boolean} - Whether age is valid
 */
export const validateAge = (age) => {
  return age >= 13 && age <= 120;
};

/**
 * Format error message from Firebase or API
 * @param {string} errorCode - Error code or message
 * @returns {string} - User-friendly error message
 */
export const formatAuthError = (errorCode) => {
  // Handle both error codes and direct messages
  if (typeof errorCode === "string") {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "This email address is already in use";
      case "auth/invalid-email":
        return "The email address is not valid";
      case "auth/weak-password":
        return "The password is too weak";
      case "auth/user-disabled":
        return "This account has been disabled";
      case "auth/user-not-found":
        return "No account found with this email";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/too-many-requests":
        return "Too many unsuccessful login attempts. Please try again later";
      case "auth/network-request-failed":
        return "Network error. Please check your connection";
      case "auth/email-not-verified":
        return "Please verify your email address before signing in";
      case "auth/invalid-credentials":
        return "Invalid email or password";
      default:
        // Return the original message if it's already user-friendly
        return errorCode.includes("auth/")
          ? "An error occurred. Please try again"
          : errorCode;
    }
  }
  return "An error occurred. Please try again";
};

/**
 * Sanitize input string
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";
  return input.trim().replace(/[<>]/g, "");
};

/**
 * Check if form data is valid
 * @param {object} errors - Errors object
 * @returns {boolean} - Whether form is valid
 */
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};
