import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, CUSTOMER_STATUS, customerService } from '../data/data';
import toast from 'react-hot-toast';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  XCircleIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';
import { BadgeTurkishLiraIcon } from '../components/ui/icons/lucide-badge-turkish-lira';
import { Tooltip, CustomDropdown, Pagination, StatusBadge, Button, Modal, ModalBody, ModalFooter } from '../components/ui';
import { usePagination, useSearch, useSort, useFilter } from '../hooks';
import { STATUS } from '../utils';

const Customers = () => {
  const navigate = useNavigate();
  
  // Müşteri verilerini state olarak yönet
  const [customers, setCustomers] = useState(() => customerService.getAll());
  
  // Modal state'leri
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [customerToBan, setCustomerToBan] = useState(null);
  
  // Form state'i
  const [customerForm, setCustomerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    tcNumber: '',
    passportNumber: '',
    isTurkish: true,
    status: CUSTOMER_STATUS.ACTIVE
  });

  // Custom hooks kullanımı
  const { filteredData: searchResults, handleSearch, clearSearch, isSearching } = useSearch(
    customers, 
    ['firstName', 'lastName', 'email', 'phone', 'tcNumber']
  );

  const { filteredData: filterResults, filters, setFilter, clearAllFilters, hasActiveFilters } = useFilter(
    searchResults,
    { status: '' }
  );

  const { sortedData, handleSort } = useSort(filterResults);

  const {
    currentData: paginatedData,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    goToPage,
    goToNextPage,
    goToPreviousPage
  } = usePagination(sortedData);

  // İstatistik hesaplamaları
  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((sum, customer) => sum + (customer.totalSpent || 0), 0);
    const bannedCustomers = customers.filter(customer => customer.status === CUSTOMER_STATUS.BANNED).length;
    const totalReservations = customers.reduce((sum, customer) => sum + (customer.totalReservations || 0), 0);

    return { totalCustomers, totalRevenue, bannedCustomers, totalReservations };
  }, [customers]);

  // Dropdown seçenekleri
  const statusOptions = useMemo(() => [
    { value: '', label: 'Tüm Durumlar' },
    ...Object.values(STATUS.CUSTOMER).map(status => ({ value: status, label: status }))
  ], []);

  const sortOptions = useMemo(() => [
    { value: '', label: 'Sıralama Yok' },
    { value: 'firstName', label: 'Ad (A-Z)' },
    { value: 'firstName:desc', label: 'Ad (Z-A)' },
    { value: 'totalSpent:desc', label: 'Harcama (Yüksek-Düşük)' },
    { value: 'totalSpent', label: 'Harcama (Düşük-Yüksek)' },
    { value: 'totalReservations:desc', label: 'Rezervasyon (Çok-Az)' },
    { value: 'totalReservations', label: 'Rezervasyon (Az-Çok)' }
  ], []);

  // Event handlers
  const handleAddCustomer = () => {
    setCustomerForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      tcNumber: '',
      passportNumber: '',
      isTurkish: true,
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
    try {
      const newCustomer = customerService.create(customerForm);
      if (newCustomer) {
        // State'i güncelle
        setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
        toast.success('Müşteri başarıyla kaydedildi!');
        setShowAddModal(false);
      } else {
        toast.error('Müşteri kaydedilirken hata oluştu!');
      }
    } catch (error) {
      console.error('Müşteri kaydetme hatası:', error);
      toast.error('Müşteri kaydedilirken hata oluştu!');
    }
  };

  const handleFormChange = (field, value) => {
    setCustomerForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBanCustomer = (customer) => {
    setCustomerToBan(customer);
    setShowBanModal(true);
  };

  const confirmBanCustomer = () => {
    if (customerToBan) {
      try {
        const newStatus = customerToBan.status === 'Yasaklı' ? 'Aktif' : 'Yasaklı';
        const updatedCustomer = {
          ...customerToBan,
          status: newStatus
        };
        
        customerService.update(customerToBan.id, updatedCustomer);
        
        const actionText = newStatus === 'Yasaklı' ? 'banlandı' : 'banı kaldırıldı';
        toast.success(`Müşteri başarıyla ${actionText}!`);
        
        window.location.reload();
      } catch (error) {
        console.error('Müşteri durumu güncelleme hatası:', error);
        toast.error('Müşteri durumu güncellenirken hata oluştu!');
      }
    }
    setShowBanModal(false);
    setCustomerToBan(null);
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
          <Button
            onClick={handleAddCustomer}
            icon={<PlusIcon className="w-4 h-4" />}
          >
            Yeni Müşteri
          </Button>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
              <UserIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <BadgeTurkishLiraIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Rezervasyon</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReservations}</p>
              </div>
              <BuildingOfficeIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Yasaklı Müşteri</p>
                <p className="text-2xl font-bold text-gray-900">{stats.bannedCustomers}</p>
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
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
              >
                Filtreleri Temizle
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Arama */}
            <div className="md:col-span-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Müşteri adı, e-posta, telefon veya TC ile ara..."
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm transition-colors"
                />
                {isSearching && (
                  <button
                    onClick={clearSearch}
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
              value={filters.status}
              onChange={(value) => setFilter('status', value)}
              placeholder="Durum"
            />
            
            {/* Sıralama */}
            <CustomDropdown
              options={sortOptions}
              value=""
              onChange={(value) => {
                if (value.includes(':')) {
                  const [field, direction] = value.split(':');
                  handleSort(field, direction);
                } else {
                  handleSort(value);
                }
              }}
              placeholder="Sıralama"
            />
          </div>
        </div>

        {/* Sonuç Sayısı */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {totalItems} müşteri bulundu
            {isSearching && ' (arama sonucu)'}
            {hasActiveFilters && ' (filtrelenmiş)'}
          </p>
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
                    Kayıt Tarihi
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
                {paginatedData.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {customer.firstName} {customer.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.isTurkish ? `TC: ${customer.tcNumber}` : `Pasaport: ${customer.passportNumber}`}
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
                      <div className="text-sm text-gray-900">
                        {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={customer.status} type="customer" />
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
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<EyeIcon className="w-4 h-4" />}
                            onClick={() => handleViewCustomer(customer)}
                          />
                        </Tooltip>
                        <Tooltip content="Düzenle">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<PencilIcon className="w-4 h-4" />}
                            onClick={() => handleEditCustomer(customer)}
                          />
                        </Tooltip>
                        <Tooltip content={customer.status === 'Yasaklı' ? 'Banı Kaldır' : 'Banla'}>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={<NoSymbolIcon className="w-4 h-4" />}
                            onClick={() => handleBanCustomer(customer)}
                          />
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
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onPreviousPage={goToNextPage}
            onNextPage={goToPreviousPage}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
          />
        </div>
      </div>

      {/* Müşteri Ekleme Modal'ı */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Yeni Müşteri Ekle"
        size="md"
      >
        <ModalBody>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Kimlik Bilgisi</label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="turkish"
                    name="isTurkish"
                    checked={customerForm.isTurkish}
                    onChange={() => handleFormChange('isTurkish', true)}
                    className="w-4 h-4 text-gray-600"
                  />
                  <label htmlFor="turkish" className="text-sm text-gray-700">Türk Vatandaşı</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="foreign"
                    name="isTurkish"
                    checked={!customerForm.isTurkish}
                    onChange={() => handleFormChange('isTurkish', false)}
                    className="w-4 h-4 text-gray-600"
                  />
                  <label htmlFor="foreign" className="text-sm text-gray-700">Yabancı Uyruklu</label>
                </div>
              </div>
            </div>
            
            {customerForm.isTurkish ? (
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
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pasaport No</label>
                <input
                  type="text"
                  value={customerForm.passportNumber}
                  onChange={(e) => handleFormChange('passportNumber', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="A1234567"
                />
              </div>
            )}
            
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
        </ModalBody>
        
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setShowAddModal(false)}
          >
            İptal
          </Button>
          <Button
            onClick={handleSaveCustomer}
          >
            Kaydet
          </Button>
        </ModalFooter>
      </Modal>

      {/* Banla/Banı Kaldır Onay Modal'ı */}
      <Modal
        isOpen={showBanModal}
        onClose={() => {
          setShowBanModal(false);
          setCustomerToBan(null);
        }}
        title={customerToBan?.status === 'Yasaklı' ? 'Müşterinin Banını Kaldır' : 'Müşteriyi Banla'}
        size="sm"
      >
        <ModalBody>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <NoSymbolIcon className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-sm text-gray-500 mb-2">
              {customerToBan ? `${customerToBan.firstName} ${customerToBan.lastName} müşterisinin ${customerToBan.status === 'Yasaklı' ? 'banını kaldırmak' : 'banlamak'} istediğinizden emin misiniz?` : ''}
            </p>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => {
              setShowBanModal(false);
              setCustomerToBan(null);
            }}
          >
            İptal
          </Button>
          <Button
            variant="danger"
            onClick={confirmBanCustomer}
          >
            {customerToBan?.status === 'Yasaklı' ? 'Banı Kaldır' : 'Banla'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Customers;