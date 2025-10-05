// Müşteri Durumları
export const CUSTOMER_STATUS = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Pasif',
  BANNED: 'Yasaklı'
};

// Müşteri Verileri - Gerçek veri niteliği taşıyan demo müşteriler
export const customers = [
  {
    id: 1,
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet.yilmaz@gmail.com',
    phone: '+90 532 123 45 67',
    tcNumber: '12345678901',
    status: CUSTOMER_STATUS.ACTIVE,
    registrationDate: '2024-01-15',
    totalReservations: 0,
    totalSpent: 0
  },
  {
    id: 2,
    firstName: 'Ayşe',
    lastName: 'Demir',
    email: 'ayse.demir@hotmail.com',
    phone: '+90 533 234 56 78',
    tcNumber: '23456789012',
    status: CUSTOMER_STATUS.ACTIVE,
    registrationDate: '2024-02-10',
    totalReservations: 0,
    totalSpent: 0
  },
  {
    id: 3,
    firstName: 'Mehmet',
    lastName: 'Kaya',
    email: 'mehmet.kaya@yahoo.com',
    phone: '+90 534 345 67 89',
    tcNumber: '34567890123',
    status: CUSTOMER_STATUS.INACTIVE,
    registrationDate: '2024-03-05',
    totalReservations: 0,
    totalSpent: 0
  },
  {
    id: 4,
    firstName: 'Fatma',
    lastName: 'Özkan',
    email: 'fatma.ozkan@gmail.com',
    phone: '+90 535 456 78 90',
    tcNumber: '45678901234',
    status: CUSTOMER_STATUS.ACTIVE,
    registrationDate: '2024-04-12',
    totalReservations: 0,
    totalSpent: 0
  },
  {
    id: 5,
    firstName: 'Ali',
    lastName: 'Çelik',
    email: 'ali.celik@outlook.com',
    phone: '+90 536 567 89 01',
    tcNumber: '56789012345',
    status: CUSTOMER_STATUS.BANNED,
    registrationDate: '2024-05-20',
    totalReservations: 0,
    totalSpent: 0
  },
  {
    id: 6,
    firstName: 'Zeynep',
    lastName: 'Arslan',
    email: 'zeynep.arslan@gmail.com',
    phone: '+90 537 678 90 12',
    tcNumber: '67890123456',
    status: CUSTOMER_STATUS.ACTIVE,
    registrationDate: '2024-06-15',
    totalReservations: 0,
    totalSpent: 0
  },
  {
    id: 7,
    firstName: 'Mustafa',
    lastName: 'Şahin',
    email: 'mustafa.sahin@hotmail.com',
    phone: '+90 538 789 01 23',
    tcNumber: '78901234567',
    status: CUSTOMER_STATUS.ACTIVE,
    registrationDate: '2024-07-08',
    totalReservations: 0,
    totalSpent: 0
  },
  {
    id: 8,
    firstName: 'Elif',
    lastName: 'Doğan',
    email: 'elif.dogan@yahoo.com',
    phone: '+90 539 890 12 34',
    tcNumber: '89012345678',
    status: CUSTOMER_STATUS.INACTIVE,
    registrationDate: '2024-08-22',
    totalReservations: 0,
    totalSpent: 0
  },
  {
    id: 9,
    firstName: 'Emre',
    lastName: 'Yıldız',
    email: 'emre.yildiz@gmail.com',
    phone: '+90 540 901 23 45',
    tcNumber: '90123456789',
    status: CUSTOMER_STATUS.ACTIVE,
    registrationDate: '2024-09-10',
    totalReservations: 0,
    totalSpent: 0
  },
  {
    id: 10,
    firstName: 'Selin',
    lastName: 'Koç',
    email: 'selin.koc@outlook.com',
    phone: '+90 541 012 34 56',
    tcNumber: '01234567890',
    status: CUSTOMER_STATUS.BANNED,
    registrationDate: '2024-10-05',
    totalReservations: 0,
    totalSpent: 0
  },
  {
    id: 11,
    firstName: 'Burak',
    lastName: 'Aydın',
    email: 'burak.aydin@gmail.com',
    phone: '+90 542 123 45 67',
    tcNumber: '11223344556',
    status: CUSTOMER_STATUS.ACTIVE,
    registrationDate: '2024-11-12',
    totalReservations: 0,
    totalSpent: 0
  },
  {
    id: 12,
    firstName: 'Gamze',
    lastName: 'Polat',
    email: 'gamze.polat@hotmail.com',
    phone: '+90 543 234 56 78',
    tcNumber: '22334455667',
    status: CUSTOMER_STATUS.ACTIVE,
    registrationDate: '2024-12-01',
    totalReservations: 0,
    totalSpent: 0
  },
  {
    id: 13,
    firstName: 'Okan',
    lastName: 'Türk',
    email: 'okan.turk@yahoo.com',
    phone: '+90 544 345 67 89',
    tcNumber: '33445566778',
    status: CUSTOMER_STATUS.INACTIVE,
    registrationDate: '2025-01-15',
    totalReservations: 0,
    totalSpent: 0
  },
  {
    id: 14,
    firstName: 'Deniz',
    lastName: 'Kurt',
    email: 'deniz.kurt@gmail.com',
    phone: '+90 545 456 78 90',
    tcNumber: '44556677889',
    status: CUSTOMER_STATUS.ACTIVE,
    registrationDate: '2025-02-20',
    totalReservations: 0,
    totalSpent: 0
  },
  {
    id: 15,
    firstName: 'Cem',
    lastName: 'Özdemir',
    email: 'cem.ozdemir@outlook.com',
    phone: '+90 546 567 89 01',
    tcNumber: '55667788990',
    status: CUSTOMER_STATUS.ACTIVE,
    registrationDate: '2025-03-10',
    totalReservations: 0,
    totalSpent: 0
  }
];

// Müşteri yardımcı fonksiyonları
export const getCustomerById = (id) => {
  return customers.find(customer => customer.id === id);
};

export const getCustomersByEmail = (email) => {
  return customers.filter(customer => customer.email.toLowerCase().includes(email.toLowerCase()));
};

export const getCustomersByName = (name) => {
  return customers.filter(customer => 
    (customer.firstName + ' ' + customer.lastName).toLowerCase().includes(name.toLowerCase())
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
  return customer && customer.status !== CUSTOMER_STATUS.BANNED;
};

export const updateCustomerStatus = (customerId, newStatus) => {
  const customer = getCustomerById(customerId);
  if (customer) {
    customer.status = newStatus;
    return customer;
  }
  return null;
};

export const updateCustomerReservationStats = (customerId) => {
  const customer = getCustomerById(customerId);
  if (customer) {
    // Bu fonksiyon dataReservations.js'den gelecek rezervasyon verilerine göre güncellenecek
    // Şimdilik placeholder olarak bırakıldı
    return customer;
  }
  return null;
};

// Tüm müşteri rezervasyon istatistiklerini güncelle
export const updateAllCustomerStats = (reservations) => {
  customers.forEach(customer => {
    const customerReservations = reservations.filter(r => r.customerId === customer.id);
    customer.totalReservations = customerReservations.length;
    customer.totalSpent = customerReservations.reduce((sum, r) => sum + r.totalPrice, 0);
  });
};
