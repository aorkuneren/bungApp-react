import { apiService } from './api';
import API_CONFIG from '../config/api';

export const bungalowService = {
  // Get all bungalows with pagination and filters
  getBungalows: async (params = {}) => {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.BUNGALOWS, {
        page: params.page || API_CONFIG.PAGINATION.DEFAULT_PAGE,
        per_page: params.perPage || API_CONFIG.PAGINATION.DEFAULT_PER_PAGE,
        search: params.search || '',
        status: params.status || '',
        capacity: params.capacity || '',
        min_price: params.minPrice || '',
        max_price: params.maxPrice || '',
        sort_by: params.sortBy || 'created_at',
        sort_order: params.sortOrder || 'desc',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single bungalow by ID
  getBungalow: async (id) => {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.BUNGALOW_DETAIL(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new bungalow
  createBungalow: async (bungalowData) => {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.BUNGALOWS, bungalowData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update bungalow
  updateBungalow: async (id, bungalowData) => {
    try {
      const response = await apiService.put(API_CONFIG.ENDPOINTS.BUNGALOW_UPDATE(id), bungalowData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete bungalow
  deleteBungalow: async (id) => {
    try {
      const response = await apiService.delete(API_CONFIG.ENDPOINTS.BUNGALOW_DELETE(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get bungalow statistics
  getBungalowStats: async (id) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.BUNGALOW_DETAIL(id)}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get bungalow reservations
  getBungalowReservations: async (id, params = {}) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.BUNGALOW_DETAIL(id)}/reservations`, {
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

  // Check bungalow availability
  checkAvailability: async (id, checkIn, checkOut) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.BUNGALOW_DETAIL(id)}/availability`, {
        check_in: checkIn,
        check_out: checkOut,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get bungalow calendar
  getBungalowCalendar: async (id, year, month) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.BUNGALOW_DETAIL(id)}/calendar`, {
        year,
        month,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
