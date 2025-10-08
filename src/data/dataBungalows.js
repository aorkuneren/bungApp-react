// Local Storage servisini import et
import { bungalowService } from './localStorage.js';

// Bungalov Durumları
export const BUNGALOW_STATUS = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Pasif',
  MAINTENANCE: 'Bakımda'
};

export const bungalows = bungalowService.getAll();

// Bungalov yardımcı fonksiyonları - Local Storage servislerini kullan
export const getBungalowById = (id) => {
  return bungalowService.getById(id);
};

export const getBungalowsByStatus = (status) => {
  return bungalowService.getByStatus(status);
};

export const getBungalowsByCapacity = (capacity) => {
  return bungalowService.getByCapacity(capacity);
};

export const getBungalowsByPriceRange = (minPrice, maxPrice) => {
  const bungalows = bungalowService.getAll();
  return bungalows.filter(bungalow => 
    bungalow.dailyPrice >= minPrice && bungalow.dailyPrice <= maxPrice
  );
};