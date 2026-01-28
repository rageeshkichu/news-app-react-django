import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getIsSuperuser } from '../utils/tokenStorage';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  const authenticated = isAuthenticated();
  const isSuperuser = getIsSuperuser();

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isSuperuser) {
    return <Navigate to="/user-home" replace />;
  }

  return children;
};

export default ProtectedRoute;
