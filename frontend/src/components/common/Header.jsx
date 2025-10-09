import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="header">
      <div className="container">
        <div className="nav-container">
          <Link to="/" className="logo">
            <h2>LibToUs</h2>
          </Link>

          <nav className="nav">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/catalog" className="nav-link">Catalog</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            )}
          </nav>

          {user && (
            <div className="user-menu">
              <span>Welcome, {user.username}</span>
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header