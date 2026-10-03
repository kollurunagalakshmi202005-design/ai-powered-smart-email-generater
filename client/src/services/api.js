import axios from 'axios';

// Base API URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 25000,
});

// Request interceptor: Attach JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Extract user-friendly error messages (SRS Section 5.2)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let friendlyMessage = 'Network problem. Please check your connection.';

    if (error.response) {
      // Server responded with non-2xx status code
      friendlyMessage = error.response.data?.message || `Request failed with status ${error.response.status}`;
      
      // Auto-logout if token is invalid or expired (401)
      if (error.response.status === 401 && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Optional redirect if needed
      }
    } else if (error.request) {
      // Request made but no response received
      friendlyMessage = 'Server is not responding. Please make sure the backend is running.';
    }

    return Promise.reject(new Error(friendlyMessage));
  }
);

export default api;
