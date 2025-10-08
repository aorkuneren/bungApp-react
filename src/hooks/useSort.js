import { useState, useMemo, useCallback } from 'react';

const useSort = (data, defaultSortField = null, defaultSortDirection = 'asc') => {
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);

  const sortedData = useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      let aValue = getNestedValue(a, sortField);
      let bValue = getNestedValue(b, sortField);

      // Null/undefined değerleri en sona koy
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Tarih karşılaştırması
      if (aValue instanceof Date && bValue instanceof Date) {
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      }

      // String karşılaştırması
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      // Sayı karşılaştırması
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // String karşılaştırması
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortField, sortDirection]);

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      // Aynı alan tekrar tıklanırsa yönü değiştir
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Yeni alan seçilirse varsayılan yönü kullan
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const clearSort = useCallback(() => {
    setSortField(null);
    setSortDirection('asc');
  }, []);

  const getSortIcon = useCallback((field) => {
    if (sortField !== field) {
      return '↕️'; // Neutral icon
    }
    return sortDirection === 'asc' ? '↑' : '↓';
  }, [sortField, sortDirection]);

  return {
    sortedData,
    sortField,
    sortDirection,
    handleSort,
    clearSort,
    getSortIcon,
    isSorted: !!sortField
  };
};

// Nested object değerlerini almak için yardımcı fonksiyon
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

export default useSort;
