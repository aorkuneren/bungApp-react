// Uygulama sabitleri
export const APP_CONFIG = {
  NAME: 'BungApp',
  VERSION: '1.0.0',
  ITEMS_PER_PAGE: 10,
  MAX_VISIBLE_PAGES: 5,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 4000,
  API_TIMEOUT: 10000
};

// Durum sabitleri
export const STATUS = {
  RESERVATION: {
    PENDING: 'Bekleyen',
    CONFIRMED: 'Onaylandı',
    CHECKED_IN: 'Giriş Yaptı',
    CHECKED_OUT: 'Çıkış Yaptı',
    CANCELLED: 'İptal Edildi'
  },
  PAYMENT: {
    UNPAID: 'Ödenmedi',
    PARTIAL: 'Kısmı Ödendi',
    PAID: 'Ödendi',
    DEPOSIT: 'Kapora Kesildi'
  },
  CUSTOMER: {
    ACTIVE: 'Aktif',
    INACTIVE: 'Pasif',
    BANNED: 'Yasaklı'
  },
  BUNGALOW: {
    ACTIVE: 'Aktif',
    INACTIVE: 'Pasif',
    MAINTENANCE: 'Bakımda'
  }
};

// Renk paleti
export const COLORS = {
  primary: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  }
};

// Yerel depolama anahtarları
export const STORAGE_KEYS = {
  CUSTOMERS: 'bungalow_customers',
  BUNGALOWS: 'bungalow_bungalows',
  RESERVATIONS: 'bungalow_reservations',
  USER: 'bungalow_user',
  SETTINGS: 'appSettings'
};

// Form validasyon kuralları
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+90|0)?[5][0-9]{9}$/,
  TC_NUMBER: /^[1-9][0-9]{10}$/,
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 500
};

// Tarih formatları
export const DATE_FORMATS = {
  DISPLAY: 'DD MMMM YYYY',
  INPUT: 'YYYY-MM-DD',
  DATETIME: 'DD MMMM YYYY HH:mm',
  TIME: 'HH:mm'
};

// Sayfa başlıkları
export const PAGE_TITLES = {
  DASHBOARD: 'Dashboard',
  BUNGALOWS: 'Bungalov Yönetimi',
  RESERVATIONS: 'Rezervasyon Yönetimi',
  CUSTOMERS: 'Müşteri Yönetimi',
  REPORTS: 'Raporlar',
  SETTINGS: 'Ayarlar',
  PROFILE: 'Profil'
};
