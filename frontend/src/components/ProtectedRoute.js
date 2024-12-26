import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // Check if the user's role is in the list of allowed roles
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />; // Redirect to Unauthorized page
  }

  return children; // Render the children if authorized
};

export default ProtectedRoute;
