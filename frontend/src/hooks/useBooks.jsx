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
      const response = await bookService.getBooks({
        page,
        ...newFilters
      });

      setBooks(response.data.data || response.data);
      setPagination({
        currentPage: response.data.current_page || page,
        totalPages: response.data.last_page || 1,
        totalItems: response.data.total || response.data.length
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    fetchBooks(1, newFilters);
  };

  const changePage = (page) => {
    fetchBooks(page, filters);
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