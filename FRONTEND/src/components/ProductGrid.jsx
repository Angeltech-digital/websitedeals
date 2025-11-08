import { useState } from 'react';
import ProductCard from './ProductCard';
import '../styles/ProductGrid.css';

function ProductGrid({ products, onAddToCart }) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const categories = ['all', 'Microphones', 'Ring Lights', 'Tripods', 'Cables', 'Headphones'];

  const filteredProducts = products.filter(product =>
    filterCategory === 'all' || product.category === filterCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <section className="product-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Browse Our Collection</h2>
          <div className="filter-controls">
            <div className="filter-group">
              <label>Category:</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        <div className="products-grid">
          {sortedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="no-products">
            <p>No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductGrid;
