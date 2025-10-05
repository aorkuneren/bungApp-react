import { apiService } from './api';
import API_CONFIG from '../config/api';

export const authService = {
  // Login
  login: async (credentials) => {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
      const { data } = response.data;
      
      // Store token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      throw error;
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
