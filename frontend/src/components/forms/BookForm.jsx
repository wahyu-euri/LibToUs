import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const BookForm = ({ 
  onSubmit, 
  initialData = {}, 
  loading = false,
  submitText = "Add Book" 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publication_year: new Date().getFullYear(),
    category: '',
    description: '',
    total_copies: 1,
    cover_image: null,
    ...initialData
  });

  const [coverPreview, setCoverPreview] = useState(initialData.cover_image || '');

  useEffect(() => {
    if (initialData.cover_image) {
      setCoverPreview(initialData.cover_image);
    }
  }, [initialData.cover_image]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        cover_image: file
      }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCoverPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        submitData.append(key, formData[key]);
      }
    });

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <div className="form-row">
        <Input
          label="Title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="form-input"
        />
        
        <Input
          label="Author"
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-row">
        <Input
          label="ISBN"
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          required
          className="form-input"
        />
        
        <Input
          label="Publisher"
          type="text"
          name="publisher"
          value={formData.publisher}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-row">
        <Input
          label="Publication Year"
          type="number"
          name="publication_year"
          value={formData.publication_year}
          onChange={handleChange}
          required
          min="1000"
          max={new Date().getFullYear()}
          className="form-input"
        />
        
        <Input
          label="Category"
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <Input
        label="Total Copies"
        type="number"
        name="total_copies"
        value={formData.total_copies}
        onChange={handleChange}
        required
        min="1"
        className="form-input"
      />

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Cover Image</label>
        <input
          type="file"
          name="cover_image"
          onChange={handleChange}
          accept="image/*"
          className="form-input"
        />
        {coverPreview && (
          <div className="cover-preview">
            <img src={coverPreview} alt="Cover preview" />
          </div>
        )}
      </div>

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

export default BookForm;