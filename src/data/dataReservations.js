// Rezervasyon Durumları
export const RESERVATION_STATUS = {
  PENDING: 'Bekleyen',
  CONFIRMED: 'Onaylandı',
  CHECKED_IN: 'Giriş Yaptı',
  CHECKED_OUT: 'Çıkış Yaptı',
  CANCELLED: 'İptal Edildi'
};

// Ödeme Durumları
export const PAYMENT_STATUS = {
  NOT_PAID: 'Ödenmedi', // Kapora yok, kalan ödenmemiş
  PARTIAL_PAID: 'Kısmı Ödendi', // Kapora alınmış, kalan ödenmemiş
  FULL_PAID: 'Ödendi', // Kapora ve kalan tutar ödenmiş
  DEPOSIT_FORFEITED: 'Kapora Kesildi' // İptal edilen rezervasyonlarda
};

// Rezervasyon Verileri - Boş başlangıç
export const reservations = [];

// Rezervasyon yardımcı fonksiyonları
export const getReservationById = (id) => {
  return reservations.find(reservation => reservation.id === id);
};

export const getReservationsByBungalowId = (bungalowId) => {
  return reservations.filter(reservation => reservation.bungalowId === bungalowId);
};

export const getReservationsByCustomerId = (customerId) => {
  return reservations.filter(reservation => reservation.customerId === customerId);
};

export const getReservationsByStatus = (status) => {
  return reservations.filter(reservation => reservation.status === status);
};

export const getReservationsByPaymentStatus = (paymentStatus) => {
  return reservations.filter(reservation => reservation.paymentStatus === paymentStatus);
};

export const getReservationsByDateRange = (startDate, endDate) => {
  return reservations.filter(reservation => {
    const checkIn = new Date(reservation.checkInDate);
    const checkOut = new Date(reservation.checkOutDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return (checkIn >= start && checkIn <= end) || 
           (checkOut >= start && checkOut <= end) ||
           (checkIn <= start && checkOut >= end);
  });
};

export const getTodayReservations = () => {
  const today = new Date().toISOString().split('T')[0];
  return reservations.filter(reservation => 
    reservation.checkInDate === today || reservation.checkOutDate === today
  );
};

export const getUpcomingReservations = () => {
  const today = new Date().toISOString().split('T')[0];
  return reservations.filter(reservation => 
    reservation.checkInDate > today && 
    (reservation.status === RESERVATION_STATUS.PENDING || 
     reservation.status === RESERVATION_STATUS.CONFIRMED)
  );
};