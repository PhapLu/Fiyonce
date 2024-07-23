import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useAuth();
  const { userId } = useParams();
  if (!userInfo) {
    return;
  }

  //   if (!userInfo) {
  //     // If the userInfo is not logged in, redirect to the login page
  //     return <Navigate to="/explore" />;
  //   }

  if (userInfo && userInfo._id !== userId) {
    // If the userInfo is trying to access someone else's data, show a forbidden message or redirect
    return <Navigate to="/forbidden" />;
  }

  return children;
};

export default ProtectedRoute;