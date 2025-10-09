import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Safe URL parameter encoding
const safeEncodeParams = (params) => {
  if (!params) return {};
  
  const safeParams = {};
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      safeParams[key] = typeof value === 'string' ? value.trim() : value;
    }
  });
  
  return safeParams;
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Handle URL parameters safely
    if (config.params) {
      config.params = safeEncodeParams(config.params);
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;