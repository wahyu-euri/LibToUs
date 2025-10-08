import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookForm from '../../components/forms/BookForm';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { bookService } from '../../services/books';

const BookEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await bookService.getBook(id);
        setBook(response.data);
      } catch (error) {
        setAlert({
          show: true,
          message: 'Failed to load book',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setAlert({ show: false, message: '', type: '' });

    try {
      await bookService.updateBook(id, formData);
      setAlert({
        show: true,
        message: 'Book updated successfully!',
        type: 'success'
      });
      
      setTimeout(() => {
        navigate('/admin/books');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        error.response?.data?.errors?.[0] || 
        'Failed to update book';
      
      setAlert({
        show: true,
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading book..." />;
  }

  if (!book) {
    return (
      <div className="error-page">
        <h1>Book Not Found</h1>
        <p>The book you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/admin/books')} className="btn btn-primary">
          Back to Books
        </button>
      </div>
    );
  }

  return (
    <div className="book-edit-page">
      <div className="page-header">
        <h1>Edit Book</h1>
        <p>Update book information</p>
      </div>

      {alert.show && (
        <Alert type={alert.type} message={alert.message} />
      )}

      <div className="form-container">
        <BookForm
          onSubmit={handleSubmit}
          initialData={book}
          loading={submitting}
          submitText="Update Book"
        />
      </div>
    </div>
  );
};

export default BookEdit;