import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  // We standardized this key in the new Login.jsx
  const token = localStorage.getItem("ACCESS_TOKEN");
  const userRole = localStorage.getItem("role"); 

  console.log("Auth Guard Check - Role:", userRole, "Token Exists:", !!token);

  if (!token) {
    // No token? Back to login.
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Token exists but role doesn't match? Go to unauthorized.
    console.warn(`Access Denied: ${userRole} is not in`, allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  // Everything is fine, render the page.
  return children;
};

export default ProtectedRoute;