import { apiService } from './api';
import API_CONFIG from '../config/api';

export const reservationService = {
  // Get all reservations with pagination and filters
  getReservations: async (params = {}) => {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.RESERVATIONS, {
        page: params.page || API_CONFIG.PAGINATION.DEFAULT_PAGE,
        per_page: params.perPage || API_CONFIG.PAGINATION.DEFAULT_PER_PAGE,
        search: params.search || '',
        status: params.status || '',
        payment_status: params.paymentStatus || '',
        bungalow_id: params.bungalowId || '',
        customer_id: params.customerId || '',
        date_from: params.dateFrom || '',
        date_to: params.dateTo || '',
        sort_by: params.sortBy || 'created_at',
        sort_order: params.sortOrder || 'desc',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single reservation by ID
  getReservation: async (id) => {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.RESERVATION_DETAIL(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new reservation
  createReservation: async (reservationData) => {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.RESERVATIONS, reservationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update reservation
  updateReservation: async (id, reservationData) => {
    try {
      const response = await apiService.put(API_CONFIG.ENDPOINTS.RESERVATION_UPDATE(id), reservationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete reservation
  deleteReservation: async (id) => {
    try {
      const response = await apiService.delete(API_CONFIG.ENDPOINTS.RESERVATION_DELETE(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel reservation
  cancelReservation: async (id, cancelData) => {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.RESERVATION_CANCEL(id), cancelData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Postpone reservation
  postponeReservation: async (id, postponeData) => {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.RESERVATION_POSTPONE(id), postponeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add payment to reservation
  addPayment: async (id, paymentData) => {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.RESERVATION_PAYMENT(id), paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get reservation payments
  getReservationPayments: async (id) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.RESERVATION_DETAIL(id)}/payments`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check availability for date range
  checkAvailability: async (bungalowId, checkIn, checkOut, excludeReservationId = null) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.RESERVATIONS}/check-availability`, {
        bungalow_id: bungalowId,
        check_in: checkIn,
        check_out: checkOut,
        exclude_reservation_id: excludeReservationId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Calculate reservation price
  calculatePrice: async (bungalowId, checkIn, checkOut, guestCount = 1) => {
    try {
      const response = await apiService.post(`${API_CONFIG.ENDPOINTS.RESERVATIONS}/calculate-price`, {
        bungalow_id: bungalowId,
        check_in: checkIn,
        check_out: checkOut,
        guest_count: guestCount,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get today's check-ins
  getTodayCheckIns: async () => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.RESERVATIONS}/today-checkins`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get today's check-outs
  getTodayCheckOuts: async () => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.RESERVATIONS}/today-checkouts`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get upcoming reservations
  getUpcomingReservations: async (days = 7) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.RESERVATIONS}/upcoming`, {
        days,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update reservation status
  updateReservationStatus: async (id, status) => {
    try {
      const response = await apiService.patch(`${API_CONFIG.ENDPOINTS.RESERVATION_UPDATE(id)}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Generate reservation code
  generateReservationCode: async () => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.RESERVATIONS}/generate-code`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
