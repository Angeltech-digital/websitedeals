import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI, setTokens, setUser, clearTokens } from '../services/api';
import '../styles/Auth.css';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (isLoading) return;
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // For admin, require email and convert to username for backend
      if (!formData.email || !formData.password) {
        setError('Email and password are required');
        toast.error('Email and password are required');
        setIsLoading(false);
        return;
      }

      const payload = {
        username: formData.email, // Send email as username
        password: formData.password,
      };

      console.debug('Admin login payload:', payload);

      const response = await authAPI.login(payload);
      const { access, refresh } = response.data;
      setTokens({ access, refresh });

      try {
        const profileRes = await authAPI.getProfile();
        const userData = profileRes.data;
        
        // Check if user is admin
        if (userData?.role !== 'ADMIN' && !userData?.is_staff) {
          // Not an admin
          clearTokens();
          setError('Admin access required');
          toast.error('This account does not have admin privileges');
          setIsLoading(false);
          return;
        }

        setUser(userData);
        toast.success('Admin login successful!');
        navigate('/admin');
      } catch (e) {
        toast.error('Could not verify admin status');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Admin login error:', err.response?.data || err);
      const message = err.response?.data?.detail || 'Invalid email or password';
      setError(message);
      toast.error(message);
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
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <h1 className="auth-title">Admin Portal</h1>
          <p className="auth-subtitle">Admin login only</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your admin email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Admin Login'}
            </button>
          </form>

          <div className="auth-footer">
            <button 
              className="auth-link"
              onClick={() => navigate('/login')}
            >
              ← Back to Seller Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
