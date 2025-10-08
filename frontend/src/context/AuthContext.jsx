import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useLocalStorage('token', null);

  useEffect(() => {
    if (token) {
      authService.getUser()
        .then(response => {
          setUser({
            ...response.data,
            isAdmin: response.data.role === 'admin'
          });
        })
        .catch(() => {
          setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token, setToken]);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { user, access_token } = response.data;
      setUser({
        ...user,
        isAdmin: user.role === 'admin'
      });
      setToken(access_token);
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { user, access_token } = response.data;
      setUser({
        ...user,
        isAdmin: user.role === 'admin'
      });
      setToken(access_token);
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.errors || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser({
      ...updatedUser,
      isAdmin: updatedUser.role === 'admin'
    });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};