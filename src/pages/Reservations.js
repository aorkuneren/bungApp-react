import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { reservations, getBungalowById, getCustomerById, RESERVATION_STATUS, formatDate, formatPrice, reservationService } from '../data/data';
import toast from 'react-hot-toast';
import { 
  CalendarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { BadgeTurkishLiraIcon } from '../components/ui/icons/lucide-badge-turkish-lira';
import { Tooltip, CustomDropdown, Pagination, StatusBadge, Button } from '../components/ui';
import { usePagination, useSearch, useSort, useFilter } from '../hooks';
import { STATUS } from '../utils';

const Reservations = () => {
  const navigate = useNavigate();
  const [reservationsData, setReservationsData] = useState(reservations);
  const [editingStatus, setEditingStatus] = useState(null);

  // Custom hooks kullanımı
  const { filteredData: searchResults, handleSearch, clearSearch, isSearching } = useSearch(
    reservationsData, 
    ['reservationCode', 'code', 'customer.firstName', 'customer.lastName', 'customer.email']
  );

  const { filteredData: filterResults, filters, setFilter, clearAllFilters, hasActiveFilters } = useFilter(
    searchResults,
    { status: '', paymentStatus: '' }
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
    const totalReservations = reservationsData.length;
    const pendingReservations = reservationsData.filter(r => r.status === RESERVATION_STATUS.PENDING).length;
    const confirmedReservations = reservationsData.filter(r => r.status === RESERVATION_STATUS.CONFIRMED).length;
    const totalRevenue = reservationsData.reduce((sum, r) => sum + r.totalPrice, 0);

    return { totalReservations, pendingReservations, confirmedReservations, totalRevenue };
  }, [reservationsData]);

  // Dropdown seçenekleri
  const statusOptions = useMemo(() => [
    { value: '', label: 'Tüm Durumlar' },
    ...Object.values(STATUS.RESERVATION).map(status => ({ value: status, label: status }))
  ], []);

  const paymentOptions = useMemo(() => [
    { value: '', label: 'Tüm Ödemeler' },
    ...Object.values(STATUS.PAYMENT).map(status => ({ value: status, label: status }))
  ], []);

  const sortOptions = useMemo(() => [
    { value: '', label: 'Sıralama Yok' },
    { value: 'checkInDate', label: 'Giriş Tarihi (Yakın-Uzak)' },
    { value: 'checkInDate:desc', label: 'Giriş Tarihi (Uzak-Yakın)' },
    { value: 'checkOutDate', label: 'Çıkış Tarihi (Yakın-Uzak)' },
    { value: 'checkOutDate:desc', label: 'Çıkış Tarihi (Uzak-Yakın)' },
    { value: 'reservationCode', label: 'Rezervasyon Kodu (A-Z)' },
    { value: 'reservationCode:desc', label: 'Rezervasyon Kodu (Z-A)' },
    { value: 'totalPrice:desc', label: 'Toplam Tutar (Yüksek-Düşük)' },
    { value: 'totalPrice', label: 'Toplam Tutar (Düşük-Yüksek)' }
  ], []);

  // Event handlers
  const handleStatusClick = (reservationId) => {
    setEditingStatus(reservationId);
  };

  const handleStatusChange = (reservationId, newStatus) => {
    try {
      const updatedReservation = reservationService.update(reservationId, { status: newStatus });
      
      if (updatedReservation) {
        setReservationsData(prevReservations => 
          prevReservations.map(reservation => 
            reservation.id === reservationId 
              ? { ...reservation, status: newStatus }
              : reservation
          )
        );
        setEditingStatus(null);
        toast.success('Rezervasyon durumu güncellendi!');
      } else {
        toast.error('Durum güncellenirken hata oluştu!');
      }
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      toast.error('Durum güncellenirken hata oluştu!');
    }
  };

  const handleStatusCancel = () => {
    setEditingStatus(null);
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
          <Link to="/create-reservation">
            <Button
              icon={<PlusIcon className="w-4 h-4" />}
            >
              Yeni Rezervasyon
            </Button>
          </Link>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Rezervasyon</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReservations}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Beklemede</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReservations}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Onaylandı</p>
                <p className="text-2xl font-bold text-gray-900">{stats.confirmedReservations}</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-gray-400" />
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
                  placeholder="Müşteri adı, e-posta veya rezervasyon kodu ile ara..."
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
            
            {/* Ödeme Durumu Filtresi */}
            <CustomDropdown
              options={paymentOptions}
              value={filters.paymentStatus}
              onChange={(value) => setFilter('paymentStatus', value)}
              placeholder="Ödeme"
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
            {totalItems} rezervasyon bulundu
            {isSearching && ' (arama sonucu)'}
            {hasActiveFilters && ' (filtrelenmiş)'}
          </p>
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
                {paginatedData.map((reservation) => {
                  const bungalow = getBungalowById(reservation.bungalowId);
                  const customer = getCustomerById(reservation.customerId);
                  
                  return (
                    <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                      {/* Rezervasyon Kodu */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.reservationCode || reservation.code || 'Kod Yok'}
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
                            <StatusBadge status={reservation.status} type="reservation" />
                          </div>
                        )}
                      </td>
                      
                      {/* Ödeme Durumu */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={reservation.paymentStatus} type="payment" />
                        <div className="text-xs text-gray-500 mt-1">
                          {formatPrice(reservation.remainingAmount)} kalan
                        </div>
                      </td>
                      
                      {/* İşlemler */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Tooltip content="Görüntüle">
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<EyeIcon className="w-4 h-4" />}
                              onClick={() => navigate(`/reservations/${reservation.id}`)}
                            />
                          </Tooltip>
                          <Tooltip content="Düzenle">
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<PencilIcon className="w-4 h-4" />}
                              onClick={() => navigate(`/reservations/${reservation.id}/edit`)}
                            />
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
    </div>
  );
};

export default Reservations;