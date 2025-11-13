import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Token keys in localStorage
const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get access token
export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function setUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}

// Add interceptor to add authorization header
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  // Do not attach Authorization header to auth endpoints where it may be unwanted
  const skipAuthPaths = ['/api/login/', '/api/auth/register/', '/api/auth/logout/', '/api/auth/token/'];
  const url = config.url || '';
  const isAuthPath = skipAuthPaths.some((p) => url.endsWith(p) || (config.baseURL && (config.baseURL + url).endsWith(p)));

  if (token && !isAuthPath) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const authAPI = {
  // Backend maps /api/login/ to TokenObtainPairView which expects {username, password}
  login: (credentials) => api.post('/api/login/', credentials),
  register: (userData) => api.post('/api/auth/register/', userData),
  // logout endpoint expects { refresh: <token> } per backend LogoutView implementation
  logout: (refresh) => api.post('/api/auth/logout/', { refresh }),
  // get current user profile
  getProfile: () => api.get('/api/profile/'),
};

export const productsAPI = {
  getAllProducts: () => api.get('/api/products/'),
  getProduct: (id) => api.get(`/api/products/${id}/`),
  createProduct: (productData) => api.post('/api/products/', productData),
  updateProduct: (id, productData) => api.put(`/api/products/${id}/`, productData),
  deleteProduct: (id) => api.delete(`/api/products/${id}/`),
};

export const usersAPI = {
  getAllUsers: () => api.get('/api/users/'),
  getUser: (id) => api.get(`/api/users/${id}/`),
  createUser: (userData) => api.post('/api/users/', userData),
  updateUser: (id, userData) => api.put(`/api/users/${id}/`, userData),
  deleteUser: (id) => api.delete(`/api/users/${id}/`),
};

export default api;
