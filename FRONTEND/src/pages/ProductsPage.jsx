import { useState, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import { productsAPI } from '../services/api';
import '../styles/Pages.css';

function ProductsPage({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getAllProducts();
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="page">Loading...</div>;
  if (error) return <div className="page">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1>All Products</h1>
          <p>Browse our complete collection of technical accessories</p>
        </div>
      </div>
      <ProductGrid products={products} onAddToCart={onAddToCart} />
    </div>
  );
}

export default ProductsPage;
