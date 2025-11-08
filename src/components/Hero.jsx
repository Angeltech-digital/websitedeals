import { Link } from 'react-router-dom';
import '../styles/Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Quality Tech Accessories
            <span className="hero-subtitle">Verified. Trusted. Affordable.</span>
          </h1>
          <p className="hero-description">
            Discover the best deals on microphones, ring lights, tripods, cables, and more.
            Your trusted marketplace for technical accessories.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary">Shop Now</Link>
            <Link to="/about" className="btn btn-secondary">Learn More</Link>
          </div>
        </div>
        <div className="hero-features">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Verified Products</h3>
            <p>All items quality checked</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Fast Delivery</h3>
            <p>Quick and reliable shipping</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Best Prices</h3>
            <p>Competitive and transparent</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
