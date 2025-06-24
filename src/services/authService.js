import api from "./api";
import { jwtDecode } from "jwt-decode";

// Helper: Lưu thông tin xác thực
function storeAuthData(data) {
  // Store token
  if (data.token) {
    localStorage.setItem("token", data.token);
  } else if (data.user?.token) {
    localStorage.setItem("token", data.user.token);
  }

  // Store user data
  if (data.user) {
    // Make sure user object has the required fields
    const userToStore = {
      userId: data.user.userId || data.user.id || data.user._id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
      avatar_url: data.user.avatar_url,
    };

    // Verify we have the minimal required data
    if (!userToStore.userId) {
      console.error("Missing userId in user object:", data.user);
    }

    localStorage.setItem("user", JSON.stringify(userToStore));
    console.log("User data stored successfully:", userToStore);
  } else {
    console.error("No user data available to store");
  }
}

// Helper: Xóa toàn bộ thông tin xác thực
function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Xóa cookie nếu có
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
}

const authService = {
  /**
   * POST /api/auth/login
   */ async login(credentials) {
    try {
      const { data } = await api.post("/auth/login", credentials);

      // Debug the response to understand what's coming from the server
      console.log("Login API response:", data);

      // Check if we have at least a token
      if (!data.token && !data.user?.token) {
        console.error("Login response missing token:", data);
        throw new Error("Đăng nhập thành công nhưng thiếu token.");
      }

      // Store whatever data we have first (token is important)
      storeAuthData(data);

      // Enhanced login response handling
      if (!data.user || !data.user.userId) {
        console.warn(
          "Login response missing user data, attempting recovery:",
          data
        );

        try {
          // Try to construct a user object from token
          if (data.token) {
            const token = data.token;
            localStorage.setItem("token", token);

            // Get existing user if available
            let storedUser;
            try {
              storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            } catch (e) {
              storedUser = {};
            }

            // Try to decode token
            try {
              const decoded = jwtDecode(token);
              console.log("Token decoded successfully:", decoded);

              // Create user object from token
              const userId = decoded.id || decoded.userId || decoded.sub;

              if (userId) {
                const userFromToken = {
                  userId,
                  email: decoded.email || storedUser.email || credentials.email,
                  name: decoded.name || storedUser.name,
                  role: decoded.role || storedUser.role || "user",
                  avatar_url:
                    decoded.avatar_url ||
                    decoded.picture ||
                    storedUser.avatar_url,
                  token: token,
                };

                console.log("Created user from token:", userFromToken);

                // Store the constructed user
                localStorage.setItem("user", JSON.stringify(userFromToken));

                // Update the response data
                data.user = userFromToken;
                console.log(
                  "Updated login response with user from token:",
                  data
                );
              }
            } catch (decodeError) {
              console.error("Failed to decode token:", decodeError);
            }
          }
        } catch (recoveryError) {
          console.error("Failed to recover user data:", recoveryError);
        }
      }

      return data;
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      throw error;
    }
  },

  /**
   * POST /api/auth/google
   */
  async loginWithGoogle(credential) {
    if (!credential) throw new Error("Thông tin Google không hợp lệ.");

    try {
      const headers = {};
      const token = localStorage.getItem("token");
      if (token) headers.Authorization = `Bearer ${token}`;

      const { data } = await api.post(
        "/auth/google",
        { credential },
        { headers, timeout: 10000 }
      );

      storeAuthData(data);
      return data;
    } catch (error) {
      const { response } = error;
      if (response) {
        if (response.status === 403) {
          const originError = response.headers?.["x-permitted-origin"]
            ? ` Origin mismatch: ${response.headers["x-permitted-origin"]} <> ${window.location.origin}`
            : "";
          throw new Error(
            `Máy chủ từ chối quyền truy cập (403).${originError}`
          );
        }
        if (response.status === 401) {
          throw new Error(
            "Xác thực Google thất bại (401): Token không hợp lệ hoặc đã hết hạn."
          );
        }
        if (response.status >= 500) {
          throw new Error("Lỗi máy chủ, vui lòng thử lại sau.");
        }
      }
      throw error.message || new Error("Đăng nhập Google thất bại.");
    }
  },

  /**
   * POST /api/auth/register
   */
  async register(userData) {
    try {
      const { data } = await api.post("/auth/register", userData);
      return data;
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      throw error;
    }
  },

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(email) {
    try {
      const { data } = await api.post("/auth/fogot-password", { email });
      return data;
    } catch (error) {
      console.error("Lỗi quên mật khẩu:", error);
      throw error;
    }
  },

  /**
   * POST /api/auth/reset-password/{token}
   */
  async resetPassword(token, newPassword) {
    try {
      const { data } = await api.post(`/auth/resset-password/${token}`, {
        newPassword,
      });
      return data;
    } catch (error) {
      console.error("Lỗi đặt lại mật khẩu:", error);
      throw error;
    }
  },

  /**
   * POST /api/auth/resend-verification
   */
  async resendVerification(email) {
    try {
      const { data } = await api.post("/auth/resend-verification", { email });
      return data;
    } catch (error) {
      console.error("Lỗi gửi lại xác minh:", error);
      throw error;
    }
  },

  /**
   * GET /api/auth/verify/:token
   * Đảm bảo không verify lại cùng token nhiều lần.
   */
  verifyEmail: (() => {
    const verifiedTokens = new Set();
    return async (token) => {
      if (verifiedTokens.has(token)) {
        return { message: "Email đã được xác minh trước đó." };
      }
      try {
        const { data } = await api.get(`/auth/verify/${token}`);
        verifiedTokens.add(token);
        return data;
      } catch (error) {
        console.error("Lỗi xác minh email:", error);
        throw error;
      }
    };
  })(),

  /**
   * Xoá token, user & cookies
   */
  logout() {
    try {
      clearAuthData();
      return true;
    } catch (error) {
      console.error("Lỗi khi logout:", error);
      throw error;
    }
  },

  /**
   * Trích xuất user hiện tại từ token & localStorage
   */
  getCurrentUser() {
    try {
      // First check if we have a stored user object
      const storedUserJson = localStorage.getItem("user");
      if (storedUserJson) {
        const storedUser = JSON.parse(storedUserJson);
        // If we have a complete user object with userId, return it
        if (storedUser && storedUser.userId) {
          console.log("Using stored user:", storedUser);
          return storedUser;
        }
      }

      // If no complete user in localStorage, try to get from token
      const token = localStorage.getItem("token");
      if (!token) {
        return null;
      }

      try {
        const decoded = jwtDecode(token);
        console.log("Token decoded:", decoded);

        // Try to get stored user again as a fallback for missing fields
        const storedUser = storedUserJson ? JSON.parse(storedUserJson) : {};

        // Get userId from various possible properties
        const userId =
          decoded.id || decoded.userId || decoded.sub || storedUser.userId;

        if (!userId) {
          console.error("No userId found in token or stored user");
          return null;
        }

        // Construct user object from token and fallbacks
        const user = {
          userId,
          name: decoded.name || storedUser.name,
          email: decoded.email || storedUser.email,
          role: decoded.role || storedUser.role,
          avatar_url:
            decoded.avatar_url || decoded.avatarUrl || storedUser.avatar_url,
        };

        // Make sure we have required fields
        if (!user.email || !user.name || !user.role) {
          console.warn("Incomplete user data from token:", user);
        }

        // Update stored user with more complete info if needed
        localStorage.setItem("user", JSON.stringify(user));

        return user;
      } catch (tokenError) {
        console.error("Error decoding token:", tokenError);
        // If token decode fails, try stored user again
        return storedUserJson ? JSON.parse(storedUserJson) : null;
      }
    } catch (err) {
      console.error("Error in getCurrentUser:", err);
      return null;
    }
  },
};

export default authService;
