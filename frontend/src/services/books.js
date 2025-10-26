import api from './api';

export const bookService = {
  // Get all books
  getBooks: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key]) queryParams.append(key, params[key]);
    });
    return api.get(`/books?${queryParams.toString()}`);
  },

  // Get single book
  getBook: (id) => {
    if (!id || isNaN(parseInt(id))) return Promise.reject(new Error('Invalid book ID'));
    return api.get(`/books/${id}`);
  },

  // ✅ Create book (multipart)
  createBook: (bookData) => {
    const formData = new FormData();
    Object.keys(bookData).forEach((key) => {
      formData.append(key, bookData[key]);
    });
    return api.post('/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // ✅ Update book (multipart)
  updateBook: (id, bookData) => {
    if (!id || isNaN(parseInt(id))) return Promise.reject(new Error('Invalid book ID'));
    const formData = new FormData();
    Object.keys(bookData).forEach((key) => {
      formData.append(key, bookData[key]);
    });
    return api.post(`/books/${id}?_method=PUT`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Delete book
  deleteBook: (id) => api.delete(`/books/${id}`),

  // Get categories, featured, popular
  getCategories: () => api.get('/books/categories'),
  getFeaturedBooks: () => api.get('/books/featured'),
  getPopularBooks: () => api.get('/books/popular'),

  // Save/unsave books
  saveBook: (bookId) => api.post('/saved-books', { book_id: bookId }),
  getSavedBooks: () => api.get('/user/saved-books'),
  removeSavedBook: (id) => api.delete(`/saved-books/${id}`)
};
