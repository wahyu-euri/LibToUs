import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../../hooks/useBooks';
import BookGrid from '../../components/books/BookGrid';
import BookSearch from '../../components/books/BookSearch';
import BookFilter from '../../components/books/BookFilter';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { bookService } from '../../services/books';

const AdminBooks = () => {
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

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await bookService.deleteBook(bookId);
      setAlert({
        show: true,
        message: 'Book deleted successfully',
        type: 'success'
      });
      refreshBooks();
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.message || 'Failed to delete book',
        type: 'error'
      });
    }
  };

  const showAlert = (message, type = 'error') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  return (
    <div className="admin-books">
      <div className="page-header">
        <div className="header-content">
          <h1>Manage Books</h1>
          <Link to="/admin/books/add">
            <Button variant="primary">Add New Book</Button>
          </Link>
        </div>
        <p>Manage your library's book collection</p>
      </div>

      {alert.show && (
        <Alert type={alert.type} message={alert.message} />
      )}

      {error && (
        <Alert type="error" message={error} />
      )}

      <div className="filters-section">
        <BookSearch onSearch={handleSearch} placeholder="Search books by title, author, or ISBN..." />
        <BookFilter onFilterChange={handleFilterChange} currentFilters={filters} />
      </div>

      <div className="books-section">
        <div className="section-header">
          <h2>Books ({pagination.totalItems})</h2>
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

      {books.length > 0 && (
        <div className="books-actions">
          {books.map(book => (
            <div key={book.id} className="book-item-admin">
              <div className="book-info">
                <img 
                  src={book.cover_image || '/images/default-book-cover.jpg'} 
                  alt={book.title}
                  className="book-thumbnail"
                />
                <div className="book-details">
                  <h3>{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-meta">
                    <span>ISBN: {book.isbn}</span>
                    <span>Category: {book.category}</span>
                    <span>Available: {book.available_copies}/{book.total_copies}</span>
                  </div>
                </div>
              </div>
              <div className="book-actions">
                <Link to={`/admin/books/edit/${book.id}`}>
                  <Button variant="secondary" size="small">Edit</Button>
                </Link>
                <Link to={`/book/${book.id}`}>
                  <Button variant="secondary" size="small">View</Button>
                </Link>
                <Button 
                  variant="danger" 
                  size="small"
                  onClick={() => handleDeleteBook(book.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBooks;