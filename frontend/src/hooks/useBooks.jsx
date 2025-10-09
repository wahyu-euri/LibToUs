import { useState, useEffect } from 'react';
import { bookService } from '../services/books';

export const useBooks = (initialFilters = {}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const fetchBooks = async (page = 1, newFilters = filters) => {
    setLoading(true);
    setError(null);

    try {
      // Clean filters - hapus nilai kosong
      const cleanFilters = {};
      Object.keys(newFilters).forEach(key => {
        if (newFilters[key] !== null && newFilters[key] !== undefined && newFilters[key] !== '') {
          cleanFilters[key] = newFilters[key];
        }
      });

      const response = await bookService.getBooks({
        page,
        ...cleanFilters
      });

      const booksData = response.data.data || response.data;
      setBooks(Array.isArray(booksData) ? booksData : []);
      
      setPagination({
        currentPage: response.data.current_page || page,
        totalPages: response.data.last_page || 1,
        totalItems: response.data.total || (Array.isArray(booksData) ? booksData.length : 0)
      });
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.response?.data?.message || 'Failed to fetch books');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const updateFilters = (newFilters) => {
    const cleanFilters = {};
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key] !== null && newFilters[key] !== undefined && newFilters[key] !== '') {
        cleanFilters[key] = newFilters[key];
      }
    });
    
    setFilters(cleanFilters);
    fetchBooks(1, cleanFilters);
  };

  const changePage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchBooks(page, filters);
    }
  };

  const refreshBooks = () => {
    fetchBooks(pagination.currentPage, filters);
  };

  return {
    books,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    changePage,
    refreshBooks,
    setBooks
  };
};