import api from './api';

export const bookService = {
  // Get all books with filters
  getBooks: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });

    return api.get(`/books?${queryParams.toString()}`);
  },

  // Get single book
  getBook: (id) => api.get(`/books/${id}`),

  // Create book (admin only)
  createBook: (bookData) => api.post('/books', bookData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),

  // Update book (admin only)
  updateBook: (id, bookData) => api.put(`/books/${id}`, bookData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),

  // Delete book (admin only)
  deleteBook: (id) => api.delete(`/books/${id}`),

  // Get categories
  getCategories: () => api.get('/books/categories'),

  // Get featured books
  getFeaturedBooks: () => api.get('/books/featured'),

  // Get popular books
  getPopularBooks: () => api.get('/books/popular'),

  // Save book to user's list
  saveBook: (bookId) => api.post('/saved-books', { book_id: bookId }),

  // Get saved books
  getSavedBooks: () => api.get('/user/saved-books'),

  // Remove saved book
  removeSavedBook: (id) => api.delete(`/saved-books/${id}`)
};