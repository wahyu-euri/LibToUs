import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../../services/books';
import { borrowService } from '../../services/borrows';
import { userService } from '../../services/users';
import "../../styles/Dashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalUsers: 0,
    activeBorrows: 0
  });
  const [recentBorrows, setRecentBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, you'd have a dedicated dashboard endpoint
        const [booksRes, usersRes, borrowsRes] = await Promise.all([
          bookService.getBooks(),
          userService.getUsers(),
          borrowService.getBorrows({ status: 'borrowed' })
        ]);

        const books = booksRes.data.data || booksRes.data;
        const users = usersRes.data.data || usersRes.data;
        const borrows = borrowsRes.data.data || borrowsRes.data;

        setStats({
          totalBooks: books.length,
          availableBooks: books.filter(book => book.available_copies > 0).length,
          totalUsers: users.length,
          activeBorrows: borrows.length
        });

        setRecentBorrows(borrows.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your library system</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.totalBooks}</div>
          <div className="stat-label">Total Books</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.availableBooks}</div>
          <div className="stat-label">Available Books</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.activeBorrows}</div>
          <div className="stat-label">Active Borrows</div>
        </div>
      </div>

      <div className="dashboard-sections">
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="action-grid">
            <Link to="/admin/books/add" className="action-card">
              <div className="action-icon">📚</div>
              <h3>Add New Book</h3>
              <p>Add a new book to the library</p>
            </Link>
            <Link to="/admin/books" className="action-card">
              <div className="action-icon">📖</div>
              <h3>Manage Books</h3>
              <p>View and edit all books</p>
            </Link>
            <Link to="/admin/users" className="action-card">
              <div className="action-icon">👥</div>
              <h3>Manage Users</h3>
              <p>View and manage users</p>
            </Link>
            <Link to="/admin/borrows" className="action-card">
              <div className="action-icon">⏰</div>
              <h3>Manage Borrows</h3>
              <p>Track book borrows and returns</p>
            </Link>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Recent Borrows</h2>
            <Link to="/admin/borrows" className="view-all-link">View All</Link>
          </div>
          <div className="recent-activity">
            {recentBorrows.length > 0 ? (
              <div className="activity-list">
                {recentBorrows.map(borrow => (
                  <div key={borrow.id} className="activity-item">
                    <div className="activity-icon">📚</div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <strong>{borrow.user?.username}</strong> borrowed "{borrow.book?.title}"
                      </div>
                      <div className="activity-time">
                        Due: {new Date(borrow.due_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No recent borrows</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;