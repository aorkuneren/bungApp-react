import axios from 'axios';
import API_CONFIG from '../config/api';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          // Unauthorized - Clear token and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          toast.error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
          break;
          
        case 403:
          toast.error('Bu işlem için yetkiniz bulunmuyor.');
          break;
          
        case 404:
          toast.error('Aranan kayıt bulunamadı.');
          break;
          
        case 422:
          // Validation errors
          if (data.errors) {
            const firstError = Object.values(data.errors)[0];
            toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
          } else {
            toast.error('Girilen bilgilerde hata var.');
          }
          break;
          
        case 500:
          toast.error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
          break;
          
        default:
          toast.error(data.message || 'Bir hata oluştu.');
      }
    } else if (error.request) {
      // Network error
      toast.error('Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.');
    } else {
      toast.error('Beklenmeyen bir hata oluştu.');
    }
    
    return Promise.reject(error);
  }
);

// API Service Methods
export const apiService = {
  // Generic CRUD operations
  get: (url, params = {}) => api.get(url, { params }),
  post: (url, data = {}) => api.post(url, data),
  put: (url, data = {}) => api.put(url, data),
  patch: (url, data = {}) => api.patch(url, data),
  delete: (url) => api.delete(url),
  
  // File upload
  upload: (url, formData, onProgress = null) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    });
  },
  
  // Download file
  download: (url, filename) => {
    return api.get(url, {
      responseType: 'blob',
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    });
  },
};

export default api;
