import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const AdminMenu = () => (
    <>
      <Link to="/admin/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
      <Link to="/admin/books" className="nav-link" onClick={() => setIsMenuOpen(false)}>Books</Link>
      <Link to="/admin/users" className="nav-link" onClick={() => setIsMenuOpen(false)}>Users</Link>
      <Link to="/admin/borrows" className="nav-link" onClick={() => setIsMenuOpen(false)}>Borrows</Link>
    </>
  );

  const UserMenu = () => (
    <>
      <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
      <Link to="/catalog" className="nav-link" onClick={() => setIsMenuOpen(false)}>Catalog</Link>
      <Link to="/current-borrows" className="nav-link" onClick={() => setIsMenuOpen(false)}>My Borrows</Link>
      <Link to="/saved-books" className="nav-link" onClick={() => setIsMenuOpen(false)}>Saved</Link>
    </>
  );

  return (
    <header className="header">
      <div className="container">
        <div className="nav-container">
          <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
            <h2>LibToUs</h2>
          </Link>

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            {user ? (
              <>
                {user.role === 'admin' ? <AdminMenu /> : <UserMenu />}
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="nav-link" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            )}
          </nav>

          {user && (
            <div className="user-menu">
              <button 
                className="user-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span>Welcome, {user.username}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {isMenuOpen && (
                <div className="dropdown-menu">
                  <Link 
                    to={user.role === 'admin' ? '/admin/dashboard' : '/account-settings'} 
                    className="dropdown-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Account Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="dropdown-item logout"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;