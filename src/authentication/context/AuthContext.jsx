import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    
    // Check for default credentials FIRST (instant login for development/testing)
    if (email === 'ifra@gmail.com' && password === 'Ifra@123') {
      console.log('Using default login bypass');
      const mockUser = {
        id: 1,
        name: 'Admin User',
        email: 'ifra@gmail.com',
        role: 'admin'
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      setUser(mockUser);
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setLoading(false);
      return { user: mockUser, token: mockToken };
    }

    try {
      // Try to login via API
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

  const logout = () => {
    setUser(null);
    apiService.auth.logout();
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
    <AuthContext.Provider value={{ user, loading, login, register, logout, getProfile }}>
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
