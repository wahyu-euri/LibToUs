import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="logo">
            <h2>LibToUs</h2>
          </Link>

          {/* Navigation - Dashboard sebagai halaman utama */}
          <nav className="nav">
            {user ? (
              <>
                {/* Dashboard selalu jadi menu pertama */}
                <NavLink to="/dashboard" className="nav-link">
                  Dashboard
                </NavLink>

                {/* Menu lainnya */}
                <NavLink to="/catalog" className="nav-link">
                  Books
                </NavLink>
                <NavLink to="/current-borrows" className="nav-link">
                  My Books
                </NavLink>

                {/* Menu admin */}
                {user.role === "admin" && (
                  <NavLink to="/admin/books" className="nav-link admin-link">
                    Admin
                  </NavLink>
                )}
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav-link">
                  Login
                </NavLink>
                <NavLink to="/register" className="nav-link">
                  Register
                </NavLink>
              </>
            )}
          </nav>

          {/* User Menu */}
          {user && (
            <div className="user-menu">
              <span className="username">Hi, {user.username}</span>
              <div className="user-actions">
                <NavLink
                  to="/account-settings"
                  className="icon-btn"
                  title="Settings"
                >
                  ⚙️
                </NavLink>
                <button
                  onClick={logout}
                  className="btn btn-secondary logout-btn"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
