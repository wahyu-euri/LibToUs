import React, { useState, useEffect } from 'react';
import { bookService } from '../../services/books';

const BookFilter = ({ onFilterChange, currentFilters }) => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: currentFilters?.category || 'all',
    sort: currentFilters?.sort || 'title',
    order: currentFilters?.order || 'asc'
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await bookService.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="book-filter">
      <div className="filter-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="form-select"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort">Sort By</label>
        <select
          id="sort"
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="form-select"
        >
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="rating">Rating</option>
          <option value="publication_year">Publication Year</option>
          <option value="created_at">Date Added</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="order">Order</label>
        <select
          id="order"
          value={filters.order}
          onChange={(e) => handleFilterChange('order', e.target.value)}
          className="form-select"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
};

export default BookFilter;