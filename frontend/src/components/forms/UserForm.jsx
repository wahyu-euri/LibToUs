import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const UserForm = ({ 
  onSubmit, 
  initialData = {}, 
  loading = false,
  submitText = "Save User" 
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    ...initialData
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
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <Input
        label="Username"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <div className="form-group">
        <label className="form-label">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="form-select"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
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

export default UserForm;