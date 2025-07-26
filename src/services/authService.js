import api from "./api";
import { jwtDecode } from "jwt-decode";

// Lưu thông tin xác thực
function storeAuthData(data) {
  const token = data.token || data.user?.token;
  if (token) localStorage.setItem("token", token);

  if (data.user) {
    const userToStore = {
      userId: data.user.userId || data.user.id || data.user._id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
      avatar_url: data.user.avatar_url,
    };
    if (userToStore.userId) {
      localStorage.setItem("user", JSON.stringify(userToStore));
    }
  }
}

// Xoá thông tin xác thực
function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
}

const authService = {
  async login(credentials) {
    try {
      const { data } = await api.post("/auth/login", credentials);
      const token = data.token || data.user?.token;

      if (!token) throw new Error("Đăng nhập thành công nhưng thiếu token.");

      storeAuthData(data);

      if (!data.user?.userId && token) {
        try {
          const decoded = jwtDecode(token);
          const userId = decoded.id || decoded.userId || decoded.sub;

          if (userId) {
            const userFromToken = {
              userId,
              email: decoded.email || credentials.email,
              name: decoded.name,
              role: decoded.role || "user",
              avatar_url: decoded.avatar_url || decoded.picture,
              token,
            };
            localStorage.setItem("user", JSON.stringify(userFromToken));
            data.user = userFromToken;
          }
        } catch {
          console.error("Không thể giải mã token để lấy thông tin người dùng.");
        }
      }

      return data;
    } catch (error) {
      throw new Error("Lỗi đăng nhập: " + (error?.message || "Không xác định"));
    }
  },

  async loginWithGoogle(credential) {
    if (!credential) throw new Error("Thông tin Google không hợp lệ.");
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await api.post(
        "/auth/google",
        { credential },
        { headers, timeout: 10000 }
      );
      storeAuthData(data);
      return data;
    } catch (error) {
      const res = error.response;
      if (res?.status === 403) {
        const origin = res.headers?.["x-permitted-origin"];
        const originMsg = origin
          ? ` Origin mismatch: ${origin} <> ${window.location.origin}`
          : "";
        throw new Error(`Máy chủ từ chối quyền truy cập (403).${originMsg}`);
      }
      if (res?.status === 401) {
        throw new Error(
          "Xác thực Google thất bại (401): Token không hợp lệ hoặc đã hết hạn."
        );
      }
      if (res?.status >= 500) {
        throw new Error("Lỗi máy chủ, vui lòng thử lại sau.");
      }
      throw new Error("Đăng nhập Google thất bại.");
    }
  },

  async register(userData) {
    try {
      const { data } = await api.post("/auth/register", userData);
      return data;
    } catch (error) {
      throw new Error("Lỗi đăng ký: " + (error?.message || "Không xác định"));
    }
  },

  async forgotPassword(email) {
    try {
      const { data } = await api.post("/auth/fogot-password", { email });
      return data;
    } catch (error) {
      throw new Error(
        "Lỗi quên mật khẩu: " + (error?.message || "Không xác định")
      );
    }
  },

  async resetPassword(token, newPassword) {
    try {
      const { data } = await api.post(`/auth/resset-password/${token}`, {
        newPassword,
      });
      return data;
    } catch (error) {
      throw new Error(
        "Lỗi đặt lại mật khẩu: " + (error?.message || "Không xác định")
      );
    }
  },

  async resendVerification(email) {
    try {
      const { data } = await api.post("/auth/resend-verification", { email });
      return data;
    } catch (error) {
      throw new Error(
        "Lỗi gửi lại xác minh: " + (error?.message || "Không xác định")
      );
    }
  },

  verifyEmail: (() => {
    const verifiedTokens = new Set();
    return async (token) => {
      if (verifiedTokens.has(token))
        return { message: "Email đã được xác minh trước đó." };
      try {
        const { data } = await api.get(`/auth/verify/${token}`);
        verifiedTokens.add(token);
        return data;
      } catch (error) {
        throw new Error(
          "Lỗi xác minh email: " + (error?.message || "Không xác định")
        );
      }
    };
  })(),

  logout() {
    clearAuthData();
    return true;
  },

  getCurrentUser() {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (storedUser?.userId) return storedUser;

      const token = localStorage.getItem("token");
      if (!token) return null;

      const decoded = jwtDecode(token);
      const userId = decoded.id || decoded.userId || decoded.sub;

      if (!userId) return null;

      const user = {
        userId,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        avatar_url: decoded.avatar_url || decoded.picture,
      };

      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch {
      return null;
    }
  },
};

export default authService;
