import api from './api';

export const bookService = {
  // Get all books with filters
  getBooks: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        // Encode setiap value
        const value = typeof params[key] === 'string' 
          ? params[key].trim() 
          : params[key];
        queryParams.append(key, value);
      }
    });

    return api.get(`/books?${queryParams.toString()}`);
  },

  // Get single book
  getBook: (id) => {
    // Validasi ID
    if (!id || isNaN(parseInt(id))) {
      return Promise.reject(new Error('Invalid book ID'));
    }
    return api.get(`/books/${id}`);
  },

  // Create book (admin only)
  createBook: (bookData) => api.post('/books', bookData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),

  // Update book (admin only)
  updateBook: (id, bookData) => {
    if (!id || isNaN(parseInt(id))) {
      return Promise.reject(new Error('Invalid book ID'));
    }
    return api.put(`/books/${id}`, bookData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Delete book (admin only)
  deleteBook: (id) => {
    if (!id || isNaN(parseInt(id))) {
      return Promise.reject(new Error('Invalid book ID'));
    }
    return api.delete(`/books/${id}`);
  },

  // Get categories
  getCategories: () => api.get('/books/categories'),

  // Get featured books
  getFeaturedBooks: () => api.get('/books/featured'),

  // Get popular books
  getPopularBooks: () => api.get('/books/popular'),

  // Save book to user's list
  saveBook: (bookId) => {
    if (!bookId || isNaN(parseInt(bookId))) {
      return Promise.reject(new Error('Invalid book ID'));
    }
    return api.post('/saved-books', { book_id: bookId });
  },

  // Get saved books
  getSavedBooks: () => api.get('/user/saved-books'),

  // Remove saved book
  removeSavedBook: (id) => {
    if (!id || isNaN(parseInt(id))) {
      return Promise.reject(new Error('Invalid saved book ID'));
    }
    return api.delete(`/saved-books/${id}`);
  }
};