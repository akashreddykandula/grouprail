import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || 'Something went wrong';
    const status = error?.response?.status;

    if (status === 401) {
      // Clear auth state and redirect to login
      window.dispatchEvent(new CustomEvent('auth:logout'));
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (status === 429) {
      toast.error('Too many requests. Please slow down.');
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject({ message, status, data: error?.response?.data });
  }
);

export default api;
