import { apiService } from './api';
import API_CONFIG from '../config/api';

export const settingsService = {
  // Genel ayarları getir
  getGeneralSettings: async () => {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.SETTINGS);
      return response.data;
    } catch (error) {
      console.error('Genel ayarlar getirilemedi:', error);
      throw error;
    }
  },

  // Genel ayarları güncelle
  updateGeneralSettings: async (settings) => {
    try {
      const response = await apiService.put(API_CONFIG.ENDPOINTS.SETTINGS_GENERAL, settings);
      return response.data;
    } catch (error) {
      console.error('Genel ayarlar güncellenemedi:', error);
      throw error;
    }
  },

  // Bildirim ayarlarını getir
  getNotificationSettings: async () => {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.SETTINGS_NOTIFICATIONS);
      return response.data;
    } catch (error) {
      console.error('Bildirim ayarları getirilemedi:', error);
      throw error;
    }
  },

  // Bildirim ayarlarını güncelle
  updateNotificationSettings: async (settings) => {
    try {
      const response = await apiService.put(API_CONFIG.ENDPOINTS.SETTINGS_NOTIFICATIONS, settings);
      return response.data;
    } catch (error) {
      console.error('Bildirim ayarları güncellenemedi:', error);
      throw error;
    }
  },

  // Güvenlik ayarlarını getir
  getSecuritySettings: async () => {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.SETTINGS_SECURITY);
      return response.data;
    } catch (error) {
      console.error('Güvenlik ayarları getirilemedi:', error);
      throw error;
    }
  },

  // Güvenlik ayarlarını güncelle
  updateSecuritySettings: async (settings) => {
    try {
      const response = await apiService.put(API_CONFIG.ENDPOINTS.SETTINGS_SECURITY, settings);
      return response.data;
    } catch (error) {
      console.error('Güvenlik ayarları güncellenemedi:', error);
      throw error;
    }
  },

  // Rezervasyon ayarlarını getir
  getReservationSettings: async () => {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.SETTINGS_RESERVATIONS);
      return response.data;
    } catch (error) {
      console.error('Rezervasyon ayarları getirilemedi:', error);
      throw error;
    }
  },

  // Rezervasyon ayarlarını güncelle
  updateReservationSettings: async (settings) => {
    try {
      const response = await apiService.put(API_CONFIG.ENDPOINTS.SETTINGS_RESERVATIONS, settings);
      return response.data;
    } catch (error) {
      console.error('Rezervasyon ayarları güncellenemedi:', error);
      throw error;
    }
  },

  // Ödeme ayarlarını getir
  getPaymentSettings: async () => {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.SETTINGS_PAYMENTS);
      return response.data;
    } catch (error) {
      console.error('Ödeme ayarları getirilemedi:', error);
      throw error;
    }
  },

  // Ödeme ayarlarını güncelle
  updatePaymentSettings: async (settings) => {
    try {
      const response = await apiService.put(API_CONFIG.ENDPOINTS.SETTINGS_PAYMENTS, settings);
      return response.data;
    } catch (error) {
      console.error('Ödeme ayarları güncellenemedi:', error);
      throw error;
    }
  },

  // Tüm ayarları getir
  getAllSettings: async () => {
    try {
      const [general, notifications, security, reservations, payments] = await Promise.all([
        settingsService.getGeneralSettings(),
        settingsService.getNotificationSettings(),
        settingsService.getSecuritySettings(),
        settingsService.getReservationSettings(),
        settingsService.getPaymentSettings()
      ]);

      return {
        general,
        notifications,
        security,
        reservations,
        payments
      };
    } catch (error) {
      console.error('Tüm ayarlar getirilemedi:', error);
      throw error;
    }
  }
};
