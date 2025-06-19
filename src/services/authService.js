import api from "./api";
import { jwtDecode } from "jwt-decode";

// Helper to store token and user
function storeAuthData(data) {
  if (data.token) localStorage.setItem("token", data.token);
  if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
}

const authService = {
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

  testGoogleConfig: async () => {
    try {
      await api.get("/auth/google-config-test");
      return { success: true, message: "Google configuration is valid" };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Google configuration test failed",
      };
    }
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  logout: () => {
    // Có thể gọi API để đăng xuất ở phía server nếu cần
    try {
      // Có thể gọi API để đăng xuất ở phía server nếu cần (bỏ comment dưới đây nếu backend có API logout)
      // api.post('/auth/logout');

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

  _verificationInProgress: {},

  verifyEmail: async (token) => {
    // Kiểm tra xem token này đã đang được xác minh chưa
    if (authService._verificationInProgress[token]) {
      console.log("Đã có yêu cầu xác minh đang chạy cho token này, bỏ qua");
      return authService._verificationInProgress[token];
    }

    // Tạo một promise mới và lưu vào cache
    const verificationPromise = (async () => {
      try {
        console.log(
          "Gọi API xác minh email với token",
          token.substring(0, 8) + "..."
        );
        const response = await api.get(`/auth/verify/${token}`);
        console.log("API xác minh phản hồi thành công");
        return response.data;
      } catch (error) {
        console.log(
          "Lỗi khi xác minh với path params:",
          error.response?.status
        );
        if (
          error.response &&
          (error.response.status === 404 || error.response.status === 400)
        ) {
          console.log("Thử phương thức xác minh thay thế với query params");
          const altResponse = await api.get(`/auth/verify`, {
            params: { token },
          });
          return altResponse.data;
        }
        throw error;
      } finally {
        // Sau 2 giây, xóa khỏi cache để cho phép thử lại nếu cần
        setTimeout(() => {
          delete authService._verificationInProgress[token];
        }, 2000);
      }
    })();

    // Lưu promise vào cache và trả về
    authService._verificationInProgress[token] = verificationPromise;
    return verificationPromise;
  },

  resendVerification: async (email) => {
    const response = await api.post(`/auth/resend-verification`, { email });
    return response.data;
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
