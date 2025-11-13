import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const sampleProducts = [
    {
      id: 1,
      name: 'Professional USB Microphone',
      category: 'Microphones',
      price: 8500,
      originalPrice: 12000,
      discount: 29,
      rating: 4.5,
      reviews: 127,
      image: 'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 2,
      name: '18" LED Ring Light',
      category: 'Ring Lights',
      price: 6500,
      originalPrice: 9500,
      discount: 32,
      rating: 4.8,
      reviews: 89,
      image: 'https://images.pexels.com/photos/4068314/pexels-photo-4068314.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 3,
      name: 'Professional Tripod Stand',
      category: 'Tripods',
      price: 4200,
      originalPrice: 6000,
      discount: 30,
      rating: 4.3,
      reviews: 156,
      image: 'https://images.pexels.com/photos/2787341/pexels-photo-2787341.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 4,
      name: 'Premium HDMI Cable 2m',
      category: 'Cables',
      price: 850,
      originalPrice: 1200,
      discount: 29,
      rating: 4.6,
      reviews: 234,
      image: 'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 5,
      name: 'Wireless Studio Headphones',
      category: 'Headphones',
      price: 12500,
      originalPrice: 18000,
      discount: 31,
      rating: 4.7,
      reviews: 198,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 6,
      name: 'Lavalier Microphone Set',
      category: 'Microphones',
      price: 3500,
      originalPrice: 5000,
      discount: 30,
      rating: 4.4,
      reviews: 76,
      image: 'https://images.pexels.com/photos/744322/pexels-photo-744322.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 7,
      name: 'Mini Ring Light with Stand',
      category: 'Ring Lights',
      price: 2800,
      rating: 4.2,
      reviews: 45,
      image: 'https://images.pexels.com/photos/4397925/pexels-photo-4397925.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 8,
      name: 'USB-C to USB Adapter',
      category: 'Cables',
      price: 650,
      rating: 4.5,
      reviews: 312,
      image: 'https://images.pexels.com/photos/163125/board-electronics-computer-data-processing-163125.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    setCartItems(cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const handleRemoveItem = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const handleCheckout = () => {
    alert('Checkout functionality will be integrated with backend');
    console.log('Checkout items:', cartItems);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/*"
            element={
              <>
                <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage products={sampleProducts} onAddToCart={handleAddToCart} />} />
                    <Route path="/products" element={<ProductsPage products={sampleProducts} onAddToCart={handleAddToCart} />} />
                    <Route path="/categories/:category" element={<ProductsPage products={sampleProducts} onAddToCart={handleAddToCart} />} />
                  </Routes>
                </main>
                <Footer />
                <Cart
                  isOpen={isCartOpen}
                  onClose={() => setIsCartOpen(false)}
                  cartItems={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onCheckout={handleCheckout}
                />
              </>
            }
          />
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
