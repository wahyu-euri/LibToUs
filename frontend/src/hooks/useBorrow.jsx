import { useState, useEffect } from 'react';
import { borrowService } from '../services/borrows';

export const useBorrows = (initialStatus = 'all') => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(initialStatus);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const fetchBorrows = async (page = 1, borrowStatus = status) => {
    setLoading(true);
    setError(null);

    try {
      const response = await borrowService.getUserBorrows(borrowStatus);
      setBorrows(response.data.data || response.data);
      setPagination({
        currentPage: response.data.current_page || page,
        totalPages: response.data.last_page || 1,
        totalItems: response.data.total || response.data.length
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch borrows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  const updateStatus = (newStatus) => {
    setStatus(newStatus);
    fetchBorrows(1, newStatus);
  };

  const changePage = (page) => {
    fetchBorrows(page, status);
  };

  const refreshBorrows = () => {
    fetchBorrows(pagination.currentPage, status);
  };

  const borrowBook = async (borrowData) => {
    try {
      const response = await borrowService.borrowBook(borrowData);
      refreshBorrows();
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to borrow book' 
      };
    }
  };

  const returnBook = async (borrowId) => {
    try {
      await borrowService.returnBook(borrowId);
      refreshBorrows();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to return book' 
      };
    }
  };

  return {
    borrows,
    loading,
    error,
    status,
    pagination,
    updateStatus,
    changePage,
    refreshBorrows,
    borrowBook,
    returnBook
  };
};