// Local Storage servisini import et
import { customerService } from './localStorage.js';

// Müşteri Durumları
export const CUSTOMER_STATUS = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Pasif',
  BANNED: 'Yasaklı'
};

export const customers = customerService.getAll();

// Müşteri yardımcı fonksiyonları - Local Storage servislerini kullan
export const getCustomerById = (id) => {
  return customerService.getById(id);
};

export const getCustomersByEmail = (email) => {
  return customerService.findByEmail(email);
};

export const getCustomersByName = (name) => {
  return customerService.findByName(name);
};

export const getCustomersByStatus = (status) => {
  const customers = customerService.getAll();
  return customers.filter(customer => customer.status === status);
};

export const getActiveCustomers = () => {
  return getCustomersByStatus(CUSTOMER_STATUS.ACTIVE);
};

export const getBannedCustomers = () => {
  return getCustomersByStatus(CUSTOMER_STATUS.BANNED);
};

export const canCreateReservation = (customerId) => {
  const customer = getCustomerById(customerId);
  return customer && customer.status === CUSTOMER_STATUS.ACTIVE;
};

export const updateCustomerStatus = (customerId, newStatus) => {
  const customer = getCustomerById(customerId);
  if (customer) {
    customerService.update(customerId, { status: newStatus });
    return true;
  }
  return false;
};

export const updateCustomerReservationStats = (customerId, reservationAmount) => {
  const customer = getCustomerById(customerId);
  if (customer) {
    const newStats = {
      totalReservations: customer.totalReservations + 1,
      totalSpent: customer.totalSpent + reservationAmount
    };
    customerService.update(customerId, newStats);
    return true;
  }
  return false;
};

export const updateAllCustomerStats = () => {
  // Bu fonksiyon rezervasyon verilerine göre müşteri istatistiklerini günceller
  // Şu an için boş bırakıldı, gerçek veri geldiğinde implement edilecek
};