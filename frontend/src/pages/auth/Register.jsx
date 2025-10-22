import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import "./styles/Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } else {
      const err = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
      setError(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>LibToUs</h1>
          <p>Create your account</p>
        </div>

        {error && <Alert type="error" message={error} />}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input label="Username" type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="Choose a username" />
          <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" />
          <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Create a password" />
          <Input label="Confirm Password" type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required placeholder="Confirm your password" />

          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select name="role" value={formData.role} onChange={handleChange} className="form-select">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Button type="submit" loading={loading} className="auth-button">Create Account</Button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
