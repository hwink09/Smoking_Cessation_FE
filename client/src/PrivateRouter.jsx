import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user || !user.id) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
