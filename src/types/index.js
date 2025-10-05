// Common types and constants for the application

// API Response Types
export const API_RESPONSE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  VALIDATION_ERROR: 'validation_error',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not_found',
  SERVER_ERROR: 'server_error',
};

// Bungalow Types
export const BUNGALOW_TYPES = {
  STANDARD: 'standard',
  DELUXE: 'deluxe',
  SUITE: 'suite',
  VILLA: 'villa',
};

export const BUNGALOW_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
  OUT_OF_ORDER: 'out_of_order',
};

// Customer Types
export const CUSTOMER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
  VIP: 'vip',
};

// Reservation Types
export const RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
  REFUNDED: 'refunded',
  FAILED: 'failed',
};

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CREDIT_CARD: 'credit_card',
  BANK_TRANSFER: 'bank_transfer',
  ONLINE: 'online',
  OTHER: 'other',
};

// User Types
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  RECEPTIONIST: 'receptionist',
  CLEANER: 'cleaner',
};

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

// Report Types
export const REPORT_TYPES = {
  REVENUE: 'revenue',
  OCCUPANCY: 'occupancy',
  CUSTOMER: 'customer',
  BUNGALOW_PERFORMANCE: 'bungalow_performance',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

export const REPORT_PERIODS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
  CUSTOM: 'custom',
};

// Date Formats
export const DATE_FORMATS = {
  API: 'YYYY-MM-DD',
  DISPLAY: 'DD/MM/YYYY',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
};

// Pagination
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PER_PAGE: 10,
  MAX_PER_PAGE: 100,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+90|0)?[5][0-9]{9}$/,
  TC_NO: /^[1-9][0-9]{10}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'Bu alan zorunludur',
  INVALID_EMAIL: 'Geçerli bir e-posta adresi girin',
  INVALID_PHONE: 'Geçerli bir telefon numarası girin',
  INVALID_TC_NO: 'Geçerli bir TC kimlik numarası girin',
  INVALID_PASSWORD: 'Şifre en az 8 karakter, büyük harf, küçük harf ve rakam içermelidir',
  PASSWORD_MISMATCH: 'Şifreler eşleşmiyor',
  FILE_TOO_LARGE: 'Dosya boyutu çok büyük (max 5MB)',
  INVALID_FILE_TYPE: 'Geçersiz dosya türü',
  NETWORK_ERROR: 'Ağ bağlantısı hatası',
  SERVER_ERROR: 'Sunucu hatası',
  UNAUTHORIZED: 'Yetkisiz erişim',
  FORBIDDEN: 'Bu işlem için yetkiniz yok',
  NOT_FOUND: 'Kayıt bulunamadı',
  VALIDATION_ERROR: 'Girilen bilgilerde hata var',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Kayıt başarıyla kaydedildi',
  UPDATED: 'Kayıt başarıyla güncellendi',
  DELETED: 'Kayıt başarıyla silindi',
  CREATED: 'Kayıt başarıyla oluşturuldu',
  LOGIN: 'Giriş başarılı',
  LOGOUT: 'Çıkış başarılı',
  PASSWORD_CHANGED: 'Şifre başarıyla değiştirildi',
  PROFILE_UPDATED: 'Profil başarıyla güncellendi',
  RESERVATION_CREATED: 'Rezervasyon başarıyla oluşturuldu',
  RESERVATION_UPDATED: 'Rezervasyon başarıyla güncellendi',
  RESERVATION_CANCELLED: 'Rezervasyon başarıyla iptal edildi',
  PAYMENT_ADDED: 'Ödeme başarıyla eklendi',
  FILE_UPLOADED: 'Dosya başarıyla yüklendi',
};

// Loading Messages
export const LOADING_MESSAGES = {
  LOADING: 'Yükleniyor...',
  SAVING: 'Kaydediliyor...',
  UPDATING: 'Güncelleniyor...',
  DELETING: 'Siliniyor...',
  CREATING: 'Oluşturuluyor...',
  LOGGING_IN: 'Giriş yapılıyor...',
  LOGGING_OUT: 'Çıkış yapılıyor...',
  UPLOADING: 'Yükleniyor...',
  PROCESSING: 'İşleniyor...',
  GENERATING: 'Oluşturuluyor...',
};
