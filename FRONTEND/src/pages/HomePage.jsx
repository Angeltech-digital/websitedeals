import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';

function HomePage({ products, onAddToCart }) {
  return (
    <div>
      <Hero />
      <ProductGrid products={products} onAddToCart={onAddToCart} />
    </div>
  );
}

export default HomePage;
