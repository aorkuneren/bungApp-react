import { useState, useEffect, useCallback } from 'react';

const useLocalStorage = (key, initialValue) => {
  // State'i localStorage'dan başlat
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`LocalStorage okuma hatası (${key}):`, error);
      return initialValue;
    }
  });

  // Değeri güncelle ve localStorage'a kaydet
  const setValue = useCallback((value) => {
    try {
      // Fonksiyon ise çağır
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      // localStorage'a kaydet
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`LocalStorage yazma hatası (${key}):`, error);
    }
  }, [key, storedValue]);

  // Değeri temizle
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`LocalStorage silme hatası (${key}):`, error);
    }
  }, [key, initialValue]);

  // Diğer tab'lardaki değişiklikleri dinle
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`LocalStorage değişiklik hatası (${key}):`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
