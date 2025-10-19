import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import BookCatalog from './pages/user/BookCatalog';
import BookDetail from './pages/user/BookDetail';
import BorrowHistory from './pages/user/BorrowHistory';
import SavedBooks from './pages/user/SavedBooks';
import AccountSettings from './pages/user/AccountSettings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageBooks from './pages/admin/BookEdit';
import ManageUsers from './pages/admin/Users';

// Common Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import CurrentBorrows from './pages/user/CurrentBorrows';

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
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
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // jika role tidak sesuai → redirect ke dashboard sesuai role
    return (
      <Navigate
        to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}
        replace
      />
    );
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          {/* Auth Routes */}
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />}
          />

          {/* USER ROUTES */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalog"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <BookCatalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:id"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <BookDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/current-borrows"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <CurrentBorrows/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-books"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <SavedBooks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account-settings"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <AccountSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/borrow-history"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <BorrowHistory />
              </ProtectedRoute>
            }
          />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/books"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageBooks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          {/* DEFAULT ROUTE */}
          <Route
            path="/"
            element={
              <Navigate
                to={
                  user
                    ? user.role === 'admin'
                      ? '/admin/dashboard'
                      : '/user/dashboard'
                    : '/login'
                }
                replace
              />
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="not-found">
                <h1>404 - Page Not Found</h1>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
