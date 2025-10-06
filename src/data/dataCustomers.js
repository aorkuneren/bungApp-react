// Müşteri Durumları
export const CUSTOMER_STATUS = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Pasif',
  BANNED: 'Yasaklı'
};

// Müşteri Verileri - Boş başlangıç
export const customers = [];

// Müşteri yardımcı fonksiyonları
export const getCustomerById = (id) => {
  return customers.find(customer => customer.id === id);
};

export const getCustomersByEmail = (email) => {
  return customers.filter(customer => 
    customer.email.toLowerCase().includes(email.toLowerCase())
  );
};

export const getCustomersByName = (name) => {
  return customers.filter(customer => 
    customer.firstName.toLowerCase().includes(name.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(name.toLowerCase()) ||
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(name.toLowerCase())
  );
};

export const getCustomersByStatus = (status) => {
  return customers.filter(customer => customer.status === status);
};

export const getActiveCustomers = () => {
  return customers.filter(customer => customer.status === CUSTOMER_STATUS.ACTIVE);
};

export const getBannedCustomers = () => {
  return customers.filter(customer => customer.status === CUSTOMER_STATUS.BANNED);
};

export const canCreateReservation = (customerId) => {
  const customer = getCustomerById(customerId);
  return customer && customer.status === CUSTOMER_STATUS.ACTIVE;
};

export const updateCustomerStatus = (customerId, newStatus) => {
  const customer = getCustomerById(customerId);
  if (customer) {
    customer.status = newStatus;
    return true;
  }
  return false;
};

export const updateCustomerReservationStats = (customerId, reservationAmount) => {
  const customer = getCustomerById(customerId);
  if (customer) {
    customer.totalReservations += 1;
    customer.totalSpent += reservationAmount;
    return true;
  }
  return false;
};

export const updateAllCustomerStats = () => {
  // Bu fonksiyon rezervasyon verilerine göre müşteri istatistiklerini günceller
  // Şu an için boş bırakıldı, gerçek veri geldiğinde implement edilecek
};