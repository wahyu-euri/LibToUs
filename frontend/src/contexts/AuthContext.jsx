import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message || 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login error';
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message || 'Register failed' };
    } catch (error) {
      const message = error.response?.data?.errors || error.response?.data?.message || error.message || 'Registration error';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // ignore server errors, still clear local
      console.warn('Logout error (ignored):', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);