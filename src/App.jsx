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
import ResetPassword from "./pages/auth/ResetPasswordPage";
import CommunityPage from "./pages/generic/community/CommunityPage";
import PremiumPage from "./pages/generic/premium/PremiumPage";
import VerifyPage from "./pages/auth/VerifyPage";
import NotFoundPage from "./pages/error/404Page";
import UnauthorizedPage from "./pages/error/UnauthorizedPage";
import BlogPage from "./pages/generic/BlogPage";
import QuitPlanPage from "./pages/generic/QuitPlanPage";
import QuitPlanDetailPage from "./pages/generic/QuitPlanDetailPage";
import BlogDetail from "./components/generic/blog/BlogDetail";
import RankingPage from "./pages/generic/RankingPage";

// Admin Pages
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import UserManagement from "./pages/admin/UserManagement";
import BadgeManagement from "./pages/admin/BadgeManagement";
import ProfilePage from "./pages/admin/ProfilePage";
import BlogManagement from "./pages/admin/BlogManagement";
import SubscriptionsManagement from "./pages/admin/SubscriptionsManagement";
import QuitPlanManagement from "./pages/admin/QuitPlanManagement";
import ProgressManagement from "./pages/admin/ProgressManagement";
import QuitPlanDetailPageAdmin from "./components/admin/quitPlan/QuitPlansDetail";
import NotificationManagement from "./pages/admin/NotificationManagement";
import PackageManagement from "./pages/admin/PackageManagement";
import FeedbackPage from "./pages/admin/FeedbackPage";

// User Pages
import UserDashboard from "./pages/user/UserDashBoard";
import UserProgress from "./pages/user/UserProgress";
import UserAchievement from "./pages/user/UserAchievement";
import UserProfilePage from "./pages/user/UserProfilePage";
import UserBlogPage from "./pages/user/UserBlogPage";
import SmokingStatusPage from "./pages/user/SmokingStatusPage";
import UserQuitPlanPage from "./pages/user/UserQuitPlanPage";
import UserMeetSessionPage from "./pages/user/UserMeetSessionPage";

// Coach Pages
import CoachLayout from "./components/layouts/coach/CoachLayout";
import CoachProfilePage from "./pages/coach/CoachProfilePage";
import CoachProgressPage from "./pages/coach/CoachProgressPage";
import RequestQuitPlanPage from "./pages/coach/RequestQuitPlanPage";
import StagesCoachPage from "./pages/coach/StagesCoachPage";
import CoachDashBoardPage from "./pages/coach/CoachDashBoardPage";
import CoachMeetSessionPage from "./pages/coach/CoachMeetSessionPage";
import CoachFeedBackPage from "./pages/coach/CoachFeedBackPage";
import CoachNotification from "./pages/coach/CoachNotification";

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
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/:token" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/fogot-password" element={<ForgotPassword />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/resset-password/:token" element={<ResetPassword />} />
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
            path="/admin/feedback-management"
            element={<AdminRoute element={<FeedbackPage />} />}
          />
          <Route
            path="/admin/profile/:userId"
            element={<AdminRoute element={<ProfilePage />} />}
          />
          <Route
            path="/admin/blogs"
            element={<AdminRoute element={<BlogManagement />} />}
          />
          <Route
            path="/admin/notifications"
            element={<AdminRoute element={<NotificationManagement />} />}
          />
          <Route
            path="/admin/subscriptions"
            element={<AdminRoute element={<SubscriptionsManagement />} />}
          />
          <Route
            path="/admin/quit-plans"
            element={<AdminRoute element={<QuitPlanManagement />} />}
          />
          <Route
            path="/admin/quit-plans/:id"
            element={<AdminRoute element={<QuitPlanDetailPageAdmin />} />}
          />
          <Route
            path="/admin/progress"
            element={<AdminRoute element={<ProgressManagement />} />}
          />
          <Route
            path="/admin/package"
            element={<AdminRoute element={<PackageManagement />} />}
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
            <Route
              path="meet-session"
              element={<UserRoute element={<UserMeetSessionPage />} />}
            />
          </Route>

          {/* Coach Routes */}
          <Route path="/coach" element={<CoachLayout />}>
            <Route
              path="dashboard"
              element={<CoachRoute element={<CoachDashBoardPage />} />}
            />
            <Route
              path="request"
              element={<CoachRoute element={<RequestQuitPlanPage />} />}
            />
            <Route
              path="stages"
              element={<CoachRoute element={<StagesCoachPage />} />}
            />
            <Route
              path="profile"
              element={<CoachRoute element={<CoachProfilePage />} />}
            />
            <Route
              path="meet-session"
              element={<CoachRoute element={<CoachMeetSessionPage />} />}
            />
            <Route
              path="progress"
              element={<CoachRoute element={<CoachProgressPage />} />}
            />
            <Route
              path="feedback"
              element={<CoachRoute element={<CoachFeedBackPage />} />}
            />
            <Route
              path="notifications"
              element={<CoachRoute element={<CoachNotification/>} />}
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
