import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../../services/books';
import BookGrid from '../../components/books/BookGrid';
import BookCard from '../../components/books/BookCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const UserDashboard = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [featuredResponse, popularResponse] = await Promise.all([
          bookService.getFeaturedBooks(),
          bookService.getPopularBooks()
        ]);

        setFeaturedBooks(featuredResponse.data);
        setPopularBooks(popularResponse.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard user-dashboard">
      <div className="dashboard-header">
        <h1>Welcome to LibToUs</h1>
        <p>Discover your next favorite book</p>
      </div>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Recommended Books</h2>
          <Link to="/catalog" className="view-all-link">View All</Link>
        </div>
        <BookGrid books={featuredBooks} />
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Most Popular</h2>
          <Link to="/catalog" className="view-all-link">View All</Link>
        </div>
        <BookGrid books={popularBooks} />
      </section>

      <section className="dashboard-actions">
        <div className="action-grid">
          <Link to="/catalog" className="action-card">
            <div className="action-icon">📚</div>
            <h3>Browse Catalog</h3>
            <p>Explore our collection of books</p>
          </Link>
          
          <Link to="/current-borrows" className="action-card">
            <div className="action-icon">⏰</div>
            <h3>Current Borrows</h3>
            <p>View your borrowed books</p>
          </Link>
          
          <Link to="/saved-books" className="action-card">
            <div className="action-icon">❤️</div>
            <h3>Saved Books</h3>
            <p>Your favorite books list</p>
          </Link>
          
          <Link to="/account-settings" className="action-card">
            <div className="action-icon">⚙️</div>
            <h3>Account Settings</h3>
            <p>Manage your account</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;