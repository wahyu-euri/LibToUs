import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../../services/books';
import { borrowService } from '../../services/borrows';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { calculateDueDate } from '../../utils/helpers';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [borrowData, setBorrowData] = useState({
    borrow_date: new Date().toISOString().split('T')[0],
    due_date: calculateDueDate(14)
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await bookService.getBook(id);
        setBook(response.data);
      } catch (error) {
        showAlert('Failed to load book details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleBorrow = async () => {
    if (!user) {
      showAlert('Please login to borrow books', 'error');
      navigate('/login');
      return;
    }

    setBorrowing(true);
    try {
      await borrowService.borrowBook({
        book_id: book.id,
        borrow_date: borrowData.borrow_date,
        due_date: borrowData.due_date
      });
      
      showAlert('Book borrowed successfully!', 'success');
      setShowBorrowModal(false);
      
      // Refresh book data to update available copies
      const response = await bookService.getBook(id);
      setBook(response.data);
    } catch (error) {
      showAlert(
        error.response?.data?.message || 'Failed to borrow book', 
        'error'
      );
    } finally {
      setBorrowing(false);
    }
  };

  const handleSaveBook = async () => {
    if (!user) {
      showAlert('Please login to save books', 'error');
      navigate('/login');
      return;
    }

    try {
      await bookService.saveBook(book.id);
      showAlert('Book saved to your list!', 'success');
    } catch (error) {
      showAlert(
        error.response?.data?.message || 'Failed to save book', 
        'error'
      );
    }
  };

  const showAlert = (message, type = 'error') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  if (loading) {
    return <LoadingSpinner text="Loading book details..." />;
  }

  if (!book) {
    return (
      <div className="error-page">
        <h1>Book Not Found</h1>
        <p>The book you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/catalog')} className="btn btn-primary">
          Back to Catalog
        </button>
      </div>
    );
  }

  const canBorrow = book.available_copies > 0;

  return (
    <div className="book-detail">
      {alert.show && (
        <Alert type={alert.type} message={alert.message} />
      )}

      <div className="book-detail-container">
        <div className="book-cover">
          <img 
            src={book.cover_image || '/images/default-book-cover.jpg'} 
            alt={book.title}
            onError={(e) => {
              e.target.src = '/images/default-book-cover.jpg';
            }}
          />
          {!canBorrow && (
            <div className="availability-badge availability-unavailable">
              Out of Stock
            </div>
          )}
        </div>

        <div className="book-info">
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author">by {book.author}</p>

          <div className="book-meta">
            <div className="meta-item">
              <span className="meta-label">ISBN</span>
              <span className="meta-value">{book.isbn}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Publisher</span>
              <span className="meta-value">{book.publisher}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Year</span>
              <span className="meta-value">{book.publication_year}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Category</span>
              <span className="meta-value">{book.category}</span>
            </div>
          </div>

          <div className="book-rating">
            <span className="rating-stars">
              {'★'.repeat(Math.floor(book.rating))}
              {'☆'.repeat(5 - Math.floor(book.rating))}
            </span>
            <span className="rating-value">{book.rating}/5</span>
            <span className="rating-count">({book.review_count} reviews)</span>
          </div>

          <div className="book-availability">
            <div className={`availability-badge ${canBorrow ? 'availability-available' : 'availability-unavailable'}`}>
              {canBorrow ? 
                `${book.available_copies} copies available` : 
                'Currently unavailable'
              }
            </div>
          </div>

          <div className="book-description">
            <h3>Description</h3>
            <p>{book.description}</p>
          </div>

          <div className="book-actions">
            {canBorrow ? (
              <Button
                variant="primary"
                onClick={() => setShowBorrowModal(true)}
                className="action-btn"
              >
                Borrow This Book
              </Button>
            ) : (
              <Button
                variant="secondary"
                disabled
                className="action-btn"
              >
                Not Available
              </Button>
            )}
            
            <Button
              variant="secondary"
              onClick={handleSaveBook}
              className="action-btn"
            >
              Save to List
            </Button>
          </div>
        </div>
      </div>

      {/* Borrow Modal */}
      <Modal
        isOpen={showBorrowModal}
        onClose={() => setShowBorrowModal(false)}
        title="Borrow Book"
      >
        <div className="borrow-form">
          <p>You are about to borrow: <strong>{book.title}</strong></p>
          
          <div className="form-group">
            <label className="form-label">Borrow Date</label>
            <input
              type="date"
              value={borrowData.borrow_date}
              onChange={(e) => setBorrowData(prev => ({
                ...prev,
                borrow_date: e.target.value
              }))}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              value={borrowData.due_date}
              onChange={(e) => setBorrowData(prev => ({
                ...prev,
                due_date: e.target.value
              }))}
              min={borrowData.borrow_date}
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <Button
              variant="secondary"
              onClick={() => setShowBorrowModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={borrowing}
              onClick={handleBorrow}
            >
              Confirm Borrow
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookDetail;