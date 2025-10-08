// BungApp Veri Yönetimi - Ana Dosya
// Tüm uygulama verileri bu dosyadan yönetilir

// Local Storage servislerini import et
import { 
  customerService, 
  bungalowService, 
  reservationService, 
  loadDemoData, 
  hasData 
} from './localStorage.js';

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
  getReservationByConfirmationCode,
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

// Local Storage servislerini export et
export { customerService, bungalowService, reservationService, loadDemoData, hasData };

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
  getReservationByConfirmationCode,
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
  
  const nights = calculateNights(checkInDate, checkOutDate);
  
  // Temel fiyat hesaplama
  let basePrice = bungalow.dailyPrice * nights;
  
  // Fiyat kurallarını uygula
  const settings = getSettings();
  basePrice = applyPricingRules(basePrice, checkInDate, checkOutDate, settings);
  
  return basePrice;
};

export const calculateNights = (checkInDate, checkOutDate) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  
  // Otel mantığı: giriş günü gece sayılır, çıkış günü sayılmaz
  // 7 Ekim - 14 Ekim = 7 gece (7,8,9,10,11,12,13 Ekim geceleri)
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  return daysDiff;
};

// Fiyat kurallarını uygula
export const applyPricingRules = (basePrice, checkInDate, checkOutDate, settings) => {
  let finalPrice = basePrice;
  
  // Hafta sonu fiyatlandırması
  if (settings.weekendPricing?.enabled) {
    const weekendNights = getWeekendNights(checkInDate, checkOutDate);
    if (weekendNights > 0) {
      const weekendPrice = calculateWeekendPrice(basePrice, weekendNights, settings.weekendPricing, checkInDate, checkOutDate);
      finalPrice += weekendPrice;
    }
  }
  
  // Erken rezervasyon indirimi
  if (settings.earlyBirdDiscount?.enabled) {
    const daysBefore = getDaysBeforeCheckIn(checkInDate);
    if (daysBefore >= settings.earlyBirdDiscount.daysBefore) {
      const discount = (finalPrice * settings.earlyBirdDiscount.percentage) / 100;
      finalPrice -= discount;
    }
  }
  
  // Son dakika indirimi
  if (settings.lastMinuteDiscount?.enabled) {
    const daysBefore = getDaysBeforeCheckIn(checkInDate);
    if (daysBefore <= settings.lastMinuteDiscount.daysBefore) {
      const discount = (finalPrice * settings.lastMinuteDiscount.percentage) / 100;
      finalPrice -= discount;
    }
  }
  
  return Math.max(0, Math.round(finalPrice)); // Negatif fiyat olmasın
};

// Hafta sonu gece sayısını hesapla
export const getWeekendNights = (checkInDate, checkOutDate) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  let weekendNights = 0;
  
  for (let date = new Date(checkIn); date < checkOut; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Pazar (0) veya Cumartesi (6)
      weekendNights++;
    }
  }
  
  return weekendNights;
};

// Hafta sonu fiyatını hesapla
export const calculateWeekendPrice = (basePrice, weekendNights, weekendPricing, checkInDate, checkOutDate) => {
  const totalNights = getTotalNights(checkInDate, checkOutDate);
  const baseNightPrice = basePrice / (totalNights || 1);
  
  if (weekendPricing.type === 'percentage') {
    return (baseNightPrice * weekendNights * weekendPricing.value) / 100;
  } else {
    return weekendNights * weekendPricing.value;
  }
};

// Toplam gece sayısını hesapla
export const getTotalNights = (checkInDate, checkOutDate) => {
  return calculateNights(checkInDate, checkOutDate);
};

// Check-in'den kaç gün önce olduğunu hesapla
export const getDaysBeforeCheckIn = (checkInDate) => {
  const checkIn = new Date(checkInDate);
  const today = new Date();
  const timeDiff = checkIn.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
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
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Gecelik fiyat formatı
export const formatNightlyPrice = (price) => {
  return `${formatPrice(price)}/gece`;
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

// Settings management functions
export const getSettings = () => {
  const savedSettings = localStorage.getItem('appSettings');
  return savedSettings ? JSON.parse(savedSettings) : {
    // Default settings
    defaultCheckInTime: '14:00',
    defaultCheckOutTime: '11:00',
    minimumStayDays: 1,
    breakfastFee: 0,
    breakfastEnabled: false,
    maintenanceMode: false,
    backupFrequency: 'daily',
    logRetention: 30,
    reservationApprovalType: 'manual',
    defaultDepositAmount: 500,
    cancellationRules: {
      pending: { enabled: true, daysAfter: 1 },
      confirmed: { enabled: true, daysAfter: 1 },
      checkedIn: { enabled: false, daysAfter: 0 }
    },
    notificationSettings: {
      newReservation: { enabled: false, email: true },
      cancellation: { enabled: false, email: true },
      postponement: { enabled: false, email: true }
    },
    weekendPricing: {
      enabled: false,
      type: 'percentage',
      value: 20
    },
    earlyBirdDiscount: {
      enabled: false,
      percentage: 5,
      daysBefore: 30
    },
    lastMinuteDiscount: {
      enabled: false,
      percentage: 10,
      daysBefore: 7
    },
    emailTemplates: {
      enabled: false,
      reservationConfirmation: {
        enabled: false,
        subject: 'Rezervasyon Onayı - {reservationCode}',
        template: 'Sayın {customerName},\n\nRezervasyonunuz onaylanmıştır.\n\nRezervasyon Detayları:\n- Rezervasyon Kodu: {reservationCode}\n- Bungalov: {bungalowName}\n- Giriş: {checkInDate}\n- Çıkış: {checkOutDate}\n- Toplam Tutar: {totalPrice}\n\nİyi günler dileriz.'
      },
      reminderMessage: {
        enabled: false,
        subject: 'Rezervasyon Hatırlatması - {reservationCode}',
        template: 'Sayın {customerName},\n\nRezervasyonunuzu hatırlatmak isteriz.\n\nRezervasyon Detayları:\n- Rezervasyon Kodu: {reservationCode}\n- Bungalov: {bungalowName}\n- Giriş: {checkInDate}\n- Çıkış: {checkOutDate}\n\nİyi günler dileriz.'
      },
      thankYouEmail: {
        enabled: false,
        subject: 'Teşekkür E-postası - {reservationCode}',
        template: 'Sayın {customerName},\n\nRezervasyonunuz için teşekkür ederiz.\n\nRezervasyon Detayları:\n- Rezervasyon Kodu: {reservationCode}\n- Bungalov: {bungalowName}\n- Giriş: {checkInDate}\n- Çıkış: {checkOutDate}\n\nTekrar görüşmek üzere!'
      }
    },
    smsProvider: {
      enabled: false,
      provider: 'netgsm',
      apiKey: '',
      senderName: 'BungApp'
    },
    whatsappIntegration: {
      enabled: true,
      phoneNumber: '',
      businessName: 'BungApp',
      confirmationMessage: 'Merhaba {customerName},\n\nRezervasyonunuz için onay linki:\n\n{confirmationLink}\n\nBu link 24 saat geçerlidir. Lütfen kapora ödemesini yaparak rezervasyonunuzu onaylayın.\n\nRezervasyon Detayları:\n- Bungalov: {bungalowName}\n- Giriş: {checkInDate}\n- Çıkış: {checkOutDate}\n- Toplam Tutar: {totalPrice}\n- Kapora: {depositAmount}\n\nİyi günler!'
    }
  };
};

export const saveSettings = (newSettings) => {
  localStorage.setItem('appSettings', JSON.stringify(newSettings));
};

// Rezervasyon onay süresi kontrolü ve otomatik iptal
export const checkExpiredReservations = () => {
  const allReservations = reservationService.getAll();
  const now = new Date();
  
  allReservations.forEach(reservation => {
    if (reservation.confirmationExpiresAt && 
        reservation.status === 'Bekleyen' && 
        new Date(reservation.confirmationExpiresAt) < now) {
      
      // Rezervasyonu iptal et
      reservationService.update(reservation.id, {
        ...reservation,
        status: 'İptal Edildi',
        cancelledAt: now.toISOString(),
        cancellationReason: 'Onay süresi doldu',
        updatedAt: now.toISOString()
      });
      
      console.log(`Rezervasyon otomatik iptal edildi: ${reservation.code}`);
    }
  });
};

// Uygulama başlatıldığında süresi dolmuş rezervasyonları kontrol et
checkExpiredReservations();

// Her 5 dakikada bir kontrol et
setInterval(checkExpiredReservations, 5 * 60 * 1000);