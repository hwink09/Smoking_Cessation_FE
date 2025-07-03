import axios from "axios";

const isDev = import.meta.env.DEV;

// Chuẩn hóa URL base (tránh lặp `/api`)
const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:3000";

// Tạo instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Tách logic lấy token
const getAuthToken = () => {
  const directToken = localStorage.getItem("token");
  if (directToken) return directToken;

  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user?.token || user?.accessToken || null;
    } catch (e) {
      isDev && console.error("Error parsing user from localStorage:", e);
    }
  }
  return null;
};

// Request interceptor
api.interceptors.request.use((config) => {
  try {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      isDev && console.debug(`[API] Auth token set for ${config.url}`);
    } else {
      isDev && console.warn(`[API] No auth token for ${config.url}`);
    }
  } catch (err) {
    console.error("Request interceptor error:", err);
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Optional: Kiểm tra login response
    const isLogin = response.config.url.includes("/auth/login");
    if (isLogin && response.data?.success !== false) {
      const { user, token } = response.data;
      if (!user?.userId && token) {
        isDev &&
          console.warn("[API] Login response missing user, token exists.");
      }
    }
    return response;
  },
  (error) => {
    console.error("[API Error]", error.message);

    if (error.response) {
      console.error("→ Server responded with error:", {
        status: error.response.status,
        url: error.config?.url,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error("→ No response received for:", error.config?.url);
    } else {
      console.error("→ Axios config error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
