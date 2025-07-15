/**
 * Validate email format
 */
export const validateEmail = (email) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

/**
 * Validate strong password: min 6, uppercase, lowercase, number
 */
export const validatePassword = (password) => {
  const errors = [];
  if (!password || password.length < 6)
    errors.push("Password must be at least 6 characters");
  if (!/[A-Z]/.test(password))
    errors.push("Password must have at least 1 uppercase letter");
  if (!/[a-z]/.test(password))
    errors.push("Password must have at least 1 lowercase letter");
  if (!/[0-9]/.test(password))
    errors.push("Password must have at least 1 number");
  return { isValid: errors.length === 0, errors };
};

/**
 * Validate login password (len >= 6)
 */
export const validateLoginPassword = (password) => {
  const errors = [];
  if (!password) errors.push("Password is required");
  else if (password.length < 6)
    errors.push("Password must be at least 6 characters");
  return { isValid: errors.length === 0, errors };
};

/**
 * Validate login form
 */
export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  if (!email?.trim()) errors.email = "Email is required";
  else if (!validateEmail(email.trim())) errors.email = "Invalid email address";
  const passCheck = validateLoginPassword(password);
  if (!passCheck.isValid) errors.password = passCheck.errors[0];
  return errors;
};

/**
 * Validate registration form
 */
export const validateRegisterForm = ({
  name,
  email,
  password,
  confirmPassword,
}) => {
  const errors = {};
  if (!name?.trim()) errors.name = "Name is required";
  else if (name.trim().length < 2)
    errors.name = "Name must be at least 2 characters";
  if (!validateEmail(email)) errors.email = "Invalid email address";
  const passCheck = validatePassword(password);
  if (!passCheck.isValid) errors.password = passCheck.errors[0];
  if (password !== confirmPassword)
    errors.confirmPassword = "Passwords do not match";
  return errors;
};

/**
 * Validate registration form with terms acceptance
 */
export const validateRegistrationForm = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  const passCheck = validatePassword(data.password);
  if (!passCheck.isValid) {
    errors.password = passCheck.errors[0];
  }

  if (!data.confirmPassword || data.confirmPassword !== data.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!data.terms) {
    errors.terms = "You must accept the terms and conditions";
  }

  return errors;
};

/**
 * Validate forgot password form
 */
export const validateForgotPasswordForm = (email) => {
  if (!email || email.trim() === "") {
    return "Email không được để trống";
  }
  if (!validateEmail(email)) {
    return "Định dạng email không hợp lệ";
  }
  return null;
};

/**
 * Simple name check
 */
export const validateName = (name) => name?.trim().length >= 2;

/**
 * Password match check
 */
export const passwordsMatch = (password, confirmPassword) =>
  password === confirmPassword;

/**
 * Phone number check
 */
export const validatePhone = (phone) => /^[+]?[1-9][\d]{0,15}$/.test(phone);

/**
 * Age check (13-120)
 */
export const validateAge = (age) => age >= 13 && age <= 120;

/**
 * Firebase/auth error formatter
 */
export const formatAuthError = (code) => {
  const map = {
    "auth/email-already-in-use": "Email already in use",
    "auth/invalid-email": "Invalid email address",
    "auth/weak-password": "Weak password",
    "auth/user-disabled": "Account disabled",
    "auth/user-not-found": "No user found",
    "auth/wrong-password": "Wrong password",
    "auth/too-many-requests": "Too many attempts. Try again later",
    "auth/network-request-failed": "Network error",
    "auth/email-not-verified": "Please verify your email",
    "auth/invalid-credentials": "Invalid email or password",
  };
  if (typeof code !== "string") return "An error occurred";
  return map[code] || (code.includes("auth/") ? "An error occurred" : code);
};

/**
 * Sanitize string input
 */
export const sanitizeInput = (input) =>
  typeof input === "string" ? input.trim().replace(/[<>]/g, "") : "";

/**
 * Check if form is valid
 */
export const isFormValid = (errors) => Object.keys(errors).length === 0;
