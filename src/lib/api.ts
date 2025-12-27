import axios from 'axios';

// Base API Configuration
export const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Token if available (for localStorage fallback)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Optional: Redirect to login or trigger a global event
      // window.location.href = '/login'; 
      // Better to handle redirection in the UI component or router
    }
    return Promise.reject(error);
  }
);
