import React, { useState } from 'react';
import { useBooks } from '../../hooks/useBooks';
import BookGrid from '../../components/books/BookGrid';
import BookSearch from '../../components/books/BookSearch';
import BookFilter from '../../components/books/BookFilter';
import Pagination from '../../components/common/Pagination';
import Alert from '../../components/ui/Alert';

const BookCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
  const {
    books,
    loading,
    error,
    pagination,
    updateFilters,
    changePage,
    refreshBooks
  } = useBooks({ ...filters, search: searchTerm });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    updateFilters({ ...newFilters, search: searchTerm });
  };

  const showAlert = (message, type = 'error') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  return (
    <div className="book-catalog">
      <div className="page-header">
        <h1>Book Catalog</h1>
        <p>Explore our collection of books</p>
      </div>

      {alert.show && (
        <Alert type={alert.type} message={alert.message} />
      )}

      {error && (
        <Alert type="error" message={error} />
      )}

      <div className="catalog-controls">
        <div className="search-section">
          <BookSearch onSearch={handleSearch} placeholder="Search books by title, author, or ISBN..." />
        </div>
        
        <div className="filter-section">
          <BookFilter onFilterChange={handleFilterChange} currentFilters={filters} />
        </div>
      </div>

      <div className="catalog-results">
        <div className="results-header">
          <h2>Available Books ({pagination.totalItems})</h2>
          {books.length > 0 && (
            <div className="sort-info">
              Sorted by: {filters.sort || 'title'} ({filters.order || 'asc'})
            </div>
          )}
        </div>

        <BookGrid books={books} loading={loading} />

        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={changePage}
            className="mt-4"
          />
        )}
      </div>
    </div>
  );
};

export default BookCatalog;