import { useState } from 'react';
import '../styles/Cart.css';

function Cart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="close-cart" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M9 2L7 6M17 2L19 6M3 6H21M5 6H19L18 20H6L5 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image || 'https://via.placeholder.com/80x80'} alt={item.name} />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p className="cart-item-price">KSh {item.price.toLocaleString()}</p>
                    <div className="quantity-controls">
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <p className="cart-item-total">KSh {(item.price * item.quantity).toLocaleString()}</p>
                    <button className="remove-item" onClick={() => onRemoveItem(item.id)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>KSh {total.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-row total-row">
                <span>Total:</span>
                <span>KSh {total.toLocaleString()}</span>
              </div>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
