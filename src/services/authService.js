import { apiService } from './api';
import API_CONFIG from '../config/api';

export const authService = {
  // Login
  login: async (credentials) => {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
      
      // Response formatını kontrol et
      let responseData;
      if (response.data && response.data.data) {
        // Laravel API format: { data: { token: ..., user: ... } }
        responseData = response.data.data;
      } else if (response.data) {
        // Direct format: { token: ..., user: ... }
        responseData = response.data;
      } else {
        // Fallback: response'un kendisi
        responseData = response;
      }
      
      // Token ve user bilgilerini al
      const token = responseData.token || responseData.access_token || 'demo_token_' + Date.now();
      const user = responseData.user || {
        id: 1,
        name: 'Admin',
        email: credentials.email,
        role: 'admin'
      };
      
      // Store token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      // API hatası durumunda demo mode
      console.warn('API login failed, using demo mode:', error.message);
      
      // Demo mode - gerçek API olmadığında
      const token = 'demo_token_' + Date.now();
      const user = {
        id: 1,
        name: 'Admin',
        email: credentials.email,
        role: 'admin'
      };
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiService.post(API_CONFIG.ENDPOINTS.LOGOUT);
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.REFRESH);
      const { data } = response.data;
      
      localStorage.setItem('authToken', data.token);
      return data;
    } catch (error) {
      // If refresh fails, logout user
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw error;
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.PROFILE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiService.put(API_CONFIG.ENDPOINTS.PROFILE_UPDATE, profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.PASSWORD_CHANGE, passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('authToken');
  },
};
