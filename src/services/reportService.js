import { apiService } from './api';
import API_CONFIG from '../config/api';

export const reportService = {
  // Get dashboard statistics
  getDashboardStats: async (params = {}) => {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.DASHBOARD_STATS, {
        date_from: params.dateFrom || '',
        date_to: params.dateTo || '',
        period: params.period || 'month', // day, week, month, year
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get revenue report
  getRevenueReport: async (params = {}) => {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.REVENUE_REPORT, {
        date_from: params.dateFrom || '',
        date_to: params.dateTo || '',
        period: params.period || 'month',
        bungalow_id: params.bungalowId || '',
        group_by: params.groupBy || 'month', // day, week, month, year
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get occupancy report
  getOccupancyReport: async (params = {}) => {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.OCCUPANCY_REPORT, {
        date_from: params.dateFrom || '',
        date_to: params.dateTo || '',
        bungalow_id: params.bungalowId || '',
        group_by: params.groupBy || 'month',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get customer report
  getCustomerReport: async (params = {}) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.REPORTS}/customers`, {
        date_from: params.dateFrom || '',
        date_to: params.dateTo || '',
        sort_by: params.sortBy || 'total_reservations',
        sort_order: params.sortOrder || 'desc',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get bungalow performance report
  getBungalowPerformanceReport: async (params = {}) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.REPORTS}/bungalows`, {
        date_from: params.dateFrom || '',
        date_to: params.dateTo || '',
        sort_by: params.sortBy || 'revenue',
        sort_order: params.sortOrder || 'desc',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get monthly statistics
  getMonthlyStats: async (year, month) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.REPORTS}/monthly`, {
        year,
        month,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get yearly statistics
  getYearlyStats: async (year) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.REPORTS}/yearly`, {
        year,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get reservation status distribution
  getReservationStatusDistribution: async (params = {}) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.REPORTS}/reservation-status`, {
        date_from: params.dateFrom || '',
        date_to: params.dateTo || '',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payment status distribution
  getPaymentStatusDistribution: async (params = {}) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.REPORTS}/payment-status`, {
        date_from: params.dateFrom || '',
        date_to: params.dateTo || '',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Export report to Excel
  exportReport: async (reportType, params = {}) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.REPORTS}/export/${reportType}`, {
        ...params,
        format: 'excel',
      });
      
      // Download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Export report to PDF
  exportReportPDF: async (reportType, params = {}) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.REPORTS}/export/${reportType}`, {
        ...params,
        format: 'pdf',
      });
      
      // Download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get comparison data (year over year, month over month)
  getComparisonData: async (type, params = {}) => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.REPORTS}/comparison/${type}`, {
        date_from: params.dateFrom || '',
        date_to: params.dateTo || '',
        compare_with: params.compareWith || 'previous_period',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
