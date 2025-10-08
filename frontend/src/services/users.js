import api from './api';

export const userService = {
  // Get all users (admin only)
  getUsers: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });

    return api.get(`/admin/users?${queryParams.toString()}`);
  },

  // Update user (admin only)
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),

  // Delete user (admin only)
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Update profile
  updateProfile: (userData) => api.put('/user/profile', userData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),

  // Change password
  changePassword: (passwordData) => api.put('/user/password', passwordData)
};