import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  } // Check if user is authenticated
  if (!currentUser || !currentUser.userId) {
    console.log("User not authenticated, redirecting to login.");
    // Remove any stale auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page with return URL
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: "Vui lòng đăng nhập để tiếp tục",
        }}
        replace
      />
    );
  }

  if (allowedRoles.length === 0 || allowedRoles.includes(currentUser.role)) {
    return children;
  }

  return <Navigate to="/unauthorized" replace />;
};

export default PrivateRoute;
