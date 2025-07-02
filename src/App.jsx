import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
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
import SmokingStatusPage from "./pages/user/SmokingStatusPage";
import UserQuitPlanPage from "./pages/user/UserQuitPlanPage";

// Coach Pages
import CoachLayout from "./components/layouts/coach/CoachLayout";
import CoachQuitPlan from "./pages/coach/CoachDashBoard";
import RequestQuitPlan from "./pages/coach/RequestQuitPlanPage";
import StagesCoach from "./pages/coach/StagesCoachPage";
import CoachProfilePage from "./pages/coach/CoachProfilePage";

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

const CoachRoute = ({ element }) => (
  <PrivateRoute allowedRoles={["coach"]}>{element}</PrivateRoute>
);

function App() {
  return (
    <HelmetProvider>
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
              path="/admin/dashboard"
              element={<AdminRoute element={<DashboardAdmin />} />}
            />
            <Route
              path="/admin/dashboard/user-management"
              element={<AdminRoute element={<UserManagement />} />}
            />
            <Route
              path="/admin/dashboard/badge-management"
              element={<AdminRoute element={<BadgeManagement />} />}
            />
            <Route
              path="/admin/dashboard/feedback-management"
              element={<AdminRoute element={<FeedbackManagement />} />}
            />
            <Route
              path="/admin/profile"
              element={<AdminRoute element={<ProfilePage />} />}
            />

            {/* User Routes */}
            <Route path="/user" element={<UserLayout />}>
              <Route
                path="dashboard"
                element={<UserRoute element={<UserDashboard />} />}
              />
              <Route
                path="progress"
                element={<UserRoute element={<UserProgress />} />}
              />
              <Route
                path="achievements"
                element={<UserRoute element={<UserAchievement />} />}
              />
              <Route
                path="support"
                element={<UserRoute element={<UserSupport />} />}
              />
              <Route
                path="profile/:id"
                element={<UserRoute element={<UserProfilePage />} />}
              />
              <Route
                path="blog"
                element={<UserRoute element={<UserBlogPage />} />}
              />
              <Route
                path="smoking-status"
                element={<UserRoute element={<SmokingStatusPage />} />}
              />
              <Route
                path="quitplan"
                element={<UserRoute element={<UserQuitPlanPage />} />}
              />
            </Route>

            {/* Coach Routes */}
            <Route path="/coach" element={<CoachLayout />}>
              <Route
                path="dashboard"
                element={<CoachRoute element={<CoachQuitPlan />} />}
              />
              <Route
                path="quit-plans-request"
                element={<CoachRoute element={<RequestQuitPlan />} />}
              />
              <Route
                path="stages"
                element={<CoachRoute element={<StagesCoach />} />}
              />
              <Route
                path="profile"
                element={<CoachRoute element={<CoachProfilePage />} />}
              />
            </Route>

            {/* Error pages */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
