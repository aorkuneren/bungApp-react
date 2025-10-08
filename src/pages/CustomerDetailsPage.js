import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  CalendarIcon, 
  BuildingOfficeIcon,
  PencilIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  NoSymbolIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { BadgeTurkishLiraIcon } from '../components/ui/icons/lucide-badge-turkish-lira';
import { getReservationsByCustomerId, formatDate, formatPrice, getCustomerStatusBadge, customerService } from '../data/data';

// Tooltip component
const Tooltip = ({ content, children }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [customerReservations, setCustomerReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Müşteri bilgilerini getir
    const foundCustomer = customerService.getById(id);
    if (foundCustomer) {
      setCustomer(foundCustomer);
      // Müşteri rezervasyonlarını getir
      const reservations = getReservationsByCustomerId(foundCustomer.id);
      setCustomerReservations(reservations);
    }
  }, [id]);

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
  const totalPages = Math.ceil(customerReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReservations = customerReservations.slice(startIndex, endIndex);

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

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Müşteri bulunamadı</p>
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
                <h1 className="text-2xl font-bold text-gray-900">{customer.firstName} {customer.lastName}</h1>
                <p className="text-gray-600 mt-1">Müşteri Detayları</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                <NoSymbolIcon className="w-4 h-4" />
                <span>Banla</span>
              </button>
              <button 
                onClick={() => navigate(`/customers/${customer.id}/edit`)}
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
          {/* Üst Bölüm - Müşteri Bilgileri ve İstatistikler */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Müşteri Bilgileri Kartı */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <UserIcon className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-medium text-gray-900">Müşteri Bilgileri</h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                  <div className="flex items-center">
                    {getCustomerStatusBadge(customer.status)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                  <div className="flex items-center text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                    <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                    {customer.email}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <div className="flex items-center text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                    <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                    {customer.phone}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {customer.isTurkish ? 'TC Kimlik No' : 'Pasaport No'}
                  </label>
                  <div className="flex items-center text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                    <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                    {customer.isTurkish ? customer.tcNumber : customer.passportNumber}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kayıt Tarihi</label>
                  <div className="flex items-center text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                    <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                    {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                  </div>
                </div>
              </div>
            </div>

            {/* İstatistikler Kartı */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <BuildingOfficeIcon className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-medium text-gray-900">İstatistikler</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Toplam Harcama</p>
                      <p className="text-xl font-bold text-gray-900">{formatPrice(customer.totalSpent)}</p>
                    </div>
                    <BadgeTurkishLiraIcon className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Toplam Rezervasyon</p>
                      <p className="text-xl font-bold text-gray-900">{customer.totalReservations}</p>
                    </div>
                    <CalendarIcon className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Ortalama Rezervasyon Tutarı</p>
                      <p className="text-xl font-bold text-gray-900">
                        {customer.totalReservations > 0 
                          ? formatPrice(Math.round(customer.totalSpent / customer.totalReservations))
                          : '₺0'
                        }
                      </p>
                    </div>
                    <CreditCardIcon className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alt Bölüm - Rezervasyon Geçmişi */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <CalendarIcon className="w-5 h-5 text-gray-600" />
              <div>
                <h2 className="text-lg font-medium text-gray-900">Rezervasyon Geçmişi</h2>
                <p className="text-sm text-gray-500">Müşteri rezervasyon geçmişi</p>
              </div>
            </div>
              
            {customerReservations.length > 0 ? (
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
                        {currentReservations.map((reservation) => (
                          <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                            {/* Rezervasyon Kodu */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {reservation.reservationCode}
                              </div>
                            </td>
                            
                            {/* Bungalov Adı */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button 
                                onClick={() => navigate('/bungalows')}
                                className="text-sm text-gray-900 hover:text-gray-600 hover:underline cursor-pointer"
                              >
                                {reservation.bungalowName}
                              </button>
                              <div className="text-sm text-gray-500">
                                {Math.ceil((new Date(reservation.checkOutDate) - new Date(reservation.checkInDate)) / (1000 * 60 * 60 * 24))} gece, {reservation.guestCount} kişi
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sayfalama */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      {startIndex + 1} - {Math.min(endIndex, customerReservations.length)} arası, toplam {customerReservations.length} kayıt
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
                <p className="text-gray-400 text-sm mt-1">Bu müşteriye ait rezervasyon kaydı bulunmamaktadır.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsPage;