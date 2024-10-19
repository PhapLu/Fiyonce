import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userInfo } = useAuth();
  const { userId } = useParams();
  if (!userInfo) {
    // Redirect to login if not authenticated
    //     return <Navigate to="/explore" />;
    return;
  }

  if (allowedRoles && allowedRoles.includes("all-exclude-guest")) {
    if (!userInfo) {
      return <Navigate to="/" />;
    } else {
      return children;
    }
  }

  if (allowedRoles && allowedRoles.includes("all")) {
    return children;
  }

  if (userInfo && userId && userInfo._id !== userId) {
    // If the userInfo is trying to access someone else's data, show a forbidden message or redirect
    return <Navigate to="/forbidden" />;
  }

  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    // Redirect to home or unauthorized page if the user doesn't have the correct role
    return <Navigate to="/forbidden" />;
  }

  return children;
};

export default ProtectedRoute;