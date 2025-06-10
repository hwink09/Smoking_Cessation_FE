import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Outlet } from "react-router-dom";

// Layout
import { Navbar } from "./components/layouts/Navbar";
import { Footer } from "./components/layouts/Footer";
import UserLayout from "./components/layouts/user/UserLayout";

// Auth Context
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import HomePages from "./pages/generic/home/HomePages";
import Login from "./pages/auth/LoginPage";
import Register from "./pages/auth/RegisterPage";
import ForgotPassword from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import UserManagement from "./pages/admin/UserManagement";
import BadgeManagement from "./pages/admin/BadgeManagement";
import NotFoundPage from "./pages/error/404Page";
import DashBoardUser from "./pages/user/UserDashBoard";
import FeedbackManagement from "./pages/admin/FeedbackManagement";
import UserProgress from "./pages/user/UserProgress";
import VerifyPage from "./pages/auth/VerifyPage";

// ===== Layout Wrapper =====
const Layout = () => (
  <div className="min-h-screen bg-black text-white mt-20">
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

// ===== App with Routing ====
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* <ScrollToTop /> */}
        <Routes>
          {/*  Route not use layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/:token" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route
            path="/resset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route path="/verify" element={<VerifyPage />} />

          {/*  Route use layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePages />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route
            path="/admin/dashboard/user-management"
            element={<UserManagement />}
          />
          <Route
            path="/admin/dashboard/badge-management"
            element={<BadgeManagement />}
          />
          <Route
            path="/admin/dashboard/feedback-management"
            element={<FeedbackManagement />}
          />

          {/* User routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route path="dashboard" element={<DashBoardUser />} />
            <Route path="progress" element={<UserProgress />} />
          </Route>

          {/* 404  */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
