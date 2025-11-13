import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI, setTokens, setUser, clearTokens } from '../services/api';
import Header from '../components/Header';
import '../styles/Auth.css';

function LoginPage() {
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
      // Login with email - backend will convert to username
      const payload = {
        username: formData.email,  // Send email as username
        password: formData.password,
      };

      console.debug('Login payload:', payload);

      const response = await authAPI.login(payload);
      const { access, refresh } = response.data;
      setTokens({ access, refresh });

      try {
        const profileRes = await authAPI.getProfile();
        const userData = profileRes.data;
        
        setUser(userData);
        toast.success('Login successful!');
        
        // Admin goes to admin dashboard, others go to home
        if (userData?.is_staff || userData?.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (e) {
        // if profile cannot be fetched, redirect to home
        toast.success('Login successful!');
        navigate('/');
      }
    } catch (err) {
      console.error('Login error response:', err.response?.data || err);
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
    <>
      <Header cartCount={0} onCartClick={() => {}} />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your account</p>

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
                  required
                  placeholder="Enter your email"
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
                  required
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
