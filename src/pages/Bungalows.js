import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bungalows, BUNGALOW_STATUS, formatPrice, getReservationsByBungalowId } from '../data/data';
import { 
  BuildingOfficeIcon, 
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

const Bungalows = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tüm Durumlar');
  const [capacityFilter, setCapacityFilter] = useState('Tüm Kapasiteler');
  const [sortBy, setSortBy] = useState('Sıralama Yok');
  const [editingPrice, setEditingPrice] = useState(null);
  const [tempPrice, setTempPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Bungalov yönetimi state'leri
  const [showAddModal, setShowAddModal] = useState(false);
  const [bungalowForm, setBungalowForm] = useState({
    name: '',
    capacity: 2,
    dailyPrice: 0,
    status: BUNGALOW_STATUS.ACTIVE,
    description: '',
    amenities: []
  });

  // İstatistik hesaplamaları
  const totalBungalows = bungalows.length;
  const activeBungalows = bungalows.filter(b => b.status === BUNGALOW_STATUS.ACTIVE).length;
  const averagePrice = Math.round(bungalows.reduce((sum, b) => sum + b.dailyPrice, 0) / bungalows.length);

  // Dinamik filtre seçenekleri
  const availableStatuses = [...new Set(bungalows.map(b => b.status))].sort();
  const availableCapacities = [...new Set(bungalows.map(b => b.capacity))].sort((a, b) => a - b);

  // Dropdown seçenekleri
  const statusOptions = [
    { value: 'Tüm Durumlar', label: 'Tüm Durumlar' },
    ...availableStatuses.map(status => ({ value: status, label: status }))
  ];

  const capacityOptions = [
    { value: 'Tüm Kapasiteler', label: 'Tüm Kapasiteler' },
    ...availableCapacities.map(capacity => ({ value: `${capacity} kişi`, label: `${capacity} kişi` }))
  ];

  const sortOptions = [
    { value: 'Sıralama Yok', label: 'Sıralama Yok' },
    { value: 'Fiyat (Düşük-Yüksek)', label: 'Fiyat (Düşük-Yüksek)' },
    { value: 'Fiyat (Yüksek-Düşük)', label: 'Fiyat (Yüksek-Düşük)' },
    { value: 'Kapasite (Düşük-Yüksek)', label: 'Kapasite (Düşük-Yüksek)' },
    { value: 'Kapasite (Yüksek-Düşük)', label: 'Kapasite (Yüksek-Düşük)' }
  ];

  // Filtreleme ve arama
  const filteredBungalows = bungalows.filter(bungalow => {
    const matchesSearch = bungalow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bungalow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bungalow.feature.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Tüm Durumlar' || bungalow.status === statusFilter;
    const matchesCapacity = capacityFilter === 'Tüm Kapasiteler' || 
                           bungalow.capacity.toString() === capacityFilter.split(' ')[0];
    
    return matchesSearch && matchesStatus && matchesCapacity;
  });

  // Sıralama fonksiyonu
  const sortedBungalows = [...filteredBungalows].sort((a, b) => {
    switch (sortBy) {
      case 'Fiyat (Düşük-Yüksek)':
        return a.dailyPrice - b.dailyPrice;
      case 'Fiyat (Yüksek-Düşük)':
        return b.dailyPrice - a.dailyPrice;
      case 'Kapasite (Düşük-Yüksek)':
        return a.capacity - b.capacity;
      case 'Kapasite (Yüksek-Düşük)':
        return b.capacity - a.capacity;
      default:
        return 0;
    }
  });

  // Filtreleme değiştiğinde sayfa numarasını sıfırla
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, capacityFilter, sortBy]);

  // Pagination fonksiyonları
  const totalPages = Math.ceil(sortedBungalows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBungalows = sortedBungalows.slice(startIndex, endIndex);

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

  // Bungalov yönetimi fonksiyonları
  const handleAddBungalow = () => {
    setBungalowForm({
      name: '',
      capacity: 2,
      dailyPrice: 0,
      status: BUNGALOW_STATUS.ACTIVE,
      description: '',
      amenities: []
    });
    setShowAddModal(true);
  };

  const handleEditBungalow = (bungalow) => {
    navigate(`/bungalows/${bungalow.id}/edit`);
  };

  const handleViewBungalow = (bungalow) => {
    navigate(`/bungalows/${bungalow.id}`);
  };

  const handleSaveBungalow = () => {
    // Burada gerçek uygulamada API çağrısı yapılacak
    console.log('Bungalov kaydediliyor:', bungalowForm);
    toast.success('Bungalov başarıyla kaydedildi!');
    setShowAddModal(false);
  };

  const handleFormChange = (field, value) => {
    setBungalowForm(prev => ({
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Aktif': 'bg-gray-900 text-white',
      'Pasif': 'bg-gray-100 text-gray-800',
      'Bakımda': 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 text-xs ${statusConfig[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getReservationCount = (bungalowId) => {
    return getReservationsByBungalowId(bungalowId).length;
  };

  const handlePriceEdit = (bungalowId, currentPrice) => {
    setEditingPrice(bungalowId);
    setTempPrice(currentPrice.toString());
  };

  const handlePriceSave = (bungalowId) => {
    const newPrice = parseFloat(tempPrice);
    if (!isNaN(newPrice) && newPrice > 0) {
      // Burada gerçek uygulamada API çağrısı yapılacak
      console.log(`Bungalov ${bungalowId} fiyatı ${newPrice} olarak güncellendi`);
      // Şimdilik sadece console'a yazdırıyoruz
    }
    setEditingPrice(null);
    setTempPrice('');
  };

  const handlePriceCancel = () => {
    setEditingPrice(null);
    setTempPrice('');
  };

  const handlePriceKeyPress = (e, bungalowId) => {
    if (e.key === 'Enter') {
      handlePriceSave(bungalowId);
    } else if (e.key === 'Escape') {
      handlePriceCancel();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Başlık ve Header Butonları */}
        <div className="flex justify-between items-center  mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bungalov Yönetimi</h1>
            <p className="text-gray-600 mt-1">Bungalovları görüntüle, düzenle ve yönet</p>
          </div>
          <button 
            onClick={handleAddBungalow}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Yeni Bungalov</span>
          </button>
        </div>

        

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Bungalov</p>
                <p className="text-2xl font-bold text-gray-900">{totalBungalows}</p>
              </div>
              <BuildingOfficeIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Bungalov</p>
                <p className="text-2xl font-bold text-gray-900">{activeBungalows}</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ortalama Fiyat</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(averagePrice)}</p>
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
                  placeholder="Bungalov adı veya açıklama ara..."
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
              placeholder="Durum Seçin"
            />
            
            {/* Kapasite Filtresi */}
            <CustomDropdown
              options={capacityOptions}
              value={capacityFilter}
              onChange={setCapacityFilter}
              placeholder="Kapasite Seçin"
            />
            
            {/* Sıralama */}
            <CustomDropdown
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sıralama Seçin"
            />
          </div>
        </div>
        {/* Sonuç Sayısı */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {sortedBungalows.length} bungalov bulundu
            {searchTerm && ` (${searchTerm} için arama)`}
            {statusFilter !== 'Tüm Durumlar' && ` - ${statusFilter} durumu`}
            {capacityFilter !== 'Tüm Kapasiteler' && ` - ${capacityFilter}`}
            {sortBy !== 'Sıralama Yok' && ` - ${sortBy} sıralaması`}
          </p>
        </div>

        {/* Bungalov Listesi */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                    Bungalov
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kapasite
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    KDV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rezervasyon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBungalows.map((bungalow, index) => (
                  <tr key={bungalow.id} className={`hover:bg-gray-50 ${index === currentBungalows.length - 1 ? 'last:rounded-b-lg' : ''}`}>
                    <td className={`px-6 py-4 ${index === currentBungalows.length - 1 ? 'rounded-bl-lg' : ''}`}>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {bungalow.name}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {bungalow.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{bungalow.capacity} kişi</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingPrice === bungalow.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            onKeyDown={(e) => handlePriceKeyPress(e, bungalow.id)}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handlePriceSave(bungalow.id)}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handlePriceCancel}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="text-sm text-gray-900 cursor-pointer hover:text-gray-600 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                          onClick={() => handlePriceEdit(bungalow.id, bungalow.dailyPrice)}
                        >
                          {formatPrice(bungalow.dailyPrice)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Dahil</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(bungalow.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getReservationCount(bungalow.id)} rezervasyon
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${index === currentBungalows.length - 1 ? 'rounded-br-lg' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <Tooltip content="Rezervasyon Oluştur">
                          <button 
                            onClick={() => navigate(`/create-reservation?bungalowId=${bungalow.id}`)}
                            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900 h-8 rounded-md gap-1.5 px-2.5"
                          >
                            <PlusIcon className="w-4 h-4 text-gray-600 pointer-events-none shrink-0" />
                          </button>
                        </Tooltip>
                        <Tooltip content="Görüntüle">
                          <button 
                            onClick={() => handleViewBungalow(bungalow)}
                            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900 h-8 rounded-md gap-1.5 px-2.5"
                          >
                            <EyeIcon className="w-4 h-4 text-gray-600 pointer-events-none shrink-0" />
                          </button>
                        </Tooltip>
                        <Tooltip content="Düzenle">
                          <button 
                            onClick={() => handleEditBungalow(bungalow)}
                            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900 h-8 rounded-md gap-1.5 px-2.5"
                          >
                            <PencilIcon className="w-4 h-4 text-gray-600 pointer-events-none shrink-0" />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {startIndex + 1} - {Math.min(endIndex, sortedBungalows.length)} arası, toplam {sortedBungalows.length} kayıt
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

      {/* Bungalov Ekleme Modal'ı */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Yeni Bungalov Ekle</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bungalov Adı</label>
                  <input
                    type="text"
                    value={bungalowForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Bungalov adını girin"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kapasite</label>
                  <input
                    type="number"
                    value={bungalowForm.capacity}
                    onChange={(e) => handleFormChange('capacity', parseInt(e.target.value))}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Günlük Fiyat (₺)</label>
                  <input
                    type="number"
                    value={bungalowForm.dailyPrice}
                    onChange={(e) => handleFormChange('dailyPrice', parseInt(e.target.value))}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                  <select
                    value={bungalowForm.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value={BUNGALOW_STATUS.ACTIVE}>Aktif</option>
                    <option value={BUNGALOW_STATUS.INACTIVE}>Pasif</option>
                    <option value={BUNGALOW_STATUS.MAINTENANCE}>Bakımda</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <textarea
                    value={bungalowForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                    placeholder="Bungalov açıklaması"
                  />
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
                  onClick={handleSaveBungalow}
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

export default Bungalows;
