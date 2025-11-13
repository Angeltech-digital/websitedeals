import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import '../styles/Admin.css';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersAPI.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    console.log('Add Product:', productForm);
    setShowAddProduct(false);
    setProductForm({ name: '', category: '', price: '', description: '', image: '' });
  };

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <span className="logo-deals">Deals</span>
          <span className="logo-duka">Duka</span>
          <span className="admin-badge">Admin</span>
        </div>
        <nav className="admin-nav">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="13" width="8" height="8" stroke="currentColor" strokeWidth="2"/>
              <rect x="13" y="3" width="8" height="8" stroke="currentColor" strokeWidth="2"/>
              <rect x="13" y="13" width="8" height="8" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Dashboard
          </button>
          <button
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Products
          </button>
          <button
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 2L7 6M17 2L19 6M3 6H21M5 6H19L18 20H6L5 6Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Orders
          </button>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Users
          </button>
        </nav>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          {activeTab === 'products' && (
            <button className="add-btn" onClick={() => setShowAddProduct(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add Product
            </button>
          )}
        </div>

        <div className="admin-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{background: 'var(--primary-purple)'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Total Products</h3>
                  <p className="stat-number">0</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{background: 'var(--primary-orange)'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 2L7 6M17 2L19 6M3 6H21M5 6H19L18 20H6L5 6Z" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Total Orders</h3>
                  <p className="stat-number">0</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{background: 'var(--secondary-green)'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Total Users</h3>
                  <p className="stat-number">0</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{background: 'var(--secondary-yellow)'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Revenue</h3>
                  <p className="stat-number">KSh 0</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '40px'}}>
                      No products yet. Click "Add Product" to get started.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="6" style={{textAlign: 'center', padding: '40px'}}>
                      No orders yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-table-container">
              {error && (
                <div className="error-message" style={{color: 'red', padding: '10px'}}>
                  {error}
                </div>
              )}
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" style={{textAlign: 'center', padding: '40px'}}>
                        Loading users...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{textAlign: 'center', padding: '40px'}}>
                        No users yet.
                      </td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                        <td>
                          <button className="action-btn edit-btn">Edit</button>
                          <button className="action-btn delete-btn">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAddProduct && (
        <div className="modal-overlay" onClick={() => setShowAddProduct(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Product</h2>
              <button className="close-modal" onClick={() => setShowAddProduct(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleProductSubmit} className="modal-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Microphones">Microphones</option>
                  <option value="Ring Lights">Ring Lights</option>
                  <option value="Tripods">Tripods</option>
                  <option value="Cables">Cables</option>
                  <option value="Headphones">Headphones</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price (KSh)</label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows="4"
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <button type="submit" className="submit-btn">Add Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
