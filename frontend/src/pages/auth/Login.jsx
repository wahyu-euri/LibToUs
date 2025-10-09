import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from "react-router-dom";
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import "../../styles/Auth.css"

const Login = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>LibToUs</h1>
          <p>Welcome back! Please sign in to your account.</p>
        </div>

        {error && <Alert type="error" message={error} />}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Username or Email"
            type="text"
            name="login"
            value={formData.login}
            onChange={handleChange}
            required
            placeholder="Enter your username or email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />

          <Button
            type="submit"
            loading={loading}
            className="auth-button"
          >
            Sign In
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;