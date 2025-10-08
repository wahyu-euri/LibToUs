import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminBooks from './pages/admin/Books';
import BookAdd from './pages/admin/BookAdd';
import BookEdit from './pages/admin/BookEdit';
import AdminUsers from './pages/admin/Users';
import AdminBorrows from './pages/admin/Borrows';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import BookCatalog from './pages/user/BookCatalog';
import BookDetail from './pages/user/BookDetail';
import SavedBooks from './pages/user/SavedBooks';
import BorrowHistory from './pages/user/BorrowHistory';
import CurrentBorrows from './pages/user/CurrentBorrows';
import AccountSettings from './pages/user/AccountSettings';

// Common Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Styles
import './styles/global.css';
import './styles/variables.css';
import './styles/Auth.css';
import './styles/Dashboard.css';
import './styles/BookCard.css';
import './styles/BookDetail.css';
import './styles/Forms.css';
import './styles/Navigation.css';
import './styles/Admin.css';
import './styles/Responsive.css';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} />} 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/books" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminBooks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/books/add" 
              element={
                <ProtectedRoute adminOnly>
                  <BookAdd />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/books/edit/:id" 
              element={
                <ProtectedRoute adminOnly>
                  <BookEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/borrows" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminBorrows />
                </ProtectedRoute>
              } 
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
            <Route 
              path="/saved-books" 
              element={
                <ProtectedRoute>
                  <SavedBooks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/current-borrows" 
              element={
                <ProtectedRoute>
                  <CurrentBorrows />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/borrow-history" 
              element={
                <ProtectedRoute>
                  <BorrowHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/account-settings" 
              element={
                <ProtectedRoute>
                  <AccountSettings />
                </ProtectedRoute>
              } 
            />

            {/* Default Route */}
            <Route 
              path="/" 
              element={<Navigate to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/login'} />} 
            />

            {/* 404 Route */}
            <Route path="*" element={<div className="not-found">Page Not Found</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;