import axios from "axios";

// Dùng VITE_API_URL và đảm bảo không lặp "/api"
const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3000";

// Tạo instance Axios
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user.token || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//  Interceptor response để log lỗi
api.interceptors.response.use(
  (response) => {
    // Check for login endpoint and validate response structure
    if (
      response.config.url.includes("/auth/login") &&
      response.data &&
      response.data.success !== false
    ) {
      // For login endpoint, verify we have a proper user object
      if (!response.data.user || !response.data.user.userId) {
        console.warn("Login API response missing user data:", response.data);

        // Try to extract user from token if available
        if (response.data.token) {
          console.log(
            "Login API returned token but no user, attempting to extract user from token"
          );
        }
      }
    }
    return response;
  },
  (error) => {
    console.error("Response Error:", error.message);

    if (error.response) {
      console.error("Server Error Details:", {
        status: error.response.status,
        url: error.config?.url,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error("No response received:", {
        request: error.request,
        url: error.config?.url,
      });
    } else {
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
