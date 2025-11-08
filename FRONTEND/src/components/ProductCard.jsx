import '../styles/ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image || 'https://via.placeholder.com/300x300?text=Product'}
          alt={product.name}
          className="product-image"
        />
        {product.discount && (
          <span className="product-badge">{product.discount}% OFF</span>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < Math.floor(product.rating || 4) ? 'currentColor' : 'none'}>
                <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            ))}
          </div>
          <span className="rating-count">({product.reviews || 0})</span>
        </div>
        <div className="product-footer">
          <div className="product-price">
            {product.originalPrice && (
              <span className="original-price">KSh {product.originalPrice.toLocaleString()}</span>
            )}
            <span className="current-price">KSh {product.price.toLocaleString()}</span>
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 2L7 6M17 2L19 6M3 6H21M5 6H19L18 20H6L5 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
