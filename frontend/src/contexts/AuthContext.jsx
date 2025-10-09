import React, { createContext, useState, useContext, useEffect } from 'react';

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

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Simulate API call - nanti diganti dengan API real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: 1,
        username: credentials.login,
        email: `${credentials.login}@example.com`,
        role: 'user'
      };
      
      setUser(mockUser);
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { success: true, user: mockUser };
    } catch (error) {
      return { 
        success: false, 
        error: 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        role: userData.role || 'user'
      };
      
      setUser(mockUser);
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { success: true, user: mockUser };
    } catch (error) {
      return { 
        success: false, 
        error: 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};