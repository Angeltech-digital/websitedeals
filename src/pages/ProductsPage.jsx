import ProductGrid from '../components/ProductGrid';
import '../styles/Pages.css';

function ProductsPage({ products, onAddToCart }) {
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
