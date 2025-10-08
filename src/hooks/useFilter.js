import { useState, useMemo, useCallback } from 'react';

const useFilter = (data, initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      return Object.keys(filters).every(filterKey => {
        const filterValue = filters[filterKey];
        
        // Boş filtreleri atla
        if (filterValue === null || filterValue === undefined || filterValue === '') {
          return true;
        }

        const itemValue = getNestedValue(item, filterKey);

        // Array filtreleri için
        if (Array.isArray(filterValue)) {
          return filterValue.length === 0 || filterValue.includes(itemValue);
        }

        // String filtreleri için (case-insensitive)
        if (typeof filterValue === 'string') {
          return itemValue && itemValue.toString().toLowerCase().includes(filterValue.toLowerCase());
        }

        // Sayı filtreleri için
        if (typeof filterValue === 'number') {
          return itemValue === filterValue;
        }

        // Boolean filtreleri için
        if (typeof filterValue === 'boolean') {
          return itemValue === filterValue;
        }

        // Tarih aralığı filtreleri için
        if (filterValue && typeof filterValue === 'object' && filterValue.start && filterValue.end) {
          const itemDate = new Date(itemValue);
          const startDate = new Date(filterValue.start);
          const endDate = new Date(filterValue.end);
          return itemDate >= startDate && itemDate <= endDate;
        }

        // Sayı aralığı filtreleri için
        if (filterValue && typeof filterValue === 'object' && filterValue.min !== undefined && filterValue.max !== undefined) {
          return itemValue >= filterValue.min && itemValue <= filterValue.max;
        }

        // Varsayılan eşitlik kontrolü
        return itemValue === filterValue;
      });
    });
  }, [data, filters]);

  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const setMultipleFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  const clearFilter = useCallback((key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== null && v !== undefined && v !== '');
      }
      return value !== null && value !== undefined && value !== '';
    });
  }, [filters]);

  const getActiveFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== null && v !== undefined && v !== '');
      }
      return value !== null && value !== undefined && value !== '';
    }).length;
  }, [filters]);

  return {
    filteredData,
    filters,
    setFilter,
    setMultipleFilters,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
    getActiveFiltersCount
  };
};

// Nested object değerlerini almak için yardımcı fonksiyon
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

export default useFilter;
