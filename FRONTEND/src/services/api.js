import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login/', credentials),
  register: (userData) => api.post('/api/auth/register/', userData),
  logout: () => api.post('/api/auth/logout/'),
};

export const productsAPI = {
  getAllProducts: () => api.get('/api/products/'),
  getProduct: (id) => api.get(`/api/products/${id}/`),
  createProduct: (productData) => api.post('/api/products/', productData),
  updateProduct: (id, productData) => api.put(`/api/products/${id}/`, productData),
  deleteProduct: (id) => api.delete(`/api/products/${id}/`),
};

export default api;