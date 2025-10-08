import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookForm from '../../components/forms/BookForm';
import Alert from '../../components/ui/Alert';
import { bookService } from '../../services/books';

const BookAdd = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    setAlert({ show: false, message: '', type: '' });

    try {
      await bookService.createBook(formData);
      setAlert({
        show: true,
        message: 'Book added successfully!',
        type: 'success'
      });
      
      setTimeout(() => {
        navigate('/admin/books');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        error.response?.data?.errors?.[0] || 
        'Failed to add book';
      
      setAlert({
        show: true,
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-add-page">
      <div className="page-header">
        <h1>Add New Book</h1>
        <p>Add a new book to the library collection</p>
      </div>

      {alert.show && (
        <Alert type={alert.type} message={alert.message} />
      )}

      <div className="form-container">
        <BookForm
          onSubmit={handleSubmit}
          loading={loading}
          submitText="Add Book"
        />
      </div>
    </div>
  );
};

export default BookAdd;