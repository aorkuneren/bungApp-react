// API Configuration - Frontend Only Mode
const API_CONFIG = {
  // Frontend-only mode - no backend API
  BASE_URL: null,
  
  // API Endpoints - Disabled for frontend-only mode
  ENDPOINTS: {
    // All endpoints disabled for frontend-only mode
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
