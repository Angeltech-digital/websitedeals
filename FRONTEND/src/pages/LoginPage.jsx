import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, setTokens, setUser } from '../services/api';
import Header from '../components/Header';
import '../styles/Auth.css';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);

  const handleSubmit = async (e) => {
    // allow calling via both form submit and button onClick; prevent duplicate submissions
    if (isLoading) return;
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Backend TokenObtainPairView expects { username, password }
      // If the user provided an email, include it as `email` too (some backends accept either).
      const payload = {
        username: formData.usernameOrEmail,
        password: formData.password,
      };
      if (formData.usernameOrEmail.includes('@')) {
        payload.email = formData.usernameOrEmail;
      }

      // Debug: log the payload being sent to the API
      console.debug('Login payload:', payload);

      const response = await authAPI.login(payload);

      // TokenObtainPairView returns { access, refresh }
      const { access, refresh } = response.data;
      setTokens({ access, refresh });
      // fetch user profile and persist it for UI state
      try {
        const profileRes = await authAPI.getProfile();
        setUser(profileRes.data);
        if (profileRes.data?.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (e) {
        // if profile cannot be fetched, just redirect to home
        navigate('/');
      }
    } catch (err) {
      // Log the entire server response for debugging
      console.error('Login error response:', err.response?.data || err);
      // Show detailed backend errors when available
      const message = err.response?.data?.detail || err.response?.data || err.message;
      setError(typeof message === 'string' ? message : JSON.stringify(message));
      setServerErrors(err.response?.data || null);
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

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="usernameOrEmail">Email or Username</label>
                <input
                  type="text"
                  id="usernameOrEmail"
                  name="usernameOrEmail"
                  value={formData.usernameOrEmail}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com or username"
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

              <div className="form-footer">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="link">Forgot password?</Link>
              </div>

              {error && (
                <div className="auth-error" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="submit-btn"
                onClick={handleSubmit}
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
