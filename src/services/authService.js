import api from "./api";
import { jwtDecode } from "jwt-decode";

// Helper to store token and user
function storeAuthData(data) {
  if (data.token) localStorage.setItem("token", data.token);
  if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
}

const authService = {
  // POST /api/auth/login
  login: async (credentials) => {
    try {
      console.log("Đang gửi yêu cầu đăng nhập với:", credentials.email);
      const response = await api.post("/auth/login", credentials);
      console.log("Response đăng nhập:", response.data);

      // Kiểm tra dữ liệu trả về
      if (!response.data.token && !response.data.user?.token) {
        console.error(
          "Đăng nhập thành công nhưng không có token:",
          response.data
        );
        throw new Error("Đăng nhập thành công nhưng thiếu thông tin xác thực");
      }

      storeAuthData(response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      if (error.response?.status === 200 && !error.response.data.token) {
        console.error(
          "Backend trả về 200 nhưng thiếu dữ liệu:",
          error.response.data
        );
      }
      throw error;
    }
  },

  // POST /api/auth/google
  loginWithGoogle: async (credential) => {
    if (!credential) throw new Error("Invalid Google credential");
    try {
      const endpoint = "/auth/google";
      const existingToken = localStorage.getItem("token");
      const headers = existingToken
        ? { Authorization: `Bearer ${existingToken}` }
        : {};
      const response = await api.post(
        endpoint,
        { credential },
        { headers, timeout: 10000 }
      );
      storeAuthData(response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          const originError = error.response.headers?.["x-permitted-origin"]
            ? ` Origin mismatch. Expected: ${error.response.headers["x-permitted-origin"]}, Got: ${window.location.origin}`
            : "";
          throw new Error(
            `Máy chủ từ chối quyền truy cập (403): Vui lòng kiểm tra cấu hình tài khoản Google hoặc liên hệ quản trị viên.${originError}`
          );
        } else if (error.response.status === 401) {
          throw new Error(
            "Xác thực Google thất bại (401): Token không hợp lệ hoặc đã hết hạn."
          );
        } else if (error.response.status >= 500) {
          throw new Error("Lỗi máy chủ: Vui lòng thử lại sau.");
        }
      }
      throw error.message
        ? error
        : new Error("Đăng nhập Google thất bại. Vui lòng thử lại.");
    }
  },

  // POST /api/auth/register
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      throw error;
    }
  },

  // POST /api/auth/fogot-password
  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/fogot-password", { email });
      return response.data;
    } catch (error) {
      console.error("Lỗi quên mật khẩu:", error);
      throw error;
    }
  },

  // POST /api/auth/resset-password/{token}
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post(`/auth/resset-password/${token}`, {
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi đặt lại mật khẩu:", error);
      throw error;
    }
  },

  // POST /api/auth/resend-verification
  resendVerification: async (email) => {
    try {
      const response = await api.post("/auth/resend-verification", { email });
      return response.data;
    } catch (error) {
      console.error("Lỗi gửi lại xác minh:", error);
      throw error;
    }
  }, // GET /api/auth/verify/:token
  verifyEmail: (() => {
    // Sử dụng closure để lưu trữ token đã verify
    const verifiedTokens = new Set();

    return async (token) => {
      // Kiểm tra xem token đã được xử lý chưa
      if (verifiedTokens.has(token)) {
        console.log("Token đã được xử lý trước đó, không gọi API lại");
        return { message: "Email đã được xác minh thành công" };
      }

      try {
        const response = await api.get(`/auth/verify/${token}`);
        // Lưu token đã xác minh vào Set để tránh gọi lại API
        verifiedTokens.add(token);
        return response.data;
      } catch (error) {
        console.error("Lỗi xác minh email:", error);
        throw error;
      }
    };
  })(),

  logout: () => {
    try {
      // Xóa dữ liệu local
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Xóa cookies nếu có
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      console.log("Đã xóa thông tin đăng nhập");
      return true;
    } catch (error) {
      console.error("Lỗi khi logout:", error);
      throw error;
    }
  },

  getCurrentUser: () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const decoded = jwtDecode(token);
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId =
        decoded.id || decoded.userId || decoded.sub || storedUser.userId;
      if (!userId) return null;
      return {
        userId,
        name: decoded.name || storedUser.name,
        email: decoded.email || storedUser.email,
        role: decoded.role || storedUser.role,
        avatar_url:
          decoded.avatar_url || decoded.avatarUrl || storedUser.avatar_url,
      };
    } catch (error) {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser && storedUser.userId) return storedUser;
      } catch (parseError) {
        // Lỗi khi parse dữ liệu user từ localStorage
        console.error("Error parsing user data:", parseError);
      }
      return null;
    }
  },
};

export default authService;
