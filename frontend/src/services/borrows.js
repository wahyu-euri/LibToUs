import api from './api';

export const borrowService = {
  // Get all borrows (admin only)
  getBorrows: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });

    return api.get(`/admin/borrows?${queryParams.toString()}`);
  },

  // Get user borrows
  getUserBorrows: (status = 'all') => api.get(`/user/borrows?status=${status}`),

  // Create borrow request
  borrowBook: (borrowData) => api.post('/borrows', borrowData),

  // Return book
  returnBook: (id) => api.post(`/borrows/${id}/return`),

  // Update borrow (admin only)
  updateBorrow: (id, borrowData) => api.put(`/admin/borrows/${id}`, borrowData)
};