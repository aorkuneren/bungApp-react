// API Configuration
const API_CONFIG = {
  // Base URL for Laravel backend
  BASE_URL: process.env.REACT_APP_API_URL || 'https://demo.aorkuneren.com',
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    
    // Bungalows
    BUNGALOWS: '/bungalows',
    BUNGALOW_DETAIL: (id) => `/bungalows/${id}`,
    BUNGALOW_UPDATE: (id) => `/bungalows/${id}`,
    BUNGALOW_DELETE: (id) => `/bungalows/${id}`,
    
    // Customers
    CUSTOMERS: '/customers',
    CUSTOMER_DETAIL: (id) => `/customers/${id}`,
    CUSTOMER_UPDATE: (id) => `/customers/${id}`,
    CUSTOMER_DELETE: (id) => `/customers/${id}`,
    
    // Reservations
    RESERVATIONS: '/reservations',
    RESERVATION_DETAIL: (id) => `/reservations/${id}`,
    RESERVATION_UPDATE: (id) => `/reservations/${id}`,
    RESERVATION_DELETE: (id) => `/reservations/${id}`,
    RESERVATION_CANCEL: (id) => `/reservations/${id}/cancel`,
    RESERVATION_POSTPONE: (id) => `/reservations/${id}/postpone`,
    RESERVATION_PAYMENT: (id) => `/reservations/${id}/payment`,
    
    // Reports
    REPORTS: '/reports',
    DASHBOARD_STATS: '/reports/dashboard',
    REVENUE_REPORT: '/reports/revenue',
    OCCUPANCY_REPORT: '/reports/occupancy',
    
    // Settings
    SETTINGS: '/settings',
    SETTINGS_GENERAL: '/test-settings-api.php/settings/general',
    SETTINGS_NOTIFICATIONS: '/test-settings-api.php/settings/notifications',
    SETTINGS_SECURITY: '/test-settings-api.php/settings/security',
    SETTINGS_RESERVATIONS: '/test-settings-api.php/settings/reservations',
    SETTINGS_PAYMENTS: '/test-settings-api.php/settings/payments',
    PROFILE_UPDATE: '/profile/update',
    PASSWORD_CHANGE: '/profile/password',
  },
  
  // Request timeout (milliseconds)
  TIMEOUT: 10000,
  
  // Retry configuration
  RETRY: {
    ATTEMPTS: 3,
    DELAY: 1000,
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_PER_PAGE: 10,
    MAX_PER_PAGE: 100,
  },
};

export default API_CONFIG;
