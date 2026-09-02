import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('disaster_auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('disaster_auth_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.data?.success && res.data.data) {
            setUser(res.data.data);
            localStorage.setItem('disaster_auth_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.error("Session verification failed:", err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.data?.success && res.data.data) {
      const { token: jwtToken, user: userData } = res.data.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('disaster_auth_token', jwtToken);
      localStorage.setItem('disaster_auth_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await authApi.register(formData);
    if (res.data?.success && res.data.data) {
      const { token: jwtToken, user: userData } = res.data.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('disaster_auth_token', jwtToken);
      localStorage.setItem('disaster_auth_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('disaster_auth_token');
    localStorage.removeItem('disaster_auth_user');
  };

  const updateUserProfile = async (updateData) => {
    const res = await authApi.updateProfile(updateData);
    if (res.data?.success && res.data.data) {
      const updatedUser = res.data.data;
      setUser(updatedUser);
      localStorage.setItem('disaster_auth_user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    throw new Error(res.data?.message || 'Profile update failed');
  };

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUserProfile, isAdmin }}>
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
