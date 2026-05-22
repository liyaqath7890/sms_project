import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        apiService.auth.getProfile()
          .then((response) => {
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
          })
          .catch(() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
          })
          .finally(() => setLoading(false));
        return;
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiService.auth.login({ email, password });
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await apiService.auth.register(userData);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await apiService.auth.logout();
  };

  const hasRole = (...roles) => {
    const userRoles = user?.roles?.length ? user.roles : [user?.role];
    return roles.some((role) => userRoles.includes(role));
  };

  const hasPermission = (...permissions) => {
    const userPermissions = user?.permissions || [];
    return permissions.every((permission) => userPermissions.includes(permission));
  };

  const getProfile = async () => {
    try {
      const response = await apiService.auth.getProfile();
      setUser(response.user);
      return response;
    } catch (error) {
      // If profile fetch fails, logout
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, getProfile, hasRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
