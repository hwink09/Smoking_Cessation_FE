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
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import UserManagement from "./pages/admin/UserManagement";
import BadgeManagement from "./pages/admin/BadgeManagement";
import NotFoundPage from "./pages/error/404Page";
import DashBoardUser from "./pages/user/DashBoardUser";

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

// ===== App with Routing =====
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* <ScrollToTop /> */}
        <Routes>
          {/*  Route useuse layout */}
          <Route path="/login" element={<Login />} />
          {/* Route Login with token after register */}
          <Route path="/login/:token" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />

          {/*  Route not useuse layout */}
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
          {/* User routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route path="dashboard" element={<DashBoardUser />} />
          </Route>
          {/* 404  */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
