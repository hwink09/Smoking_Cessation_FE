import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Layouts
import { Navbar } from "./components/layouts/Navbar";
import { Footer } from "./components/layouts/Footer";
import UserLayout from "./components/layouts/user/UserLayout";

// Pages
import HomePages from "./pages/generic/home/HomePages";
import Login from "./pages/auth/LoginPage";
import Register from "./pages/auth/RegisterPage";
import ForgotPassword from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyPage from "./pages/auth/VerifyPage";
import NotFoundPage from "./pages/error/404Page";

// Admin Pages
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import UserManagement from "./pages/admin/UserManagement";
import BadgeManagement from "./pages/admin/BadgeManagement";
import FeedbackManagement from "./pages/admin/FeedbackManagement";
import ProfilePage from "./pages/admin/ProfilePage";

// User Pages
import UserDashboard from "./pages/user/UserDashBoard";
import UserProgress from "./pages/user/UserProgress";
import UserAchievement from "./pages/user/UserAchievement";
import UserSupport from "./pages/user/UserSupport";

// PrivateRoute component
import PrivateRoute from "./PrivateRouter";

// Layout Wrapper for common UI elements
const Layout = ({ children }) => (
  <div className="min-h-screen bg-black text-white mt-20">
    <Navbar />
    <main>{children}</main>
    <Footer />
  </div>
);

// Routes Component for Admin and User Routes
const ProtectedRoute = ({ element }) => (
  <PrivateRoute>{element}</PrivateRoute>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/:token" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="/resset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/verify" element={<VerifyPage />} />

          {/* Layout Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePages />} />
          </Route>

          {/* Admin Routes (protected) */}
          <Route element={<ProtectedRoute element={<DashboardAdmin />} />} path="/admin/dashboard" />
          <Route element={<ProtectedRoute element={<UserManagement />} />} path="/admin/dashboard/user-management" />
          <Route element={<ProtectedRoute element={<BadgeManagement />} />} path="/admin/dashboard/badge-management" />
          <Route element={<ProtectedRoute element={<FeedbackManagement />} />} path="/admin/dashboard/feedback-management" />
          <Route element={<ProtectedRoute element={<ProfilePage />} />} path="/admin/profile" />

          {/* User Routes (protected) */}
          <Route element={<UserLayout />}>
            <Route element={<ProtectedRoute element={<UserDashboard />} />} path="user/dashboard" />
            <Route element={<ProtectedRoute element={<UserProgress />} />} path="user/progress" />
            <Route element={<ProtectedRoute element={<UserAchievement />} />} path="user/achievements" />
            <Route element={<ProtectedRoute element={<UserSupport />} />} path="user/support" />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
