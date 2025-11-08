import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header({ cartCount, onCartClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <span className="logo-deals">Deals</span>
              <span className="logo-duka">Duka</span>
            </Link>

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

            <div className="header-actions">
              <Link to="/login" className="header-link">Login</Link>
              <button className="cart-button" onClick={onCartClick}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 2L7 6M17 2L19 6M3 6H21M5 6H19L18 20H6L5 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
              <button className="mobile-menu-toggle" onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
        <div className="container">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/categories/microphones">Microphones</Link></li>
            <li><Link to="/categories/lighting">Ring Lights</Link></li>
            <li><Link to="/categories/tripods">Tripods</Link></li>
            <li><Link to="/categories/cables">Cables</Link></li>
            <li><Link to="/categories/headphones">Headphones</Link></li>
            <li><Link to="/admin" className="admin-link">Admin</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
