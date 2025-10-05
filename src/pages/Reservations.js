import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { reservations, getBungalowById, getCustomerById, RESERVATION_STATUS, formatDate, formatPrice, getReservationStatusBadge, getPaymentStatusBadge } from '../data/data';
import { 
  CalendarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  ChevronDownIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { BadgeTurkishLiraIcon } from '../components/ui/icons/lucide-badge-turkish-lira';

// Tooltip Component
const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="relative px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap">
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 -mt-1"></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Dropdown Component
const CustomDropdown = ({ options, value, onChange, placeholder, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm transition-colors flex items-center justify-between"
      >
        <span className="text-left">{value || placeholder}</span>
        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-2 text-sm text-left flex items-center justify-between hover:bg-gray-100 transition-colors ${
                  value === option.value ? 'bg-gray-100 text-gray-900' : 'text-gray-900'
                }`}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <CheckIcon className="w-4 h-4 text-gray-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Reservations = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [sortBy, setSortBy] = useState('Sıralama Yok');
  const [reservationsData, setReservationsData] = useState(reservations);
  const [editingStatus, setEditingStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Durum düzenleme fonksiyonları
  const handleStatusClick = (reservationId) => {
    setEditingStatus(reservationId);
  };

  const handleStatusChange = (reservationId, newStatus) => {
    setReservationsData(prevReservations => 
      prevReservations.map(reservation => 
        reservation.id === reservationId 
          ? { ...reservation, status: newStatus }
          : reservation
      )
    );
    setEditingStatus(null);
  };

  const handleStatusCancel = () => {
    setEditingStatus(null);
  };


  // Sıralama seçenekleri
  const sortOptions = [
    { value: 'Sıralama Yok', label: 'Sıralama Yok' },
    { value: 'Giriş Tarihi (Yakın-Uzak)', label: 'Giriş Tarihi (Yakın-Uzak)' },
    { value: 'Giriş Tarihi (Uzak-Yakın)', label: 'Giriş Tarihi (Uzak-Yakın)' },
    { value: 'Çıkış Tarihi (Yakın-Uzak)', label: 'Çıkış Tarihi (Yakın-Uzak)' },
    { value: 'Çıkış Tarihi (Uzak-Yakın)', label: 'Çıkış Tarihi (Uzak-Yakın)' },
    { value: 'Rezervasyon Kodu (A-Z)', label: 'Rezervasyon Kodu (A-Z)' },
    { value: 'Rezervasyon Kodu (Z-A)', label: 'Rezervasyon Kodu (Z-A)' },
    { value: 'Müşteri Adı (A-Z)', label: 'Müşteri Adı (A-Z)' },
    { value: 'Müşteri Adı (Z-A)', label: 'Müşteri Adı (Z-A)' },
    { value: 'Toplam Tutar (Yüksek-Düşük)', label: 'Toplam Tutar (Yüksek-Düşük)' },
    { value: 'Toplam Tutar (Düşük-Yüksek)', label: 'Toplam Tutar (Düşük-Yüksek)' }
  ];

  // İstatistik hesaplamaları
  const totalReservations = reservationsData.length;
  const pendingReservations = reservationsData.filter(r => r.status === RESERVATION_STATUS.PENDING).length;
  const confirmedReservations = reservationsData.filter(r => r.status === RESERVATION_STATUS.CONFIRMED).length;
  const totalRevenue = reservationsData.reduce((sum, r) => sum + r.totalPrice, 0);

  // Dinamik filtre seçenekleri
  const availableStatuses = [...new Set(reservationsData.map(r => r.status))].sort();
  const availablePaymentStatuses = [...new Set(reservationsData.map(r => r.paymentStatus))].sort();

  // Dropdown seçenekleri
  const statusOptions = [
    { value: '', label: 'Tüm Durumlar' },
    ...availableStatuses.map(status => ({ value: status, label: status }))
  ];

  const paymentOptions = [
    { value: '', label: 'Tüm Ödemeler' },
    ...availablePaymentStatuses.map(status => ({ value: status, label: status }))
  ];

  // Filtreleme
  const filteredReservations = reservationsData.filter(reservation => {
    const matchesSearch = 
      reservation.reservationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (getCustomerById(reservation.customerId)?.firstName + ' ' + getCustomerById(reservation.customerId)?.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCustomerById(reservation.customerId)?.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || reservation.status === statusFilter;
    const matchesPayment = paymentFilter === '' || reservation.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Sıralama
  const sortedReservations = [...filteredReservations].sort((a, b) => {
    switch (sortBy) {
      case 'Giriş Tarihi (Yakın-Uzak)':
        return new Date(a.checkInDate) - new Date(b.checkInDate);
      case 'Giriş Tarihi (Uzak-Yakın)':
        return new Date(b.checkInDate) - new Date(a.checkInDate);
      case 'Çıkış Tarihi (Yakın-Uzak)':
        return new Date(a.checkOutDate) - new Date(b.checkOutDate);
      case 'Çıkış Tarihi (Uzak-Yakın)':
        return new Date(b.checkOutDate) - new Date(a.checkOutDate);
      case 'Rezervasyon Kodu (A-Z)':
        return a.reservationCode.localeCompare(b.reservationCode);
      case 'Rezervasyon Kodu (Z-A)':
        return b.reservationCode.localeCompare(a.reservationCode);
      case 'Müşteri Adı (A-Z)':
        const customerA = getCustomerById(a.customerId);
        const customerB = getCustomerById(b.customerId);
        const nameA = customerA ? `${customerA.firstName} ${customerA.lastName}` : '';
        const nameB = customerB ? `${customerB.firstName} ${customerB.lastName}` : '';
        return nameA.localeCompare(nameB);
      case 'Müşteri Adı (Z-A)':
        const customerA2 = getCustomerById(a.customerId);
        const customerB2 = getCustomerById(b.customerId);
        const nameA2 = customerA2 ? `${customerA2.firstName} ${customerA2.lastName}` : '';
        const nameB2 = customerB2 ? `${customerB2.firstName} ${customerB2.lastName}` : '';
        return nameB2.localeCompare(nameA2);
      case 'Toplam Tutar (Yüksek-Düşük)':
        return b.totalPrice - a.totalPrice;
      case 'Toplam Tutar (Düşük-Yüksek)':
        return a.totalPrice - b.totalPrice;
      default:
        return 0;
    }
  });

  // Filtreleme değiştiğinde sayfa numarasını sıfırla
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, paymentFilter, sortBy]);

  // Pagination fonksiyonları
  const totalPages = Math.ceil(sortedReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReservations = sortedReservations.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Sayfa numaralarını oluştur
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Başlık ve Header Butonları */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rezervasyon Yönetimi</h1>
            <p className="text-gray-600 mt-1">Rezervasyonları görüntüle, düzenle ve yönet</p>
          </div>
          <Link
            to="/create-reservation"
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Yeni Rezervasyon</span>
          </Link>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Rezervasyon</p>
                <p className="text-2xl font-bold text-gray-900">{totalReservations}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Beklemede</p>
                <p className="text-2xl font-bold text-gray-900">{pendingReservations}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Onaylandı</p>
                <p className="text-2xl font-bold text-gray-900">{confirmedReservations}</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
              </div>
              <BadgeTurkishLiraIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Arama ve Filtreler */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Arama ve Filtreler</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Arama */}
            <div className="md:col-span-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Müşteri adı, e-posta veya rezervasyon kodu ile ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Durum Filtresi */}
            <CustomDropdown
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Durum"
            />
            
            {/* Ödeme Durumu Filtresi */}
            <CustomDropdown
              options={paymentOptions}
              value={paymentFilter}
              onChange={setPaymentFilter}
              placeholder="Ödeme"
            />
            
            {/* Sıralama */}
            <CustomDropdown
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sıralama"
            />
          </div>
        </div>

        {/* Rezervasyonlar Tablosu */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rezervasyon Kodu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Müşteri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bungalov Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giriş/Çıkış Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durumu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ödeme Durumu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentReservations.map((reservation) => {
                  const bungalow = getBungalowById(reservation.bungalowId);
                  const customer = getCustomerById(reservation.customerId);
                  
                  return (
                    <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                      {/* Rezervasyon Kodu */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.reservationCode}
                        </div>
                      </td>
                      
                      {/* Müşteri Adı Soyadı */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => customer && navigate(`/customers/${customer.id}`)}
                          className="text-sm text-gray-900 hover:text-gray-600 hover:underline cursor-pointer"
                        >
                          {customer ? `${customer.firstName} ${customer.lastName}` : 'Bilinmiyor'}
                        </button>
                        <div className="text-sm text-gray-500">
                          {customer?.email || 'Bilinmiyor'}
                        </div>
                      </td>
                      
                      {/* Bungalov Adı */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => bungalow && navigate(`/bungalows/${bungalow.id}`)}
                          className="text-sm text-gray-900 hover:text-gray-600 hover:underline cursor-pointer"
                        >
                          {bungalow?.name || 'Bilinmiyor'}
                        </button>
                        <div className="text-sm text-gray-500">
                          {reservation.nights} gece, {reservation.guestCount} kişi
                        </div>
                      </td>
                      
                      {/* Giriş/Çıkış Tarihi */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(reservation.checkInDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(reservation.checkOutDate)}
                        </div>
                      </td>
                      
                      {/* Durumu - Tıklanabilir */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingStatus === reservation.id ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={reservation.status}
                              onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                              className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                              autoFocus
                            >
                              <option value="Bekleyen">Bekleyen</option>
                              <option value="Onaylandı">Onaylandı</option>
                              <option value="Giriş Yaptı">Giriş Yaptı</option>
                              <option value="Çıkış Yaptı">Çıkış Yaptı</option>
                              <option value="İptal Edildi">İptal Edildi</option>
                            </select>
                            <button
                              onClick={handleStatusCancel}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div 
                            className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                            onClick={() => handleStatusClick(reservation.id)}
                          >
                            {getReservationStatusBadge(reservation.status)}
                          </div>
                        )}
                      </td>
                      
                      {/* Ödeme Durumu */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentStatusBadge(reservation.paymentStatus)}
                        <div className="text-xs text-gray-500 mt-1">
                          {formatPrice(reservation.remainingAmount)} kalan
                        </div>
                      </td>
                      
                      {/* İşlemler */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Tooltip content="Görüntüle">
                            <button 
                              onClick={() => navigate(`/reservations/${reservation.id}`)}
                              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900 h-8 rounded-md gap-1.5 px-2.5"
                            >
                              <EyeIcon className="w-4 h-4 text-gray-600 pointer-events-none shrink-0" />
                            </button>
                          </Tooltip>
                          <Tooltip content="Düzenle">
                            <button 
                              onClick={() => navigate(`/reservations/${reservation.id}/edit`)}
                              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900 h-8 rounded-md gap-1.5 px-2.5"
                            >
                              <PencilIcon className="w-4 h-4 text-gray-600 pointer-events-none shrink-0" />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {startIndex + 1} - {Math.min(endIndex, sortedReservations.length)} arası, toplam {sortedReservations.length} kayıt
              </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              &lt; Önceki
            </button>
            
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 text-sm text-gray-500">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === page
                      ? 'text-white bg-gray-900'
                      : 'text-gray-600 hover:text-gray-800 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            ))}
            
            <button 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              Sonraki &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
