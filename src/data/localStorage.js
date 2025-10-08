// Local Storage Veri Yönetimi
// Tüm veriler browser'ın localStorage'ında saklanır

// Local Storage anahtarları
const STORAGE_KEYS = {
  CUSTOMERS: 'bungalow_customers',
  BUNGALOWS: 'bungalow_bungalows', 
  RESERVATIONS: 'bungalow_reservations',
  USER: 'bungalow_user'
};

// Local Storage yardımcı fonksiyonları
export const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('LocalStorage okuma hatası:', error);
    return [];
  }
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('LocalStorage yazma hatası:', error);
    return false;
  }
};

// Müşteri CRUD işlemleri
export const customerService = {
  // Tüm müşterileri getir
  getAll: () => getFromStorage(STORAGE_KEYS.CUSTOMERS),
  
  // ID'ye göre müşteri getir
  getById: (id) => {
    const customers = getFromStorage(STORAGE_KEYS.CUSTOMERS);
    return customers.find(customer => customer.id === parseInt(id));
  },
  
  // Müşteri oluştur
  create: (customerData) => {
    const customers = getFromStorage(STORAGE_KEYS.CUSTOMERS);
    const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    
    const newCustomer = {
      id: newId,
      ...customerData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalReservations: 0,
      totalSpent: 0
    };
    
    customers.push(newCustomer);
    saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
    return newCustomer;
  },
  
  // Müşteri güncelle
  update: (id, customerData) => {
    const customers = getFromStorage(STORAGE_KEYS.CUSTOMERS);
    const index = customers.findIndex(customer => customer.id === parseInt(id));
    
    if (index !== -1) {
      customers[index] = {
        ...customers[index],
        ...customerData,
        updatedAt: new Date().toISOString()
      };
      saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
      return customers[index];
    }
    return null;
  },
  
  // Müşteri sil
  delete: (id) => {
    const customers = getFromStorage(STORAGE_KEYS.CUSTOMERS);
    const filteredCustomers = customers.filter(customer => customer.id !== parseInt(id));
    saveToStorage(STORAGE_KEYS.CUSTOMERS, filteredCustomers);
    return true;
  },
  
  // Email ile müşteri ara
  findByEmail: (email) => {
    const customers = getFromStorage(STORAGE_KEYS.CUSTOMERS);
    return customers.filter(customer => 
      customer.email.toLowerCase().includes(email.toLowerCase())
    );
  },
  
  // İsim ile müşteri ara
  findByName: (name) => {
    const customers = getFromStorage(STORAGE_KEYS.CUSTOMERS);
    return customers.filter(customer => 
      customer.firstName.toLowerCase().includes(name.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(name.toLowerCase()) ||
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(name.toLowerCase())
    );
  },
  
  // Tüm müşterileri sil
  clearAll: () => {
    saveToStorage(STORAGE_KEYS.CUSTOMERS, []);
  }
};

// Bungalov CRUD işlemleri
export const bungalowService = {
  // Tüm bungalovları getir
  getAll: () => getFromStorage(STORAGE_KEYS.BUNGALOWS),
  
  // ID'ye göre bungalov getir
  getById: (id) => {
    const bungalows = getFromStorage(STORAGE_KEYS.BUNGALOWS);
    return bungalows.find(bungalow => bungalow.id === parseInt(id));
  },
  
  // Bungalov oluştur
  create: (bungalowData) => {
    const bungalows = getFromStorage(STORAGE_KEYS.BUNGALOWS);
    const newId = bungalows.length > 0 ? Math.max(...bungalows.map(b => b.id)) + 1 : 1;
    
    const newBungalow = {
      id: newId,
      ...bungalowData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    bungalows.push(newBungalow);
    saveToStorage(STORAGE_KEYS.BUNGALOWS, bungalows);
    return newBungalow;
  },
  
  // Bungalov güncelle
  update: (id, bungalowData) => {
    const bungalows = getFromStorage(STORAGE_KEYS.BUNGALOWS);
    const index = bungalows.findIndex(bungalow => bungalow.id === parseInt(id));
    
    if (index !== -1) {
      bungalows[index] = {
        ...bungalows[index],
        ...bungalowData,
        updatedAt: new Date().toISOString()
      };
      saveToStorage(STORAGE_KEYS.BUNGALOWS, bungalows);
      return bungalows[index];
    }
    return null;
  },
  
  // Bungalov sil
  delete: (id) => {
    const bungalows = getFromStorage(STORAGE_KEYS.BUNGALOWS);
    const filteredBungalows = bungalows.filter(bungalow => bungalow.id !== parseInt(id));
    saveToStorage(STORAGE_KEYS.BUNGALOWS, filteredBungalows);
    return true;
  },
  
  // Duruma göre bungalovları getir
  getByStatus: (status) => {
    const bungalows = getFromStorage(STORAGE_KEYS.BUNGALOWS);
    return bungalows.filter(bungalow => bungalow.status === status);
  },
  
  // Kapasiteye göre bungalovları getir
  getByCapacity: (capacity) => {
    const bungalows = getFromStorage(STORAGE_KEYS.BUNGALOWS);
    return bungalows.filter(bungalow => bungalow.capacity >= capacity);
  },
  
  // Tüm bungalovları sil
  clearAll: () => {
    saveToStorage(STORAGE_KEYS.BUNGALOWS, []);
  }
};

// Rezervasyon CRUD işlemleri
export const reservationService = {
  // Tüm rezervasyonları getir
  getAll: () => getFromStorage(STORAGE_KEYS.RESERVATIONS),
  
  // ID'ye göre rezervasyon getir
  getById: (id) => {
    const reservations = getFromStorage(STORAGE_KEYS.RESERVATIONS);
    return reservations.find(reservation => reservation.id === parseInt(id));
  },
  
  // Rezervasyon oluştur
  create: (reservationData) => {
    const reservations = getFromStorage(STORAGE_KEYS.RESERVATIONS);
    const newId = reservations.length > 0 ? Math.max(...reservations.map(r => r.id)) + 1 : 1;
    
    const newReservation = {
      id: newId,
      ...reservationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    reservations.push(newReservation);
    saveToStorage(STORAGE_KEYS.RESERVATIONS, reservations);
    return newReservation;
  },
  
  // Rezervasyon güncelle
  update: (id, reservationData) => {
    const reservations = getFromStorage(STORAGE_KEYS.RESERVATIONS);
    const index = reservations.findIndex(reservation => reservation.id === parseInt(id));
    
    if (index !== -1) {
      reservations[index] = {
        ...reservations[index],
        ...reservationData,
        updatedAt: new Date().toISOString()
      };
      saveToStorage(STORAGE_KEYS.RESERVATIONS, reservations);
      return reservations[index];
    }
    return null;
  },
  
  // Rezervasyon sil
  delete: (id) => {
    const reservations = getFromStorage(STORAGE_KEYS.RESERVATIONS);
    const filteredReservations = reservations.filter(reservation => reservation.id !== parseInt(id));
    saveToStorage(STORAGE_KEYS.RESERVATIONS, filteredReservations);
    return true;
  },
  
  // Bungalov ID'ye göre rezervasyonları getir
  getByBungalowId: (bungalowId) => {
    const reservations = getFromStorage(STORAGE_KEYS.RESERVATIONS);
    return reservations.filter(reservation => reservation.bungalowId === parseInt(bungalowId));
  },
  
  // Müşteri ID'ye göre rezervasyonları getir
  getByCustomerId: (customerId) => {
    const reservations = getFromStorage(STORAGE_KEYS.RESERVATIONS);
    return reservations.filter(reservation => reservation.customerId === parseInt(customerId));
  },
  
  // Duruma göre rezervasyonları getir
  getByStatus: (status) => {
    const reservations = getFromStorage(STORAGE_KEYS.RESERVATIONS);
    return reservations.filter(reservation => reservation.status === status);
  },
  
  // Tarih aralığına göre rezervasyonları getir
  getByDateRange: (startDate, endDate) => {
    const reservations = getFromStorage(STORAGE_KEYS.RESERVATIONS);
    return reservations.filter(reservation => {
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return (checkIn >= start && checkIn <= end) || 
             (checkOut >= start && checkOut <= end) ||
             (checkIn <= start && checkOut >= end);
    });
  },
  
  // Tüm rezervasyonları sil
  clearAll: () => {
    saveToStorage(STORAGE_KEYS.RESERVATIONS, []);
  }
};

// Demo verileri yükle
export const loadDemoData = () => {
  // Demo müşteriler
  const demoCustomers = [
    {
      id: 1,
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet@example.com',
      phone: '0532 123 45 67',
      tcNumber: '12345678901',
      status: 'Aktif',
      totalReservations: 3,
      totalSpent: 4500,
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z'
    },
    {
      id: 2,
      firstName: 'Ayşe',
      lastName: 'Demir',
      email: 'ayse@example.com',
      phone: '0533 234 56 78',
      tcNumber: '12345678902',
      status: 'Aktif',
      totalReservations: 2,
      totalSpent: 3000,
      createdAt: '2024-01-20T10:00:00.000Z',
      updatedAt: '2024-01-20T10:00:00.000Z'
    },
    {
      id: 3,
      firstName: 'Mehmet',
      lastName: 'Kaya',
      email: 'mehmet@example.com',
      phone: '0534 345 67 89',
      tcNumber: '12345678903',
      status: 'Pasif',
      totalReservations: 1,
      totalSpent: 1500,
      createdAt: '2024-02-01T10:00:00.000Z',
      updatedAt: '2024-02-01T10:00:00.000Z'
    }
  ];

  // Demo bungalovlar
  const demoBungalows = [
    {
      id: 1,
      name: 'Deniz Manzaralı Bungalov',
      capacity: 4,
      dailyPrice: 500,
      status: 'Aktif',
      description: 'Deniz manzaralı, 2 yatak odalı bungalov',
      amenities: ['WiFi', 'Klima', 'TV', 'Balkon'],
      createdAt: '2024-01-01T10:00:00.000Z',
      updatedAt: '2024-01-01T10:00:00.000Z'
    },
    {
      id: 2,
      name: 'Orman Bungalov',
      capacity: 2,
      dailyPrice: 350,
      status: 'Aktif',
      description: 'Orman içinde, romantik bungalov',
      amenities: ['WiFi', 'Şömine', 'Balkon'],
      createdAt: '2024-01-01T10:00:00.000Z',
      updatedAt: '2024-01-01T10:00:00.000Z'
    },
    {
      id: 3,
      name: 'Aile Bungalov',
      capacity: 6,
      dailyPrice: 750,
      status: 'Aktif',
      description: 'Büyük aileler için, 3 yatak odalı bungalov',
      amenities: ['WiFi', 'Klima', 'TV', 'Bahçe', 'Barbekü'],
      createdAt: '2024-01-01T10:00:00.000Z',
      updatedAt: '2024-01-01T10:00:00.000Z'
    }
  ];

  // Demo rezervasyonlar
  const demoReservations = [
    {
      id: 1,
      code: 'RES-123456',
      reservationCode: 'RES-123456',
      customerId: 1,
      bungalowId: 1,
      checkInDate: '2024-03-15',
      checkOutDate: '2024-03-18',
      nights: 3,
      totalPrice: 1500,
      status: 'Onaylandı',
      paymentStatus: 'Ödendi',
      depositAmount: 0,
      remainingAmount: 0,
      notes: 'Deniz manzaralı bungalov tercih edildi',
      createdAt: '2024-03-01T10:00:00.000Z',
      updatedAt: '2024-03-01T10:00:00.000Z'
    },
    {
      id: 2,
      code: 'RES-123457',
      reservationCode: 'RES-123457',
      customerId: 2,
      bungalowId: 2,
      checkInDate: '2024-03-20',
      checkOutDate: '2024-03-22',
      nights: 2,
      totalPrice: 700,
      status: 'Bekleyen',
      paymentStatus: 'Kısmı Ödendi',
      depositAmount: 200,
      remainingAmount: 500,
      notes: 'Romantik kaçamak',
      createdAt: '2024-03-05T10:00:00.000Z',
      updatedAt: '2024-03-05T10:00:00.000Z'
    },
    {
      id: 3,
      code: 'RES-123458',
      reservationCode: 'RES-123458',
      customerId: 3,
      bungalowId: 3,
      checkInDate: '2024-03-25',
      checkOutDate: '2024-03-28',
      nights: 3,
      totalPrice: 2250,
      status: 'Giriş Yaptı',
      paymentStatus: 'Ödendi',
      depositAmount: 0,
      remainingAmount: 0,
      notes: 'Aile tatili',
      createdAt: '2024-03-10T10:00:00.000Z',
      updatedAt: '2024-03-10T10:00:00.000Z'
    }
  ];

  // Verileri localStorage'a kaydet
  saveToStorage(STORAGE_KEYS.CUSTOMERS, demoCustomers);
  saveToStorage(STORAGE_KEYS.BUNGALOWS, demoBungalows);
  saveToStorage(STORAGE_KEYS.RESERVATIONS, demoReservations);

  return {
    customers: demoCustomers,
    bungalows: demoBungalows,
    reservations: demoReservations
  };
};

// Verileri temizle
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
  localStorage.removeItem(STORAGE_KEYS.BUNGALOWS);
  localStorage.removeItem(STORAGE_KEYS.RESERVATIONS);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Veri durumunu kontrol et
export const hasData = () => {
  const customers = getFromStorage(STORAGE_KEYS.CUSTOMERS);
  const bungalows = getFromStorage(STORAGE_KEYS.BUNGALOWS);
  const reservations = getFromStorage(STORAGE_KEYS.RESERVATIONS);
  
  return customers.length > 0 || bungalows.length > 0 || reservations.length > 0;
};

// Mevcut verileri migration yap (reservationCode alanı ekle)
export const migrateExistingData = () => {
  const reservations = getFromStorage(STORAGE_KEYS.RESERVATIONS);
  let needsUpdate = false;
  
  const updatedReservations = reservations.map(reservation => {
    if (!reservation.reservationCode && reservation.code) {
      needsUpdate = true;
      return {
        ...reservation,
        reservationCode: reservation.code
      };
    }
    return reservation;
  });
  
  if (needsUpdate) {
    saveToStorage(STORAGE_KEYS.RESERVATIONS, updatedReservations);
    console.log('Rezervasyon verileri migration yapıldı - reservationCode alanları eklendi');
  }
  
  return needsUpdate;
};
