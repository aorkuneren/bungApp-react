// Bungalov Durumları
export const BUNGALOW_STATUS = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Pasif',
  MAINTENANCE: 'Bakımda'
};

// Bungalov Verileri - Boş başlangıç
export const bungalows = [];

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