import { useState, useMemo, useCallback } from 'react';
import { debounce } from '../utils/helpers';

const useSearch = (data, searchFields = [], debounceDelay = 300) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term);
    }, debounceDelay),
    [debounceDelay]
  );

  const handleSearch = useCallback((term) => {
    debouncedSearch(term);
  }, [debouncedSearch]);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase();
    
    return data.filter(item => {
      // Eğer searchFields belirtilmişse sadece o alanlarda ara
      if (searchFields.length > 0) {
        return searchFields.some(field => {
          const value = getNestedValue(item, field);
          return value && value.toString().toLowerCase().includes(term);
        });
      }
      
      // Aksi halde tüm string alanlarda ara
      return Object.values(item).some(value => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term);
        }
        if (typeof value === 'number') {
          return value.toString().includes(term);
        }
        return false;
      });
    });
  }, [data, searchTerm, searchFields]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    filteredData,
    handleSearch,
    clearSearch,
    isSearching: searchTerm.trim().length > 0
  };
};

// Nested object değerlerini almak için yardımcı fonksiyon
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

export default useSearch;
