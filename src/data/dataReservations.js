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

// Rezervasyon Verileri - Gerçek veri niteliği taşıyan demo rezervasyonlar
export const reservations = [
  // 1. BEKLEYEN + KISMİ ÖDEME (Kapora alınmış, kalan ödenmemiş)
  {
    id: 1,
    reservationCode: 'RES-2025-001',
    bungalowId: 1,
    customerId: 1,
    checkInDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 gün sonra
    checkOutDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 gün sonra
    nights: 3,
    guestCount: 2,
    bungalowPrice: 1500,
    totalPrice: 4500,
    depositAmount: 900,
    paidAmount: 900, // Kapora alındı
    remainingAmount: 3600, // Toplam - Ödenen = 4500 - 900 = 3600
    status: RESERVATION_STATUS.PENDING,
    paymentStatus: PAYMENT_STATUS.PARTIAL_PAID, // Kapora alınmış, kalan ödenmemiş
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 14:30',
    createdBy: 'Admin',
    notes: 'Kapora alındı (900 TL), kalan ödeme bekleniyor (3600 TL)',
    specialRequests: ['Geç giriş', 'Çiçek buketi']
  },
  
  // 2. BEKLEYEN + KISMİ ÖDEME (Kapora + ek ödeme alınmış, kalan ödenmemiş)
  {
    id: 2,
    reservationCode: 'RES-2025-002',
    bungalowId: 2,
    customerId: 2,
    checkInDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 gün sonra
    checkOutDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 8 gün sonra
    nights: 3,
    guestCount: 2,
    bungalowPrice: 1500,
    totalPrice: 4500,
    depositAmount: 900,
    paidAmount: 2250, // Kapora + ek ödeme
    remainingAmount: 2250, // Toplam - Ödenen = 4500 - 2250 = 2250
    status: RESERVATION_STATUS.PENDING,
    paymentStatus: PAYMENT_STATUS.PARTIAL_PAID, // Kapora alınmış, kalan ödenmemiş
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 10:15',
    createdBy: 'Admin',
    notes: 'Kapora + ek ödeme alındı (2250 TL), kalan ödeme bekleniyor (2250 TL)',
    specialRequests: ['Erken giriş', 'Havuz ısıtması']
  },
  
  // 3. ONAYLANDI + ÖDENDİ (Kapora ve kalan tutar ödenmiş)
  {
    id: 3,
    reservationCode: 'RES-2025-003',
    bungalowId: 3,
    customerId: 3,
    checkInDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 gün sonra
    checkOutDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 gün sonra
    nights: 3,
    guestCount: 2,
    bungalowPrice: 1400,
    totalPrice: 4200,
    depositAmount: 840,
    paidAmount: 4200, // Kapora ve kalan tutar ödenmiş
    remainingAmount: 0,
    status: RESERVATION_STATUS.CONFIRMED,
    paymentStatus: PAYMENT_STATUS.FULL_PAID, // Kapora ve kalan tutar ödenmiş
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 16:45',
    createdBy: 'Admin',
    notes: 'Kapora ve kalan tutar ödenmiş, rezervasyon onaylandı',
    specialRequests: ['Havuz ısıtması', 'Geç çıkış']
  },
  
  // 4. ONAYLANDI + KISMİ ÖDEME
  {
    id: 4,
    reservationCode: 'RES-2025-004',
    bungalowId: 4,
    customerId: 4,
    checkInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 gün sonra
    checkOutDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 gün sonra
    nights: 3,
    guestCount: 3,
    bungalowPrice: 1200,
    totalPrice: 3600,
    depositAmount: 720,
    paidAmount: 1800,
    remainingAmount: 1800,
    status: RESERVATION_STATUS.CONFIRMED,
    paymentStatus: PAYMENT_STATUS.PARTIAL_PAID, // paidAmount > 0 ve paidAmount < totalPrice
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 14:20',
    createdBy: 'Admin',
    notes: 'Aile rezervasyonu, kalan ödeme girişte alınacak',
    specialRequests: ['Çocuk yatağı', 'Bebek sandalyesi']
  },
  
  // 5. GİRİŞ YAPTI + ÖDEME ALINDI
  {
    id: 5,
    reservationCode: 'RES-2025-005',
    bungalowId: 5,
    customerId: 5,
    checkInDate: new Date().toISOString().split('T')[0], // Bugün
    checkOutDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 gün sonra
    nights: 2,
    guestCount: 2,
    bungalowPrice: 1400,
    totalPrice: 2800,
    depositAmount: 560,
    paidAmount: 2800,
    remainingAmount: 0,
    status: RESERVATION_STATUS.CHECKED_IN,
    paymentStatus: PAYMENT_STATUS.FULL_PAID, // paidAmount = totalPrice
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 11:30',
    createdBy: 'Admin',
    notes: 'Giriş yapıldı, tam ödeme alındı',
    specialRequests: ['Geç çıkış', 'Havuz ısıtması']
  },
  
  // 6. GİRİŞ YAPTI + KISMİ ÖDEME
  {
    id: 6,
    reservationCode: 'RES-2025-006',
    bungalowId: 6,
    customerId: 6,
    checkInDate: new Date().toISOString().split('T')[0], // Bugün
    checkOutDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 gün sonra
    nights: 3,
    guestCount: 2,
    bungalowPrice: 1800,
    totalPrice: 5400,
    depositAmount: 1080,
    paidAmount: 2700,
    remainingAmount: 2700,
    status: RESERVATION_STATUS.CHECKED_IN,
    paymentStatus: PAYMENT_STATUS.PARTIAL_PAID, // paidAmount > 0 ve paidAmount < totalPrice
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 15:45',
    createdBy: 'Admin',
    notes: 'Giriş yapıldı, kalan ödeme çıkışta alınacak',
    specialRequests: ['Jacuzzi hazırlığı', 'Özel temizlik']
  },
  
  // 7. ÇIKIŞ YAPTI + ÖDEME ALINDI
  {
    id: 7,
    reservationCode: 'RES-2025-007',
    bungalowId: 7,
    customerId: 7,
    checkInDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 gün önce
    checkOutDate: new Date().toISOString().split('T')[0], // Bugün
    nights: 2,
    guestCount: 2,
    bungalowPrice: 1600,
    totalPrice: 3200,
    depositAmount: 640,
    paidAmount: 3200,
    remainingAmount: 0,
    status: RESERVATION_STATUS.CHECKED_OUT,
    paymentStatus: PAYMENT_STATUS.FULL_PAID, // paidAmount = totalPrice
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 16:20',
    createdBy: 'Admin',
    notes: 'Çıkış yapıldı, tam ödeme alındı',
    specialRequests: ['Geç çıkış', 'Sauna servisi']
  },
  
  // 8. ÇIKIŞ YAPTI + KISMİ ÖDEME
  {
    id: 8,
    reservationCode: 'RES-2025-008',
    bungalowId: 8,
    customerId: 8,
    checkInDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 gün önce
    checkOutDate: new Date().toISOString().split('T')[0], // Bugün
    nights: 3,
    guestCount: 2,
    bungalowPrice: 1700,
    totalPrice: 5100,
    depositAmount: 1020,
    paidAmount: 2550,
    remainingAmount: 2550,
    status: RESERVATION_STATUS.CHECKED_OUT,
    paymentStatus: PAYMENT_STATUS.PARTIAL_PAID, // paidAmount > 0 ve paidAmount < totalPrice
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 14:15',
    createdBy: 'Admin',
    notes: 'Çıkış yapıldı, kalan ödeme tahsil edildi',
    specialRequests: ['Romantik dekor', 'Çiçek buketi']
  },
  
  // 9. İPTAL EDİLDİ + KAPORA KESİLDİ
  {
    id: 9,
    reservationCode: 'RES-2025-009',
    bungalowId: 9,
    customerId: 9,
    checkInDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 gün sonra
    checkOutDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 13 gün sonra
    nights: 3,
    guestCount: 2,
    bungalowPrice: 2000,
    totalPrice: 6000,
    depositAmount: 1200,
    paidAmount: 1200, // Kapora firmaya kaldı
    remainingAmount: 4800, // Kalan üstü çizili (iade edilmeyecek)
    status: RESERVATION_STATUS.CANCELLED,
    paymentStatus: PAYMENT_STATUS.DEPOSIT_FORFEITED, // Kapora kesildi
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 18:30',
    createdBy: 'Admin',
    notes: 'Müşteri tarafından iptal edildi, kapora firmaya kaldı',
    specialRequests: ['Butler servisi', 'Özel menü']
  },
  
  // 10. İPTAL EDİLDİ + KAPORA KESİLDİ
  {
    id: 10,
    reservationCode: 'RES-2025-010',
    bungalowId: 10,
    customerId: 10,
    checkInDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12 gün sonra
    checkOutDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 gün sonra
    nights: 3,
    guestCount: 4,
    bungalowPrice: 2500,
    totalPrice: 7500,
    depositAmount: 1500,
    paidAmount: 1500, // Sadece kapora firmaya kaldı
    remainingAmount: 6000, // Kalan üstü çizili (iade edilmeyecek)
    status: RESERVATION_STATUS.CANCELLED,
    paymentStatus: PAYMENT_STATUS.DEPOSIT_FORFEITED, // Kapora kesildi
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 12:45',
    createdBy: 'Admin',
    notes: 'İptal edildi, kapora firmaya kaldı',
    specialRequests: ['Özel şef', 'Spa paketi', 'VIP aktiviteler']
  },
  
  // 11. İPTAL EDİLDİ + KAPORA KESİLDİ
  {
    id: 11,
    reservationCode: 'RES-2025-011',
    bungalowId: 1,
    customerId: 11,
    checkInDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 gün sonra
    checkOutDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 17 gün sonra
    nights: 3,
    guestCount: 2,
    bungalowPrice: 1500,
    totalPrice: 4500,
    depositAmount: 900,
    paidAmount: 900, // Sadece kapora firmaya kaldı
    remainingAmount: 3600, // Kalan üstü çizili (iade edilmeyecek)
    status: RESERVATION_STATUS.CANCELLED,
    paymentStatus: PAYMENT_STATUS.DEPOSIT_FORFEITED, // Kapora kesildi
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 16:15',
    createdBy: 'Admin',
    notes: 'İptal edildi, kapora firmaya kaldı',
    specialRequests: ['Erken giriş', 'Çiçek buketi']
  },
  
  // 12. BEKLEYEN + ÖDENMEDİ (Kapora yok, kalan ödenmemiş)
  {
    id: 12,
    reservationCode: 'RES-2025-012',
    bungalowId: 2,
    customerId: 12,
    checkInDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 gün sonra
    checkOutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 gün sonra
    nights: 3,
    guestCount: 2,
    bungalowPrice: 1500,
    totalPrice: 4500,
    depositAmount: 900,
    paidAmount: 0, // Kapora yok
    remainingAmount: 4500, // Toplam - Ödenen = 4500 - 0 = 4500
    status: RESERVATION_STATUS.PENDING,
    paymentStatus: PAYMENT_STATUS.NOT_PAID, // Kapora yok, kalan ödenmemiş
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 09:20',
    createdBy: 'Admin',
    notes: 'Henüz hiç ödeme yapılmadı, kapora bekleniyor',
    specialRequests: ['Erken giriş']
  },
  
  // 13. ONAYLANDI + ÖDEME ALINDI (Ek test verisi)
  {
    id: 13,
    reservationCode: 'RES-2025-013',
    bungalowId: 3,
    customerId: 13,
    checkInDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 gün Önce
    checkOutDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 9 gün sonra
    nights: 3,
    guestCount: 2,
    bungalowPrice: 1400,
    totalPrice: 4200,
    depositAmount: 840,
    paidAmount: 4200,
    remainingAmount: 0,
    status: RESERVATION_STATUS.CONFIRMED,
    paymentStatus: PAYMENT_STATUS.FULL_PAID, // paidAmount = totalPrice
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 13:10',
    createdBy: 'Admin',
    notes: 'Tam ödeme alındı, rezervasyon onaylandı',
    specialRequests: ['Havuz ısıtması']
  },
  
  // 14. GİRİŞ YAPTI + ÖDEME ALINDI (Ek test verisi)
  {
    id: 14,
    reservationCode: 'RES-2025-014',
    bungalowId: 4,
    customerId: 14,
    checkInDate: new Date().toISOString().split('T')[0], // Bugün
    checkOutDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yarın
    nights: 1,
    guestCount: 3,
    bungalowPrice: 1200,
    totalPrice: 1200,
    depositAmount: 240,
    paidAmount: 1200,
    remainingAmount: 0,
    status: RESERVATION_STATUS.CHECKED_IN,
    paymentStatus: PAYMENT_STATUS.FULL_PAID, // paidAmount = totalPrice
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 17:30',
    createdBy: 'Admin',
    notes: 'Giriş yapıldı, tam ödeme alındı',
    specialRequests: ['Çocuk yatağı']
  },
  
  // 15. ÇIKIŞ YAPTI + ÖDEME ALINDI (Ek test verisi)
  {
    id: 15,
    reservationCode: 'RES-2025-015',
    bungalowId: 5,
    customerId: 15,
    checkInDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Dün
    checkOutDate: new Date().toISOString().split('T')[0], // Bugün
    nights: 1,
    guestCount: 2,
    bungalowPrice: 1400,
    totalPrice: 1400,
    depositAmount: 280,
    paidAmount: 1400,
    remainingAmount: 0,
    status: RESERVATION_STATUS.CHECKED_OUT,
    paymentStatus: PAYMENT_STATUS.FULL_PAID, // paidAmount = totalPrice
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 15:45',
    createdBy: 'Admin',
    notes: 'Çıkış yapıldı, tam ödeme alındı',
    specialRequests: ['Geç çıkış']
  }
];

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

export const getUpcomingReservations = (days = 7) => {
  const today = new Date();
  const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  
  return reservations.filter(reservation => {
    const checkIn = new Date(reservation.checkInDate);
    return checkIn > today && checkIn <= futureDate;
  });
};
