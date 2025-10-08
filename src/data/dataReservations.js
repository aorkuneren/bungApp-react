// Local Storage servisini import et
import { reservationService } from './localStorage.js';

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

export const reservations = reservationService.getAll();

// Rezervasyon yardımcı fonksiyonları - Local Storage servislerini kullan
export const getReservationById = (id) => {
  return reservationService.getById(id);
};

export const getReservationByConfirmationCode = (confirmationCode) => {
  const allReservations = reservationService.getAll();
  console.log('getReservationByConfirmationCode - Aranan kod:', confirmationCode);
  console.log('getReservationByConfirmationCode - Tüm rezervasyonlar:', allReservations.map(r => ({ id: r.id, code: r.code, confirmationCode: r.confirmationCode })));
  const found = allReservations.find(reservation => reservation.confirmationCode === confirmationCode);
  console.log('getReservationByConfirmationCode - Bulunan:', found);
  return found;
};

export const getReservationsByBungalowId = (bungalowId) => {
  return reservationService.getByBungalowId(bungalowId);
};

export const getReservationsByCustomerId = (customerId) => {
  return reservationService.getByCustomerId(customerId);
};

export const getReservationsByStatus = (status) => {
  return reservationService.getByStatus(status);
};

export const getReservationsByPaymentStatus = (paymentStatus) => {
  const reservations = reservationService.getAll();
  return reservations.filter(reservation => reservation.paymentStatus === paymentStatus);
};

export const getReservationsByDateRange = (startDate, endDate) => {
  return reservationService.getByDateRange(startDate, endDate);
};

export const getTodayReservations = () => {
  const today = new Date().toISOString().split('T')[0];
  const reservations = reservationService.getAll();
  return reservations.filter(reservation => 
    reservation.checkInDate === today || reservation.checkOutDate === today
  );
};

export const getUpcomingReservations = () => {
  const today = new Date().toISOString().split('T')[0];
  const reservations = reservationService.getAll();
  return reservations.filter(reservation => 
    reservation.checkInDate > today && 
    (reservation.status === RESERVATION_STATUS.PENDING || 
     reservation.status === RESERVATION_STATUS.CONFIRMED)
  );
};