import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI, setTokens } from '../services/api';
import Header from '../components/Header';
import '../styles/Auth.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);

  const handleSubmit = async (e) => {
    if (isLoading) return;
    if (e && e.preventDefault) e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirmPassword,
      };
      // Only include username if provided and not empty
      if (formData.username && formData.username.trim()) {
        payload.username = formData.username.trim();
      }

      const response = await authAPI.register(payload);
      // register view returns user data + access & refresh tokens
      const { access, refresh } = response.data;
      setTokens({ access, refresh });
      toast.success('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error('Register error response:', err.response?.data || err);
      const errorData = err.response?.data || { detail: err.message };
      
      // Transform error messages to handle both string and array formats
      const transformedErrors = {};
      for (const [key, value] of Object.entries(errorData)) {
        if (Array.isArray(value)) {
          transformedErrors[key] = value;
        } else if (typeof value === 'string') {
          transformedErrors[key] = [value];
        } else {
          transformedErrors[key] = [String(value)];
        }
      }
      
      setServerErrors(transformedErrors);
      
      // Show error toast
      const firstError = Object.values(transformedErrors)[0];
      const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      toast.error(errorMessage || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Header cartCount={0} onCartClick={() => {}} />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join DealsDuka today</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="username">Full Name</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
                {serverErrors?.username && (
                  <div className="field-error">{serverErrors.username.join(' ')}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
                {serverErrors?.email && (
                  <div className="field-error">{serverErrors.email.join(' ')}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
                {serverErrors?.password && (
                  <div className="field-error">{serverErrors.password.join(' ')}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>I agree to the Terms and Conditions</span>
              </label>

              {serverErrors?.detail && (
                <div className="auth-error" role="alert">{serverErrors.detail}</div>
              )}

              <button
                type="submit"
                className="submit-btn"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
