import axios from "axios";

// Sử dụng VITE_API_URL và loại bỏ phần "/api" vì đã bao gồm trong VITE_API_URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL + "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((request) => {
  console.log("Starting Request:", request);
  return request;
});

api.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("Response Error:", error.message);

    // Log more detailed error information
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error("Server Error Details:", {
        status: error.response.status,
        url: error.config?.url,
        data: error.response.data,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", {
        request: error.request,
        url: error.config?.url,
      });
    } else {
      // Error in setting up the request
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý token xác thực
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const editUserProfile = async (userId, profileData) => {
  try {
    const response = await api.put(`/user/edit-profile/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export default api;
