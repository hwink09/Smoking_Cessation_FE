import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import AuthProvider from "./contexts/AuthProvider";

// Layouts
import { Navbar } from "./components/layouts/Navbar";
import { Footer } from "./components/layouts/Footer";
import UserLayout from "./components/layouts/user/UserLayout";
import UserHeader from "./components/layouts/user/UserHeader";

// Pages
import HomePages from "./pages/generic/home/HomePages";
import Login from "./pages/auth/LoginPage";
import Register from "./pages/auth/RegisterPage";
import ForgotPassword from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import CommunityPage from "./pages/generic/community/CommunityPage";
import RankingPage from "./pages/generic/ranking/RankingPage";
import PremiumPage from "./pages/generic/premium/PremiumPage";
import VerifyPage from "./pages/auth/VerifyPage";
import NotFoundPage from "./pages/error/404Page";
import UnauthorizedPage from "./pages/error/UnauthorizedPage";
import BlogPage from "./pages/generic/BlogPage";
import QuitPlanPage from "./pages/generic/QuitPlanPage";
import QuitPlanDetailPage from "./pages/generic/QuitPlanDetailPage";

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
import UserProfilePage from "./pages/user/UserProfilePage";
import UserBlogPage from "./pages/user/UserBlogPage";

// PrivateRoute component
import PrivateRoute from "./PrivateRouter";
import { useAuth } from "./hooks/useAuth";

// Layout Wrapper
const Layout = () => {
  const { currentUser } = useAuth();
  return (
    <div className="min-h-screen bg-black text-white">
      {currentUser ? <UserHeader /> : <Navbar />}
      <main className="mt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const AdminRoute = ({ element }) => (
  <PrivateRoute allowedRoles={["admin"]}>{element}</PrivateRoute>
);

const UserRoute = ({ element }) => (
  <PrivateRoute allowedRoles={["user"]}>{element}</PrivateRoute>
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
          <Route path="/fogot-password" element={<ForgotPassword />} />
          <Route
            path="/resset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route path="/verify" element={<VerifyPage />} />

          {/* Layout Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePages />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/quit-plan" element={<QuitPlanPage />} />
            <Route
              path="/quit-plan-detail/:id"
              element={<QuitPlanDetailPage />}
            />
          </Route>

          {/* Admin Routes */}
          <Route
            element={<AdminRoute element={<DashboardAdmin />} />}
            path="/admin/dashboard"
          />
          <Route
            element={<AdminRoute element={<UserManagement />} />}
            path="/admin/dashboard/user-management"
          />
          <Route
            element={<AdminRoute element={<BadgeManagement />} />}
            path="/admin/dashboard/badge-management"
          />
          <Route
            element={<AdminRoute element={<FeedbackManagement />} />}
            path="/admin/dashboard/feedback-management"
          />
          <Route
            element={<AdminRoute element={<ProfilePage />} />}
            path="/admin/profile"
          />

          {/* User Routes */}
          <Route element={<UserLayout />}>
            <Route
              element={<UserRoute element={<UserDashboard />} />}
              path="user/dashboard"
            />
            <Route
              element={<UserRoute element={<UserProgress />} />}
              path="user/progress"
            />
            <Route
              element={<UserRoute element={<UserAchievement />} />}
              path="user/achievements"
            />
            <Route
              element={<UserRoute element={<UserSupport />} />}
              path="user/support"
            />
            <Route
              path="user/profile/:id"
              element={<UserRoute element={<UserProfilePage />} />}
            />
            <Route
              path="user/blog"
              element={<UserRoute element={<UserBlogPage />} />}
            />
          </Route>

          {/* Error pages */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
