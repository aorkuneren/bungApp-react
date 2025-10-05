// BungApp Veri Yönetimi - Ana Dosya
// Tüm uygulama verileri bu dosyadan yönetilir

// Parçalanmış veri dosyalarını import et
import { 
  customers, 
  CUSTOMER_STATUS,
  getCustomerById, 
  getCustomersByEmail, 
  getCustomersByName,
  getCustomersByStatus,
  getActiveCustomers,
  getBannedCustomers,
  canCreateReservation,
  updateCustomerStatus,
  updateCustomerReservationStats,
  updateAllCustomerStats
} from './dataCustomers.js';
import { 
  bungalows, 
  BUNGALOW_STATUS, 
  getBungalowById, 
  getBungalowsByStatus, 
  getBungalowsByCapacity, 
  getBungalowsByPriceRange 
} from './dataBungalows.js';
import { 
  reservations, 
  RESERVATION_STATUS, 
  PAYMENT_STATUS, 
  getReservationById, 
  getReservationsByBungalowId, 
  getReservationsByCustomerId, 
  getReservationsByStatus, 
  getReservationsByPaymentStatus, 
  getReservationsByDateRange, 
  getTodayReservations, 
  getUpcomingReservations 
} from './dataReservations.js';

// Tüm verileri export et
export { customers, bungalows, reservations };
export { CUSTOMER_STATUS, BUNGALOW_STATUS, RESERVATION_STATUS, PAYMENT_STATUS };

// Tüm yardımcı fonksiyonları export et
export { 
  getCustomerById, 
  getCustomersByEmail, 
  getCustomersByName,
  getCustomersByStatus,
  getActiveCustomers,
  getBannedCustomers,
  canCreateReservation,
  updateCustomerStatus,
  updateCustomerReservationStats,
  updateAllCustomerStats,
  getBungalowById, 
  getBungalowsByStatus, 
  getBungalowsByCapacity, 
  getBungalowsByPriceRange,
  getReservationById, 
  getReservationsByBungalowId, 
  getReservationsByCustomerId, 
  getReservationsByStatus, 
  getReservationsByPaymentStatus, 
  getReservationsByDateRange, 
  getTodayReservations, 
  getUpcomingReservations 
};

// Fiyat hesaplama fonksiyonları
export const calculateTotalPrice = (bungalowId, checkInDate, checkOutDate) => {
  const bungalow = getBungalowById(bungalowId);
  if (!bungalow) return 0;
  
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  
  return bungalow.dailyPrice * nights;
};

export const calculateNights = (checkInDate, checkOutDate) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
};

// Rezervasyon kodu oluştur
export const generateReservationCode = () => {
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;
  return `RES-${randomNumber}`;
};

// Durum istatistikleri
export const getStatusStats = () => {
  const bungalowStats = {
    total: bungalows.length,
    active: bungalows.filter(b => b.status === BUNGALOW_STATUS.ACTIVE).length,
    inactive: bungalows.filter(b => b.status === BUNGALOW_STATUS.INACTIVE).length,
    maintenance: bungalows.filter(b => b.status === BUNGALOW_STATUS.MAINTENANCE).length
  };

  const reservationStats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === RESERVATION_STATUS.PENDING).length,
    confirmed: reservations.filter(r => r.status === RESERVATION_STATUS.CONFIRMED).length,
    checkedIn: reservations.filter(r => r.status === RESERVATION_STATUS.CHECKED_IN).length,
    checkedOut: reservations.filter(r => r.status === RESERVATION_STATUS.CHECKED_OUT).length,
    cancelled: reservations.filter(r => r.status === RESERVATION_STATUS.CANCELLED).length
  };

  const customerStats = {
    total: customers.length,
    active: customers.filter(c => c.status === CUSTOMER_STATUS.ACTIVE).length,
    inactive: customers.filter(c => c.status === CUSTOMER_STATUS.INACTIVE).length,
    banned: customers.filter(c => c.status === CUSTOMER_STATUS.BANNED).length,
    totalReservations: customers.reduce((sum, c) => sum + c.totalReservations, 0),
    totalRevenue: reservations.reduce((sum, r) => sum + r.totalPrice, 0)
  };

  return {
    bungalows: bungalowStats,
    reservations: reservationStats,
    customers: customerStats
  };
};

// Tarih formatı
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Para formatı
export const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(price);
};

// Müşteri rezervasyon istatistiklerini güncelle
updateAllCustomerStats(reservations);

// Ortak Badge Fonksiyonları - Tüm sayfalarda tutarlı renkler için
export const getReservationStatusBadge = (status) => {
  const statusConfig = {
    'Bekleyen': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Onaylandı': 'bg-green-100 text-green-800 border-green-200',
    'Giriş Yaptı': 'bg-blue-100 text-blue-800 border-blue-200',
    'Çıkış Yaptı': 'bg-gray-100 text-gray-800 border-gray-200',
    'İptal Edildi': 'bg-red-100 text-red-800 border-red-200'
  };
  
  return (
    <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 text-xs transition-[color,box-shadow] overflow-hidden ${statusConfig[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
      {status}
    </span>
  );
};

export const getPaymentStatusBadge = (status) => {
  const paymentConfig = {
    'Ödenmedi': 'bg-red-100 text-red-800 border-red-200',
    'Kısmı Ödendi': 'bg-orange-100 text-orange-800 border-orange-200',
    'Ödendi': 'bg-green-100 text-green-800 border-green-200',
    'Kapora Kesildi': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  
  return (
    <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 text-xs transition-[color,box-shadow] overflow-hidden ${paymentConfig[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
      {status}
    </span>
  );
};

export const getCustomerStatusBadge = (status) => {
  const statusConfig = {
    'Aktif': 'bg-green-100 text-green-800 border-green-200',
    'Pasif': 'bg-gray-100 text-gray-800 border-gray-200',
    'Yasaklı': 'bg-red-100 text-red-800 border-red-200'
  };
  
  return (
    <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 text-xs transition-[color,box-shadow] overflow-hidden ${statusConfig[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
      {status}
    </span>
  );
};