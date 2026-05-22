import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../authentication/context/AuthContext';

const ProtectedRoute = ({ children, fallback = null, roles = [], permissions = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--bg-main)'
      }}>
        <div className="loader" style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid var(--primary-light)', 
          borderBottomColor: 'var(--primary)', 
          borderRadius: '50%', 
          animation: 'rotate 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (!user) {
    // If fallback is provided, render it; otherwise redirect to login
    if (fallback) {
      return fallback;
    }
    // Redirect to login but save the current location they were trying to go to
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const userRoles = user.roles?.length ? user.roles : [user.role];
  const roleAllowed = roles.length === 0 || roles.some((role) => userRoles.includes(role));
  const permissionAllowed = permissions.length === 0 || permissions.every((permission) => user.permissions?.includes(permission));

  if (!roleAllowed || !permissionAllowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
