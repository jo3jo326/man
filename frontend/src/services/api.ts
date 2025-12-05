/**
 * API Service
 * Centralized service for all HTTP requests to backend
 * Following best practice: One centralized reusable logic
 */

import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, API_ENDPOINTS, ROUTES } from '../constants';

// Logout handler to be set by AuthContext
let logoutHandler: (() => void) | null = null;
export const setLogoutHandler = (handler: () => void) => {
  logoutHandler = handler;
};

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle 401 Unauthorized globally
    if (error.response && error.response.status === 401) {
      window.localStorage.removeItem('token');
      alert('Your session has expired or you are not logged in. Please log in to continue.');
      // Use ROUTES.HOME or fallback to '/login' if LOGIN is not defined
      if (ROUTES.LOGIN) {
        window.location.href = ROUTES.LOGIN;
      } else {
        window.location.href = '/login';
      }
      if (logoutHandler) logoutHandler();
      return Promise.reject(error);
    }
    // Handle timeout
    if (error.code === 'ECONNABORTED' || (typeof error.message === 'string' && error.message.includes('timeout'))) {
      alert('Request timed out. Please check your connection or log in again.');
    }
    // Handle other errors gracefully
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API methods
export const api = {
    /**
     * User signup
     */
    signup: async (email: string, password: string) => {
      try {
        const response = await apiClient.post(API_ENDPOINTS.SIGNUP, { email, password });
        // Store token in localStorage for session persistence
        if (response.data.token) localStorage.setItem('token', response.data.token);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    /**
     * User login
     */
    login: async (email: string, password: string) => {
      try {
        const response = await apiClient.post(API_ENDPOINTS.LOGIN, { email, password });
        if (response.data.token) localStorage.setItem('token', response.data.token);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  /**
   * Test backend connection
   */
  ping: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PING);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch all conversations
   */
  getConversations: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CONVERSATIONS);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Save a conversation
   */
  saveConversation: async (data: {
    conversationId: string;
    transcript: string;
    aiResponse: string;
    nuancedOptions: any[];
  }) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CONVERSATIONS, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get AI response for a transcript
   */
  askAi: async (conversationId: string) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AI_RESPONSE, { conversationId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiClient;
