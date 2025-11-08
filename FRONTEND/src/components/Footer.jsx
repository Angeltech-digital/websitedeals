import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">
              <span className="logo-deals">Deals</span>
              <span className="logo-duka">Duka</span>
            </h3>
            <p className="footer-description">
              Your trusted marketplace for quality technical accessories.
              Verified products, transparent pricing, reliable service.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/categories/microphones">Microphones</Link></li>
              <li><Link to="/categories/lighting">Ring Lights</Link></li>
              <li><Link to="/categories/tripods">Tripods</Link></li>
              <li><Link to="/categories/cables">Cables</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/warranty">Warranty</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Account</h4>
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/account">My Account</Link></li>
              <li><Link to="/orders">Order History</Link></li>
              <li><Link to="/admin">Admin Portal</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Newsletter</h4>
            <p>Subscribe to get special offers and updates</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 DealsDuka. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
