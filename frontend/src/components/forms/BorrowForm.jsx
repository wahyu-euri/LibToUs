import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calculateDueDate } from '../../utils/helpers';

const BorrowForm = ({ 
  onSubmit, 
  book,
  loading = false,
  submitText = "Borrow Book" 
}) => {
  const [formData, setFormData] = useState({
    borrow_date: new Date().toISOString().split('T')[0],
    due_date: calculateDueDate(14)
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      book_id: book.id
    });
  };

  return (
    <form onSubmit={handleSubmit} className="borrow-form">
      {book && (
        <div className="book-info-card">
          <h4>Book Information</h4>
          <p><strong>Title:</strong> {book.title}</p>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Available Copies:</strong> {book.available_copies}</p>
        </div>
      )}

      <Input
        label="Borrow Date"
        type="date"
        name="borrow_date"
        value={formData.borrow_date}
        onChange={handleChange}
        required
      />

      <Input
        label="Due Date"
        type="date"
        name="due_date"
        value={formData.due_date}
        onChange={handleChange}
        min={formData.borrow_date}
        required
      />

      <Button
        type="submit"
        loading={loading}
        className="submit-btn"
      >
        {submitText}
      </Button>
    </form>
  );
};

export default BorrowForm;