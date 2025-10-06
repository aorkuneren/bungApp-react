import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, getBungalowById, getCustomerById, getReservationStatusBadge, getPaymentStatusBadge } from '../data/data';
import { 
  CalendarIcon, 
  UsersIcon, 
  PlusIcon,
  EyeIcon,
  ChartBarIcon,
  UserIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { BadgeTurkishLiraIcon } from '../components/ui/icons/lucide-badge-turkish-lira';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isUpcomingExpanded, setIsUpcomingExpanded] = useState(false);
  const [isTodaysExpanded, setIsTodaysExpanded] = useState(false);

  // Boş veri durumu için varsayılan değerler
  const todaysReservations = [];
  const upcomingReservations = [];
  
  // Boş verilerle hesaplamalar
  const totalReservations = 0;
  const activeReservations = 0;
  const totalRevenue = 0;
  const paidRevenue = 0;
  
  // Müşteri istatistikleri
  const totalCustomers = 0;
  const activeCustomers = 0;
  const bannedCustomers = 0;
  const thisMonthReservations = 0;

  // Geçen aya göre artış hesaplama (basit hesaplama)

  const StatCard = ({ title, value, icon: Icon, subtitle }) => (
    <div className="bg-white text-gray-900 flex flex-col gap-2 rounded-xl border border-gray-200 py-6 shadow-sm">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
        <div className="text-sm font-medium text-gray-600">{title}</div>
        <Icon className="h-4 w-4 text-gray-400" aria-hidden="true" />
      </div>
      <div className="px-6">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );

  const QuickActionCard = ({ title, subtitle, buttonText, icon: Icon, buttonColor = "bg-gray-900 text-white hover:bg-gray-800", onClick }) => (
    <div className="bg-white text-gray-900 flex flex-col gap-2 rounded-xl border border-gray-200 py-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6">
        <div className="leading-none font-semibold flex items-center gap-2">
          <Icon className="h-5 w-5" aria-hidden="true" />
          {title}
        </div>
        <div className="text-gray-500 text-sm">
          {subtitle}
        </div>
      </div>
      <div className="px-6">
        <button 
          onClick={onClick}
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 h-9 px-4 py-2 w-full ${buttonColor}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );

  const ReservationCard = ({ reservation, showDate = true }) => {
    const bungalow = getBungalowById(reservation.bungalowId);
    const customer = getCustomerById(reservation.customerId);
    const navigate = useNavigate();

    const formatShortDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    };

    const handleReservationClick = () => {
      navigate(`/reservations/${reservation.id}`);
    };

    return (
      <div className="block">
        <div 
          onClick={handleReservationClick}
          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div className="flex-1">
            {/* Ad Soyad, Durum, Ödeme Durumu */}
            <div className="flex items-center gap-2 mb-2">
              <p className="font-medium text-sm text-gray-900">
                {customer ? `${customer.firstName} ${customer.lastName}` : 'Bilinmiyor'}
              </p>
              {getReservationStatusBadge(reservation.status)}
              {getPaymentStatusBadge(reservation.paymentStatus)}
            </div>
            
            {/* Bungalov Adı - Giriş/Çıkış Tarihi */}
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600 font-medium">
                {bungalow?.name || 'Bilinmiyor'}
              </p>
              {showDate && (
                <p className="text-sm text-gray-600">
                  {formatShortDate(reservation.checkInDate)} / {formatShortDate(reservation.checkOutDate)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center rounded-md border border-gray-200 px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer">
              Detay
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Rezervasyon yönetim sisteminize hoş geldiniz</p>
        </div>

        {/* Hızlı Bakış Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Toplam Rezervasyon"
            value={totalReservations.toString()}
            icon={CalendarIcon}
            subtitle={`Bu ay: +${thisMonthReservations}`}
          />
          <StatCard
            title="Aktif Rezervasyonlar"
            value={activeReservations.toString()}
            icon={UsersIcon}
            subtitle="Şu anda konaklayan misafirler"
          />
          <StatCard
            title="Toplam Gelir"
            value={formatPrice(totalRevenue)}
            icon={BadgeTurkishLiraIcon}
            subtitle={`Ödenen: ${formatPrice(paidRevenue)}`}
          />
          <StatCard
            title="Toplam Müşteri"
            value={totalCustomers.toString()}
            icon={UserIcon}
            subtitle={`Aktif: ${activeCustomers}, Yasaklı: ${bannedCustomers}`}
          />
        </div>

        {/* Hızlı İşlem Alanları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <QuickActionCard
            title="Yeni Rezervasyon"
            subtitle="Yeni bir rezervasyon oluşturun"
            buttonText="Rezervasyon Oluştur"
            icon={PlusIcon}
            buttonColor="bg-gray-900 text-white hover:bg-gray-800"
            onClick={() => navigate('/create-reservation')}
          />
          <QuickActionCard
            title="Tüm Rezervasyonlar"
            subtitle="Mevcut rezervasyonları görüntüleyin"
            buttonText="Rezervasyonları Görüntüle"
            icon={EyeIcon}
            buttonColor="bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={() => navigate('/reservations')}
          />
          <QuickActionCard
            title="Raporlar"
            subtitle="Detaylı raporları inceleyin"
            buttonText="Raporları Görüntüle"
            icon={ChartBarIcon}
            buttonColor="bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={() => navigate('/reports')}
          />
        </div>

        {/* Günün Rezervasyonları ve Yaklaşan Rezervasyonlar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Günün Rezervasyonları */}
          <div className="bg-white border border-gray-200 rounded-lg flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Bugünün Rezervasyonları</h3>
                      <p className="text-sm text-gray-600 mt-1">Bugün giriş yapacak misafirler ({todaysReservations.length})</p>
                    </div>
                    <button
                      onClick={() => setIsTodaysExpanded(!isTodaysExpanded)}
                      className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <span>{isTodaysExpanded ? 'Daha Az Göster' : 'Tamamını Gör'}</span>
                      {isTodaysExpanded ? (
                        <ChevronUpIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-3 flex-1">
                  {todaysReservations.length > 0 ? (
                    <>
                      {/* İlk 5 rezervasyonu her zaman göster */}
                      {todaysReservations.slice(0, 5).map((reservation) => (
                        <ReservationCard key={reservation.id} reservation={reservation} />
                      ))}
                      
                      {/* Accordion ile kalan rezervasyonları göster/gizle */}
                      {isTodaysExpanded && todaysReservations.length > 5 && (
                        <div className="space-y-3">
                          {todaysReservations.slice(5).map((reservation) => (
                            <ReservationCard key={reservation.id} reservation={reservation} />
                          ))}
                        </div>
                      )}
                      
                      {/* Daha fazla rezervasyon varsa göster/gizle butonu */}
                      {todaysReservations.length > 5 && (
                        <div className="pt-2 border-t border-gray-100 mt-auto">
                          <button
                            onClick={() => setIsTodaysExpanded(!isTodaysExpanded)}
                            className="w-full text-center text-sm text-gray-600 hover:text-gray-800 py-2 transition-colors"
                          >
                            {isTodaysExpanded 
                              ? `Daha az göster (${todaysReservations.length - 5} rezervasyon gizlendi)` 
                              : `+${todaysReservations.length - 5} rezervasyon daha göster`
                            }
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 flex-1 flex items-center justify-center">
                      <div>
                        <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Bugün için rezervasyon bulunmuyor</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

          {/* Yaklaşan Rezervasyonlar */}
          <div className="bg-white border border-gray-200 rounded-lg flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Yaklaşan Rezervasyonlar</h3>
                      <p className="text-sm text-gray-600 mt-1">Önümüzdeki 7 gün içindeki girişler ({upcomingReservations.length})</p>
                    </div>
                    <button
                      onClick={() => setIsUpcomingExpanded(!isUpcomingExpanded)}
                      className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <span>{isUpcomingExpanded ? 'Daha Az Göster' : 'Tamamını Gör'}</span>
                      {isUpcomingExpanded ? (
                        <ChevronUpIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-3 flex-1">
                  {upcomingReservations.length > 0 ? (
                    <>
                      {/* İlk 5 rezervasyonu her zaman göster */}
                      {upcomingReservations.slice(0, 5).map((reservation) => (
                        <ReservationCard key={reservation.id} reservation={reservation} />
                      ))}
                      
                      {/* Accordion ile kalan rezervasyonları göster/gizle */}
                      {isUpcomingExpanded && upcomingReservations.length > 5 && (
                        <div className="space-y-3">
                          {upcomingReservations.slice(5).map((reservation) => (
                            <ReservationCard key={reservation.id} reservation={reservation} />
                          ))}
                        </div>
                      )}
                      
                      {/* Daha fazla rezervasyon varsa göster/gizle butonu */}
                      {upcomingReservations.length > 5 && (
                        <div className="pt-2 border-t border-gray-100 mt-auto">
                          <button
                            onClick={() => setIsUpcomingExpanded(!isUpcomingExpanded)}
                            className="w-full text-center text-sm text-gray-600 hover:text-gray-800 py-2 transition-colors"
                          >
                            {isUpcomingExpanded 
                              ? `Daha az göster (${upcomingReservations.length - 5} rezervasyon gizlendi)` 
                              : `+${upcomingReservations.length - 5} rezervasyon daha göster`
                            }
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 flex-1 flex items-center justify-center">
                      <div>
                        <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Yaklaşan rezervasyon bulunmuyor</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
