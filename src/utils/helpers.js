// Yardımcı fonksiyonlar

// Tarih formatlama
export const formatDate = (dateString, format = 'display') => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const options = {
    display: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    input: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    datetime: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  };
  
  return date.toLocaleDateString('tr-TR', options[format] || options.display);
};

// Para formatlama
export const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) return '₺0';
  
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Gecelik fiyat formatı
export const formatNightlyPrice = (price) => {
  return `${formatPrice(price)}/gece`;
};

// Gece sayısı hesaplama
export const calculateNights = (checkInDate, checkOutDate) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  return Math.max(0, daysDiff);
};

// Tarih aralığı kontrolü
export const isDateInRange = (date, startDate, endDate) => {
  const checkDate = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return checkDate >= start && checkDate <= end;
};

// Tarih çakışması kontrolü
export const hasDateConflict = (newStart, newEnd, existingStart, existingEnd) => {
  const newStartDate = new Date(newStart);
  const newEndDate = new Date(newEnd);
  const existingStartDate = new Date(existingStart);
  const existingEndDate = new Date(existingEnd);
  
  return (
    (newStartDate < existingEndDate && newEndDate > existingStartDate)
  );
};

// String temizleme
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/\s+/g, ' ');
};

// Email validasyonu
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Telefon validasyonu
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// TC Kimlik No validasyonu
export const isValidTCNumber = (tcNumber) => {
  const tcRegex = /^[1-9][0-9]{10}$/;
  return tcRegex.test(tcNumber);
};

// Debounce fonksiyonu
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle fonksiyonu
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Local Storage yardımcıları
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('LocalStorage okuma hatası:', error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('LocalStorage yazma hatası:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('LocalStorage silme hatası:', error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('LocalStorage temizleme hatası:', error);
      return false;
    }
  }
};

// Array yardımcıları
export const arrayHelpers = {
  // Benzersiz değerler
  unique: (arr) => [...new Set(arr)],
  
  // Gruplama
  groupBy: (arr, key) => {
    return arr.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },
  
  // Sıralama
  sortBy: (arr, key, direction = 'asc') => {
    return [...arr].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (direction === 'desc') {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  },
  
  // Filtreleme
  filterBy: (arr, filters) => {
    return arr.filter(item => {
      return Object.keys(filters).every(key => {
        const filterValue = filters[key];
        const itemValue = item[key];
        
        if (typeof filterValue === 'string') {
          return itemValue.toLowerCase().includes(filterValue.toLowerCase());
        }
        
        return itemValue === filterValue;
      });
    });
  }
};

// Sayfa yardımcıları
export const paginationHelpers = {
  getPageData: (data, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      data: data.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      totalPages: Math.ceil(data.length / itemsPerPage),
      totalItems: data.length
    };
  }
};

// URL yardımcıları
export const urlHelpers = {
  buildQueryString: (params) => {
    const searchParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        searchParams.append(key, params[key]);
      }
    });
    
    return searchParams.toString();
  },
  
  parseQueryString: (queryString) => {
    const params = {};
    const searchParams = new URLSearchParams(queryString);
    
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    
    return params;
  }
};

// Hata yönetimi
export const errorHelpers = {
  getErrorMessage: (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    return 'Beklenmeyen bir hata oluştu';
  },
  
  isNetworkError: (error) => {
    return !error.response && error.request;
  },
  
  isServerError: (error) => {
    return error.response?.status >= 500;
  },
  
  isClientError: (error) => {
    return error.response?.status >= 400 && error.response?.status < 500;
  }
};
