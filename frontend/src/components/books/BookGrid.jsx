import React from 'react';
import BookCard from './BookCard';
import LoadingSpinner from '../common/LoadingSpinner';


const BookGrid = ({ books, loading = false, className = '' }) => {
  if (loading) {
    return <LoadingSpinner text="Loading books..." />;
  }

  if (!books || books.length === 0) {
    return (
      <div className="no-books">
        <p>No books found.</p>
      </div>
    );
  }

  return (
    <div className={`book-grid ${className}`}>
      {books.map(book => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookGrid;