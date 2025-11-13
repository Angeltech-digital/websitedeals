import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { authAPI, getAccessToken, clearTokens, getUser, clearUser, setUser } from '../services/api';

function Header({ cartCount, onCartClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const isAuthenticated = Boolean(getAccessToken());
  const [user, setUserState] = useState(getUser());

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Load profile if we have a token but no cached user
  useEffect(() => {
    let mounted = true;
    const token = getAccessToken();
    if (token && !user) {
      authAPI.getProfile()
        .then((res) => {
          if (!mounted) return;
          setUser(res.data);
          setUserState(res.data);
        })
        .catch(() => {
          // ignore errors here
        });
    }
    return () => { mounted = false; };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="header">
      {/* Main header section */}
      <div className="header-top">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="logo">
              <img src="/images/dealsduka-logo.png" alt="DealsDuka" className="logo-image" />
            </Link>

            {/* Search bar - responsive */}
            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for tech accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </form>

            {/* Header actions - Cart and Account */}
            <div className="header-actions">
              {/* Account section */}
              <div className="account-section">
                {!isAuthenticated ? (
                  <div className="auth-buttons">
                    <Link to="/login" className="btn-login">Login</Link>
                    <Link to="/register" className="btn-signup">Sign Up</Link>
                  </div>
                ) : (
                  <div className="user-menu">
                    <button className="user-button">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M12 14C7.58 14 4 16.69 4 20v2h16v-2c0-3.31-3.58-6-8-6z"/>
                      </svg>
                      <span>{user?.username?.split('@')[0] || 'User'}</span>
                    </button>
                    <button
                      className="btn-logout"
                      onClick={async () => {
                        try {
                          const refresh = localStorage.getItem('refresh_token');
                          if (refresh) await authAPI.logout(refresh);
                        } catch (e) {
                          // ignore
                        } finally {
                          clearTokens();
                          clearUser();
                          setUserState(null);
                          navigate('/login');
                        }
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Cart button */}
              <button className="cart-button" onClick={onCartClick} aria-label="Open cart">
                <div className="cart-icon-container">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="cart-icon">
                    <path d="M7 18C5.9 18 5 18.9 5 20s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.16.12-.34.12-.54 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </div>
              </button>

              {/* Mobile menu toggle */}
              <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Open menu">
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
        <div className="container">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">All Products</Link></li>
            {user?.role === 'ADMIN' && (
              <li><Link to="/admin" className="admin-link">Admin Dashboard</Link></li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
