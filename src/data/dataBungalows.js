// Bungalov Durumları
export const BUNGALOW_STATUS = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Pasif',
  MAINTENANCE: 'Bakımda'
};

// Bungalov Verileri
export const bungalows = [
  {
    id: 1,
    name: 'ADEN WHİTE SUİT NO.10',
    feature: 'Dörtgen Sıcak Havuz',
    capacity: 2,
    dailyPrice: 1500,
    status: BUNGALOW_STATUS.ACTIVE,
    description: 'Lüks beyaz süit, dörtgen sıcak havuzlu',
    amenities: ['Sıcak Havuz', 'Klima', 'TV', 'Minibar', 'WiFi']
  },
  {
    id: 2,
    name: 'ADEN WHİTE SUİT NO.9',
    feature: 'Dörtgen Sıcak Havuz',
    capacity: 2,
    dailyPrice: 1500,
    status: BUNGALOW_STATUS.ACTIVE,
    description: 'Lüks beyaz süit, dörtgen sıcak havuzlu',
    amenities: ['Sıcak Havuz', 'Klima', 'TV', 'Minibar', 'WiFi']
  },
  {
    id: 3,
    name: 'ADEN BLUE SUİT NO.8',
    feature: 'Yuvarlak Havuz',
    capacity: 2,
    dailyPrice: 1400,
    status: BUNGALOW_STATUS.ACTIVE,
    description: 'Mavi süit, yuvarlak havuzlu',
    amenities: ['Havuz', 'Klima', 'TV', 'Minibar', 'WiFi']
  },
  {
    id: 4,
    name: 'ADEN FAMILY SUIT NO.7',
    feature: 'Küçük Yuvarlak Havuz',
    capacity: 3,
    dailyPrice: 1200,
    status: BUNGALOW_STATUS.ACTIVE,
    description: 'Aile süiti, küçük yuvarlak havuzlu',
    amenities: ['Havuz', 'Klima', 'TV', 'Minibar', 'WiFi', 'Çocuk Yatağı']
  },
  {
    id: 5,
    name: 'ADEN STANDART SUIT NO.6',
    feature: 'Dörtgen Havuz',
    capacity: 2,
    dailyPrice: 1400,
    status: BUNGALOW_STATUS.ACTIVE,
    description: 'Standart süit, dörtgen havuzlu',
    amenities: ['Havuz', 'Klima', 'TV', 'Minibar', 'WiFi']
  },
  {
    id: 6,
    name: 'ADEN PREMIUM SUİT NO.5',
    feature: 'Büyük Dörtgen Havuz',
    capacity: 2,
    dailyPrice: 1800,
    status: BUNGALOW_STATUS.ACTIVE,
    description: 'Premium süit, büyük dörtgen havuzlu',
    amenities: ['Büyük Havuz', 'Klima', 'TV', 'Minibar', 'WiFi', 'Jacuzzi']
  },
  {
    id: 7,
    name: 'ADEN DELUXE SUİT NO.4',
    feature: 'Oval Havuz',
    capacity: 2,
    dailyPrice: 1600,
    status: BUNGALOW_STATUS.ACTIVE,
    description: 'Deluxe süit, oval havuzlu',
    amenities: ['Oval Havuz', 'Klima', 'TV', 'Minibar', 'WiFi', 'Sauna']
  },
  {
    id: 8,
    name: 'ADEN COUPLE SUİT NO.3',
    feature: 'Kalp Şekli Havuz',
    capacity: 2,
    dailyPrice: 1700,
    status: BUNGALOW_STATUS.ACTIVE,
    description: 'Çift süiti, kalp şekli havuzlu',
    amenities: ['Kalp Havuz', 'Klima', 'TV', 'Minibar', 'WiFi', 'Romantik Dekor']
  },
  {
    id: 9,
    name: 'ADEN LUXURY SUİT NO.2',
    feature: 'İnfinity Havuz',
    capacity: 2,
    dailyPrice: 2000,
    status: BUNGALOW_STATUS.ACTIVE,
    description: 'Lüks süit, infinty havuzlu',
    amenities: ['İnfinity Havuz', 'Klima', 'TV', 'Minibar', 'WiFi', 'Butler Servisi']
  },
  {
    id: 10,
    name: 'ADEN ROYAL SUİT NO.1',
    feature: 'Kraliyet Havuzu',
    capacity: 4,
    dailyPrice: 2500,
    status: BUNGALOW_STATUS.ACTIVE,
    description: 'Kraliyet süiti, özel havuzlu',
    amenities: ['Kraliyet Havuzu', 'Klima', 'TV', 'Minibar', 'WiFi', 'Özel Şef', 'Spa']
  }
];

// Bungalov yardımcı fonksiyonları
export const getBungalowById = (id) => {
  return bungalows.find(bungalow => bungalow.id === id);
};

export const getBungalowsByStatus = (status) => {
  return bungalows.filter(bungalow => bungalow.status === status);
};

export const getBungalowsByCapacity = (capacity) => {
  return bungalows.filter(bungalow => bungalow.capacity >= capacity);
};

export const getBungalowsByPriceRange = (minPrice, maxPrice) => {
  return bungalows.filter(bungalow => 
    bungalow.dailyPrice >= minPrice && bungalow.dailyPrice <= maxPrice
  );
};
