import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

// API Base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10);

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem('admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`[API] Response:`, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as { message?: string; error?: string };
      
      switch (status) {
        case 400:
          toast.error(data.message || 'Invalid request. Please check your input.');
          break;
        case 401:
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('admin_token');
          window.location.href = '/admin/login';
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          toast.error(data.message || 'Resource not found.');
          break;
        case 409:
          toast.error(data.message || 'A conflict occurred. The resource may already exist.');
          break;
        case 429:
          toast.error('Too many requests. Please wait a moment and try again.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data.message || 'An unexpected error occurred.');
      }
    } else if (error.request) {
      // Request made but no response received
      toast.error('Unable to connect to server. Please check your internet connection.');
    } else {
      // Error in setting up request
      toast.error('An error occurred while processing your request.');
    }
    
    console.error('[API] Error:', error);
    return Promise.reject(error);
  }
);

// Retry logic for failed requests
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
      }
    }
  }
  
  throw lastError;
};

export default apiClient;
