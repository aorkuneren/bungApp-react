import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  BuildingOfficeIcon,
  UserIcon,
  CalendarIcon,
  PencilIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ClockIcon,
  EyeIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { BadgeTurkishLiraIcon } from '../components/ui/icons/lucide-badge-turkish-lira';
import { bungalows, getReservationsByBungalowId, getCustomerById, formatPrice, formatDate, RESERVATION_STATUS } from '../data/data';
import { OccupancyCalendar, StatCard, Tooltip } from '../components/ui';


const BungalowDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bungalow, setBungalow] = useState(null);
  const [bungalowReservations, setBungalowReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  

  useEffect(() => {
    // Bungalov bilgilerini getir
    const foundBungalow = bungalows.find(b => b.id === parseInt(id));
    if (foundBungalow) {
      setBungalow(foundBungalow);
      // Bungalov rezervasyonlarını getir
      const reservations = getReservationsByBungalowId(foundBungalow.id);
      setBungalowReservations(reservations);
    }
  }, [id]);


  // Bungalov durumu badge'i
  const getBungalowStatusBadge = (status) => {
    const statusConfig = {
      'Aktif': { bg: 'bg-green-100', text: 'text-green-800', label: 'Aktif' },
      'Pasif': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Pasif' },
      'Bakımda': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Bakımda' }
    };
    
    const config = statusConfig[status] || statusConfig['Aktif'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Rezervasyon durumu badge'i
  const getReservationStatusBadge = (status) => {
    const statusConfig = {
      'Beklemede': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Beklemede' },
      'Onaylandı': { bg: 'bg-green-100', text: 'text-green-800', label: 'Onaylandı' },
      'Giriş Yapıldı': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Giriş Yapıldı' },
      'Çıkış Yapıldı': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Çıkış Yapıldı' },
      'İptal Edildi': { bg: 'bg-red-100', text: 'text-red-800', label: 'İptal Edildi' }
    };
    
    const config = statusConfig[status] || statusConfig['Beklemede'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Ödeme durumu badge'i
  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      'Ödenmedi': { bg: 'bg-red-100', text: 'text-red-800', label: 'Ödenmedi' },
      'Ödendi': { bg: 'bg-green-100', text: 'text-green-800', label: 'Ödendi' },
      'Kısmi Ödendi': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Kısmi Ödendi' },
      'Kapora Kesildi': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Kapora Kesildi' }
    };
    
    const config = statusConfig[status] || statusConfig['Ödenmedi'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Sayfalama hesaplamaları
  const totalPages = Math.ceil(bungalowReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReservations = bungalowReservations.slice(startIndex, endIndex);

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

  // İstatistik hesaplamaları
  const totalReservations = bungalowReservations.length;
  const activeReservations = bungalowReservations.filter(res => 
    res.status === RESERVATION_STATUS.CHECKED_IN
  ).length;
  const totalRevenue = bungalowReservations.reduce((sum, res) => sum + res.totalPrice, 0);
  const averageStay = totalReservations > 0 
    ? Math.round(bungalowReservations.reduce((sum, res) => sum + res.nights, 0) / totalReservations)
    : 0;
  
  // Ek istatistikler
  const completedReservations = bungalowReservations.filter(res => 
    res.status === RESERVATION_STATUS.CHECKED_OUT
  ).length;
  const totalGuests = bungalowReservations.reduce((sum, res) => sum + res.guestCount, 0);
  const averageGuests = totalReservations > 0 ? Math.round(totalGuests / totalReservations) : 0;
  
  // Bu ay için istatistikler
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthReservations = bungalowReservations.filter(res => {
    const resDate = new Date(res.checkInDate);
    return resDate.getMonth() === currentMonth && resDate.getFullYear() === currentYear;
  });
  const thisMonthRevenue = thisMonthReservations.reduce((sum, res) => sum + res.totalPrice, 0);

  if (!bungalow) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Bungalov bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Geri</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{bungalow.name}</h1>
                <p className="text-gray-600 mt-1">Bungalov Detayları</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate(`/bungalows/${bungalow.id}/edit`)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <PencilIcon className="w-4 h-4" />
                <span>Düzenle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="space-y-8">
          {/* Üst Bölüm - Bungalov Bilgileri ve İstatistikler */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bungalov Bilgileri Kartı */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <BuildingOfficeIcon className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-medium text-gray-900">Bungalov Bilgileri</h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                  <div className="flex items-center">
                    {getBungalowStatusBadge(bungalow.status)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kapasite</label>
                  <div className="flex items-center text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                    <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                    {bungalow.capacity} kişi
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gecelik Fiyat</label>
                  <div className="flex items-center text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                    <CurrencyDollarIcon className="w-4 h-4 text-gray-400 mr-2" />
                    {formatPrice(bungalow.dailyPrice)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Özellikler</label>
                  <div className="flex items-center text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                    <MapPinIcon className="w-4 h-4 text-gray-400 mr-2" />
                    {bungalow.feature || 'Özel özellik bulunmuyor'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                    {bungalow.description || 'Açıklama bulunmuyor'}
                  </div>
                </div>
              </div>
            </div>

            {/* İstatistikler Kartı */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <ChartBarIcon className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-medium text-gray-900">İstatistikler</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  title="Toplam Rezervasyon"
                  value={totalReservations}
                  icon={CalendarIcon}
                  color="blue"
                  subtitle={`${completedReservations} tamamlandı`}
                />
                
                <StatCard
                  title="Aktif Rezervasyon"
                  value={activeReservations}
                  icon={CheckCircleIcon}
                  color="green"
                  subtitle="Şu anda dolu"
                />
                
                <StatCard
                  title="Toplam Gelir"
                  value={formatPrice(totalRevenue)}
                  icon={BadgeTurkishLiraIcon}
                  color="green"
                  subtitle={`Bu ay: ${formatPrice(thisMonthRevenue)}`}
                />
                
                <StatCard
                  title="Ortalama Konaklama"
                  value={`${averageStay} gece`}
                  icon={ClockIcon}
                  color="yellow"
                  subtitle={`Ortalama ${averageGuests} kişi`}
                />
              </div>
            </div>
          </div>

          {/* Doluluk Takvimi */}
          <OccupancyCalendar
            bungalowId={bungalow.id}
            reservations={bungalowReservations}
            onDateClick={(day) => {
              if (day.reservations.length > 0) {
                // Rezervasyon detaylarını göster
                console.log('Tarih tıklandı:', day.dateStr, day.reservations);
              }
            }}
            className="mb-8"
          />

          {/* Alt Bölüm - Rezervasyon Geçmişi */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <CalendarIcon className="w-5 h-5 text-gray-600" />
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Rezervasyon Geçmişi</h2>
                  <p className="text-sm text-gray-500">Bu bungalova ait rezervasyon geçmişi</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/create-reservation?bungalowId=${bungalow.id}`)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Yeni Rezervasyon</span>
              </button>
            </div>
              
            {bungalowReservations.length > 0 ? (
              <>
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
                              
                              {/* Giriş/Çıkış Tarihi */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {formatDate(reservation.checkInDate)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {formatDate(reservation.checkOutDate)}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {reservation.nights} gece, {reservation.guestCount} kişi
                                </div>
                              </td>
                              
                              {/* Durumu */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getReservationStatusBadge(reservation.status)}
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

                {/* Sayfalama */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      {startIndex + 1} - {Math.min(endIndex, bungalowReservations.length)} arası, toplam {bungalowReservations.length} kayıt
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
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Henüz rezervasyon bulunmuyor</p>
                <p className="text-gray-400 text-sm mt-1">Bu bungalova ait rezervasyon kaydı bulunmamaktadır.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default BungalowDetailsPage;
