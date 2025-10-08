import React, { createContext, useState, useContext } from 'react';

const BookContext = createContext();

export const useBook = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBook must be used within a BookProvider');
  }
  return context;
};

export const BookProvider = ({ children }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    sort: 'title',
    order: 'asc'
  });

  const value = {
    selectedBook,
    setSelectedBook,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};