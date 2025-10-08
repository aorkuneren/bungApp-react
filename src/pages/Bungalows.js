import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BUNGALOW_STATUS, formatPrice, getReservationsByBungalowId, bungalowService } from '../data/data';
import { 
  BuildingOfficeIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { BadgeTurkishLiraIcon } from '../components/ui/icons/lucide-badge-turkish-lira';
import { Tooltip, CustomDropdown, Pagination, StatusBadge, Button, Modal, ModalBody, ModalFooter } from '../components/ui';
import { usePagination, useSearch, useSort, useFilter } from '../hooks';
import { STATUS } from '../utils';

const Bungalows = () => {
  const navigate = useNavigate();
  
  // Bungalov verilerini state olarak yönet
  const [bungalows, setBungalows] = useState(() => bungalowService.getAll());
  
  // Modal state'leri
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bungalowToDelete, setBungalowToDelete] = useState(null);
  
  // Form state'i
  const [bungalowForm, setBungalowForm] = useState({
    name: '',
    capacity: 2,
    dailyPrice: 0,
    status: BUNGALOW_STATUS.ACTIVE,
    description: '',
    amenities: []
  });

  // Fiyat düzenleme state'i
  const [editingPrice, setEditingPrice] = useState(null);
  const [tempPrice, setTempPrice] = useState('');

  // Custom hooks kullanımı
  const { filteredData: searchResults, handleSearch, clearSearch, isSearching } = useSearch(
    bungalows, 
    ['name', 'description', 'feature']
  );

  const { filteredData: filterResults, filters, setFilter, clearAllFilters, hasActiveFilters } = useFilter(
    searchResults,
    { status: '', capacity: '' }
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
    const totalBungalows = bungalows.length;
    const activeBungalows = bungalows.filter(b => b.status === BUNGALOW_STATUS.ACTIVE).length;
    const averagePrice = bungalows.length > 0 
      ? Math.round(bungalows.reduce((sum, b) => sum + b.dailyPrice, 0) / bungalows.length)
      : 0;

    return { totalBungalows, activeBungalows, averagePrice };
  }, []);

  // Dropdown seçenekleri
  const statusOptions = useMemo(() => [
    { value: '', label: 'Tüm Durumlar' },
    ...Object.values(STATUS.BUNGALOW).map(status => ({ value: status, label: status }))
  ], []);

  const capacityOptions = useMemo(() => [
    { value: '', label: 'Tüm Kapasiteler' },
    ...Array.from(new Set(bungalows.map(b => b.capacity)))
      .sort((a, b) => a - b)
      .map(capacity => ({ value: capacity.toString(), label: `${capacity} kişi` }))
  ], []);

  const sortOptions = useMemo(() => [
    { value: '', label: 'Sıralama Yok' },
    { value: 'dailyPrice', label: 'Fiyat (Düşük-Yüksek)' },
    { value: 'dailyPrice:desc', label: 'Fiyat (Yüksek-Düşük)' },
    { value: 'capacity', label: 'Kapasite (Düşük-Yüksek)' },
    { value: 'capacity:desc', label: 'Kapasite (Yüksek-Düşük)' },
    { value: 'name', label: 'İsim (A-Z)' },
    { value: 'name:desc', label: 'İsim (Z-A)' }
  ], []);

  // Event handlers
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

  const handleDeleteBungalow = (bungalow) => {
    setBungalowToDelete(bungalow);
    setShowDeleteModal(true);
  };

  const confirmDeleteBungalow = () => {
    if (!bungalowToDelete) return;

    try {
      const reservations = getReservationsByBungalowId(bungalowToDelete.id);
      if (reservations.length > 0) {
        toast.error('Bu bungalovda aktif rezervasyonlar bulunuyor. Önce rezervasyonları iptal edin.');
        setShowDeleteModal(false);
        setBungalowToDelete(null);
        return;
      }

      const success = bungalowService.delete(bungalowToDelete.id);
      if (success) {
        // State'i güncelle
        setBungalows(prevBungalows => 
          prevBungalows.filter(bungalow => bungalow.id !== bungalowToDelete.id)
        );
        toast.success('Bungalov başarıyla silindi!');
        setShowDeleteModal(false);
        setBungalowToDelete(null);
      } else {
        toast.error('Bungalov silinirken hata oluştu!');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      toast.error('Bungalov silinirken hata oluştu!');
    }
  };

  const handleSaveBungalow = () => {
    try {
      const newBungalow = bungalowService.create(bungalowForm);
      if (newBungalow) {
        // State'i güncelle
        setBungalows(prevBungalows => [...prevBungalows, newBungalow]);
        toast.success('Bungalov başarıyla kaydedildi!');
        setShowAddModal(false);
      } else {
        toast.error('Bungalov kaydedilirken hata oluştu!');
      }
    } catch (error) {
      console.error('Bungalov kaydetme hatası:', error);
      toast.error('Bungalov kaydedilirken hata oluştu!');
    }
  };

  const handleFormChange = (field, value) => {
    setBungalowForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePriceEdit = (bungalowId, currentPrice) => {
    setEditingPrice(bungalowId);
    setTempPrice(currentPrice.toString());
  };

  const handlePriceSave = (bungalowId) => {
    const newPrice = parseFloat(tempPrice);
    if (!isNaN(newPrice) && newPrice > 0) {
      try {
        // Bungalov fiyatını güncelle
        const updatedBungalow = bungalowService.update(bungalowId, { dailyPrice: newPrice });
        if (updatedBungalow) {
          // State'i güncelle
          setBungalows(prevBungalows => 
            prevBungalows.map(bungalow => 
              bungalow.id === bungalowId 
                ? { ...bungalow, dailyPrice: newPrice, updatedAt: updatedBungalow.updatedAt }
                : bungalow
            )
          );
          toast.success('Fiyat başarıyla güncellendi!');
        } else {
          toast.error('Fiyat güncellenirken hata oluştu!');
        }
      } catch (error) {
        console.error('Fiyat güncelleme hatası:', error);
        toast.error('Fiyat güncellenirken hata oluştu!');
      }
    } else {
      toast.error('Geçerli bir fiyat girin!');
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

  const getReservationCount = (bungalowId) => {
    return getReservationsByBungalowId(bungalowId).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Başlık ve Header Butonları */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bungalov Yönetimi</h1>
            <p className="text-gray-600 mt-1">Bungalovları görüntüle, düzenle ve yönet</p>
          </div>
          <Button
            onClick={handleAddBungalow}
            icon={<PlusIcon className="w-4 h-4" />}
          >
            Yeni Bungalov
          </Button>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Bungalov</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBungalows}</p>
              </div>
              <BuildingOfficeIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Bungalov</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeBungalows}</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ortalama Fiyat</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.averagePrice)}</p>
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Arama */}
            <div className="md:col-span-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Bungalov adı veya açıklama ara..."
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
              placeholder="Durum Seçin"
            />
            
            {/* Kapasite Filtresi */}
            <CustomDropdown
              options={capacityOptions}
              value={filters.capacity}
              onChange={(value) => setFilter('capacity', value)}
              placeholder="Kapasite Seçin"
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
              placeholder="Sıralama Seçin"
            />
          </div>
        </div>

        {/* Sonuç Sayısı */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {totalItems} bungalov bulundu
            {isSearching && ' (arama sonucu)'}
            {hasActiveFilters && ' (filtrelenmiş)'}
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
                    Gecelik Fiyat
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
                {paginatedData.map((bungalow, index) => (
                  <tr key={bungalow.id} className={`hover:bg-gray-50 ${index === paginatedData.length - 1 ? 'last:rounded-b-lg' : ''}`}>
                    <td className={`px-6 py-4 ${index === paginatedData.length - 1 ? 'rounded-bl-lg' : ''}`}>
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
                          <div className="relative">
                            <input
                              type="text"
                              value={tempPrice}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, '');
                                setTempPrice(value);
                              }}
                              onKeyDown={(e) => handlePriceKeyPress(e, bungalow.id)}
                              className="w-24 px-2 py-1 pr-6 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                              placeholder="0"
                              autoFocus
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                              <BadgeTurkishLiraIcon className="w-3 h-3 text-gray-400" />
                            </div>
                          </div>
                          <button
                            onClick={() => handlePriceSave(bungalow.id)}
                            className="text-green-600 hover:text-green-800 text-sm p-1 hover:bg-green-100 rounded"
                            title="Kaydet"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handlePriceCancel}
                            className="text-red-600 hover:text-red-800 text-sm p-1 hover:bg-red-100 rounded"
                            title="İptal"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="text-sm text-gray-900 cursor-pointer hover:text-gray-600 hover:bg-gray-100 px-2 py-1 rounded transition-colors group"
                          onClick={() => handlePriceEdit(bungalow.id, bungalow.dailyPrice)}
                          title="Fiyatı düzenlemek için tıklayın"
                        >
                          <div className="flex items-center space-x-1">
                            <span>{formatPrice(bungalow.dailyPrice)}</span>
                            <PencilIcon className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={bungalow.status} type="bungalow" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getReservationCount(bungalow.id)} rezervasyon
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${index === paginatedData.length - 1 ? 'rounded-br-lg' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <Tooltip content="Rezervasyon Oluştur">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<PlusIcon className="w-4 h-4" />}
                            onClick={() => navigate(`/create-reservation?bungalowId=${bungalow.id}`)}
                          />
                        </Tooltip>
                        <Tooltip content="Görüntüle">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<EyeIcon className="w-4 h-4" />}
                            onClick={() => handleViewBungalow(bungalow)}
                          />
                        </Tooltip>
                        <Tooltip content="Düzenle">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<PencilIcon className="w-4 h-4" />}
                            onClick={() => handleEditBungalow(bungalow)}
                          />
                        </Tooltip>
                        <Tooltip content="Sil">
                          <Button
                            variant="danger"
                            size="sm"
                            icon={<TrashIcon className="w-4 h-4" />}
                            onClick={() => handleDeleteBungalow(bungalow)}
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
            onPreviousPage={goToPreviousPage}
            onNextPage={goToNextPage}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
          />
        </div>
      </div>

      {/* Bungalov Ekleme Modal'ı */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Yeni Bungalov Ekle"
        size="md"
      >
        <ModalBody>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Gecelik Fiyat (₺)</label>
              <div className="relative">
                <input
                  type="text"
                  value={bungalowForm.dailyPrice === 0 ? '' : bungalowForm.dailyPrice.toString()}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    handleFormChange('dailyPrice', parseInt(value) || 0);
                  }}
                  className="w-full h-10 px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <BadgeTurkishLiraIcon className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              {bungalowForm.dailyPrice > 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  Formatlanmış: {bungalowForm.dailyPrice.toLocaleString('tr-TR')} ₺
                </p>
              )}
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
        </ModalBody>
        
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setShowAddModal(false)}
          >
            İptal
          </Button>
          <Button
            onClick={handleSaveBungalow}
          >
            Kaydet
          </Button>
        </ModalFooter>
      </Modal>

      {/* Silme Onay Modal'ı */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setBungalowToDelete(null);
        }}
        title="Bungalov Sil"
        size="sm"
      >
        <ModalBody>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-sm text-gray-500 mb-2">
              <strong>{bungalowToDelete?.name}</strong> bungalovunu silmek istediğinizden emin misiniz?
            </p>
            <p className="text-sm text-red-600 font-medium">
              Bu işlem geri alınamaz!
            </p>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => {
              setShowDeleteModal(false);
              setBungalowToDelete(null);
            }}
          >
            İptal
          </Button>
          <Button
            variant="danger"
            onClick={confirmDeleteBungalow}
          >
            Evet, Sil
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Bungalows;