import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// User Pages
import UserDashboard from './pages/user/Dashboard'
import BookCatalog from './pages/user/BookCatalog'
import BookDetail from './pages/user/BookDetail'

// Common Components
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import LoadingSpinner from './components/common/LoadingSpinner'

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong</h1>
          <p>We're sorry, but something went wrong. Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register /> : <Navigate to="/dashboard" replace />} 
            />

            {/* User Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/catalog" 
              element={
                <ProtectedRoute>
                  <BookCatalog />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/book/:id" 
              element={
                <ProtectedRoute>
                  <BookDetail />
                </ProtectedRoute>
              } 
            />

            {/* Default Route */}
            <Route 
              path="/" 
              element={<Navigate to={user ? '/dashboard' : '/login'} replace />} 
            />

            {/* 404 Route */}
            <Route path="*" element={
              <div className="not-found">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App