import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customers, formatPrice, CUSTOMER_STATUS, getCustomerStatusBadge } from '../data/data';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  ChevronDownIcon,
  CheckIcon,
  XCircleIcon
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

// CustomDropdown Component
const CustomDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
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

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm transition-colors flex items-center justify-between"
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 flex items-center justify-between"
            >
              <span>{option.label}</span>
              {value === option.value && (
                <CheckIcon className="w-4 h-4 text-gray-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Customers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('Sıralama Yok');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Müşteri yönetimi state'leri
  const [showAddModal, setShowAddModal] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    tcNumber: '',
    status: CUSTOMER_STATUS.ACTIVE
  });

  // İstatistik hesaplamaları
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const bannedCustomers = customers.filter(customer => customer.status === CUSTOMER_STATUS.BANNED).length;

  // Durum filtreleme seçenekleri
  const statusOptions = [
    { value: '', label: 'Tüm Durumlar' },
    { value: CUSTOMER_STATUS.ACTIVE, label: CUSTOMER_STATUS.ACTIVE },
    { value: CUSTOMER_STATUS.INACTIVE, label: CUSTOMER_STATUS.INACTIVE },
    { value: CUSTOMER_STATUS.BANNED, label: CUSTOMER_STATUS.BANNED }
  ];

  // Sıralama seçenekleri
  const sortOptions = [
    { value: 'Sıralama Yok', label: 'Sıralama Yok' },
    { value: 'Ad (A-Z)', label: 'Ad (A-Z)' },
    { value: 'Ad (Z-A)', label: 'Ad (Z-A)' },
    { value: 'Kayıt Tarihi (Yeni-Eski)', label: 'Kayıt Tarihi (Yeni-Eski)' },
    { value: 'Kayıt Tarihi (Eski-Yeni)', label: 'Kayıt Tarihi (Eski-Yeni)' },
    { value: 'Harcama (Yüksek-Düşük)', label: 'Harcama (Yüksek-Düşük)' },
    { value: 'Harcama (Düşük-Yüksek)', label: 'Harcama (Düşük-Yüksek)' },
    { value: 'Rezervasyon (Çok-Az)', label: 'Rezervasyon (Çok-Az)' },
    { value: 'Rezervasyon (Az-Çok)', label: 'Rezervasyon (Az-Çok)' }
  ];

  // Filtreleme ve arama
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.tcNumber.includes(searchTerm);
    
    const matchesStatus = statusFilter === '' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sıralama fonksiyonu
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (sortBy) {
      case 'Ad (A-Z)':
        return (a.firstName + ' ' + a.lastName).localeCompare(b.firstName + ' ' + b.lastName);
      case 'Ad (Z-A)':
        return (b.firstName + ' ' + b.lastName).localeCompare(a.firstName + ' ' + a.lastName);
      case 'Kayıt Tarihi (Yeni-Eski)':
        return new Date(b.registrationDate) - new Date(a.registrationDate);
      case 'Kayıt Tarihi (Eski-Yeni)':
        return new Date(a.registrationDate) - new Date(b.registrationDate);
      case 'Harcama (Yüksek-Düşük)':
        return b.totalSpent - a.totalSpent;
      case 'Harcama (Düşük-Yüksek)':
        return a.totalSpent - b.totalSpent;
      case 'Rezervasyon (Çok-Az)':
        return b.totalReservations - a.totalReservations;
      case 'Rezervasyon (Az-Çok)':
        return a.totalReservations - b.totalReservations;
      default:
        return 0;
    }
  });

  // Filtreleme değiştiğinde sayfa numarasını sıfırla
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  // Pagination fonksiyonları
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = sortedCustomers.slice(startIndex, endIndex);

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

  // Müşteri yönetimi fonksiyonları
  const handleAddCustomer = () => {
    setCustomerForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      tcNumber: '',
      status: CUSTOMER_STATUS.ACTIVE
    });
    setShowAddModal(true);
  };

  const handleEditCustomer = (customer) => {
    navigate(`/customers/${customer.id}/edit`);
  };

  const handleViewCustomer = (customer) => {
    navigate(`/customers/${customer.id}`);
  };

  const handleSaveCustomer = () => {
    // Burada gerçek uygulamada API çağrısı yapılacak
    console.log('Müşteri kaydediliyor:', customerForm);
    alert('Müşteri başarıyla kaydedildi!');
    setShowAddModal(false);
  };

  const handleFormChange = (field, value) => {
    setCustomerForm(prev => ({
      ...prev,
      [field]: value
    }));
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
            <h1 className="text-2xl font-bold text-gray-900">Müşteri Yönetimi</h1>
            <p className="text-gray-600 mt-1">Müşterileri görüntüle, düzenle ve yönet</p>
          </div>
          <button 
            onClick={handleAddCustomer}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Yeni Müşteri</span>
          </button>
        </div>

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                    <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
                  </div>
                  <UserIcon className="w-8 h-8 text-gray-400" />
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
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Yasaklı Müşteri</p>
                    <p className="text-2xl font-bold text-gray-900">{bannedCustomers}</p>
                  </div>
                  <XCircleIcon className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            </div>

        {/* Arama ve Filtreler */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Arama ve Filtreler</h3>
          </div>
          
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Arama */}
                <div className="md:col-span-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Müşteri adı, e-posta, telefon veya TC ile ara..."
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
                
                {/* Sıralama */}
                <CustomDropdown
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="Sıralama"
                />
              </div>
        </div>

        {/* Müşteriler Tablosu */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Müşteri
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İletişim
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rezervasyon & Harcama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCustomers.map((customer) => {
                  return (
                        <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <UserIcon className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {customer.firstName} {customer.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  TC: {customer.tcNumber}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-900">
                                <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                                {customer.email}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                                {customer.phone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getCustomerStatusBadge(customer.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-900">
                                <BuildingOfficeIcon className="w-4 h-4 text-gray-400 mr-2" />
                                {customer.totalReservations} rezervasyon
                              </div>
                              <div className="flex items-center text-sm text-gray-900">
                                <BadgeTurkishLiraIcon className="w-4 h-4 text-gray-400 mr-2" />
                                {formatPrice(customer.totalSpent)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Tooltip content="Detaylar">
                                <button 
                                  onClick={() => handleViewCustomer(customer)}
                                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900 h-8 rounded-md gap-1.5 px-2.5"
                                >
                                  <EyeIcon className="w-4 h-4 text-gray-600 pointer-events-none shrink-0" />
                                </button>
                              </Tooltip>
                              <Tooltip content="Düzenle">
                                <button 
                                  onClick={() => handleEditCustomer(customer)}
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
            {startIndex + 1} - {Math.min(endIndex, sortedCustomers.length)} arası, toplam {sortedCustomers.length} kayıt
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

      {/* Müşteri Ekleme Modal'ı */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Yeni Müşteri Ekle</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                    <input
                      type="text"
                      value={customerForm.firstName}
                      onChange={(e) => handleFormChange('firstName', e.target.value)}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="Ad"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                    <input
                      type="text"
                      value={customerForm.lastName}
                      onChange={(e) => handleFormChange('lastName', e.target.value)}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="Soyad"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                  <input
                    type="email"
                    value={customerForm.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="ornek@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input
                    type="tel"
                    value={customerForm.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="+90 555 123 45 67"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik No</label>
                  <input
                    type="text"
                    value={customerForm.tcNumber}
                    onChange={(e) => handleFormChange('tcNumber', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="12345678901"
                    maxLength="11"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                  <select
                    value={customerForm.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value={CUSTOMER_STATUS.ACTIVE}>Aktif</option>
                    <option value={CUSTOMER_STATUS.INACTIVE}>Pasif</option>
                    <option value={CUSTOMER_STATUS.BANNED}>Yasaklı</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  İptal
                </button>
                <button
                  onClick={handleSaveCustomer}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Customers;
