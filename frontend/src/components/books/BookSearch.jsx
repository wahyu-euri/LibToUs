import React, { useState } from 'react';

const BookSearch = ({ onSearch, placeholder = "Search books..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="book-search">
      <div className="search-input-group">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="search-input"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="search-clear"
          >
            ×
          </button>
        )}
        <button type="submit" className="search-btn">
          Search
        </button>
      </div>
    </form>
  );
};

export default BookSearch;