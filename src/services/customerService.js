import { apiService } from './api';
import API_CONFIG from '../config/api';

export const customerService = {
  // Get all customers with pagination and filters
  getCustomers: async (params = {}) => {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.CUSTOMERS, {
        page: params.page || API_CONFIG.PAGINATION.DEFAULT_PAGE,
        per_page: params.perPage || API_CONFIG.PAGINATION.DEFAULT_PER_PAGE,
        search: params.search || '',
        status: params.status || '',
        sort_by: params.sortBy || 'created_at',
        sort_order: params.sortOrder || 'desc',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single customer by ID
  getCustomer: async (id) => {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.CUSTOMER_DETAIL(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new customer
  createCustomer: async (customerData) => {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.CUSTOMERS, customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    try {
      const response = await apiService.put(API_CONFIG.ENDPOINTS.CUSTOMER_UPDATE(id), customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete customer
  deleteCustomer: async (id) => {
    try {
      const response = await apiService.delete(API_CONFIG.ENDPOINTS.CUSTOMER_DELETE(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get customer statistics
  getCustomerStats: async (id) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.CUSTOMER_DETAIL(id)}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get customer reservations
  getCustomerReservations: async (id, params = {}) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.CUSTOMER_DETAIL(id)}/reservations`, {
        page: params.page || API_CONFIG.PAGINATION.DEFAULT_PAGE,
        per_page: params.perPage || API_CONFIG.PAGINATION.DEFAULT_PER_PAGE,
        status: params.status || '',
        date_from: params.dateFrom || '',
        date_to: params.dateTo || '',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search customers by email or phone
  searchCustomers: async (query) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.CUSTOMERS}/search`, {
        q: query,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update customer status
  updateCustomerStatus: async (id, status) => {
    try {
      const response = await apiService.patch(`${API_CONFIG.ENDPOINTS.CUSTOMER_UPDATE(id)}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get customer by email
  getCustomerByEmail: async (email) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.CUSTOMERS}/email/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get customer by phone
  getCustomerByPhone: async (phone) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.CUSTOMERS}/phone/${phone}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
