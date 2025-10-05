import React, { useState, useRef, useEffect } from 'react';
import { 
  reservations, 
  formatPrice, 
  getBungalowById,
  getCustomerById
} from '../data/data';
import { 
  ChartBarIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserIcon,
  ChevronDownIcon,
  CheckIcon,
  DocumentChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { BadgeTurkishLiraIcon as BadgeTurkishLira } from '../components/ui/icons/lucide-badge-turkish-lira';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// CustomDropdown Component
const CustomDropdown = ({ options, value, onChange, placeholder }) => {
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

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm transition-colors flex items-center justify-between"
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 flex items-center justify-between"
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

const Reports = () => {
  const [timeFilter, setTimeFilter] = useState('Tüm Zamanlar');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Filtreleme seçenekleri

  const timeFilterOptions = [
    { value: 'Tüm Zamanlar', label: 'Tüm Zamanlar' },
    { value: 'Bu Ay', label: 'Bu Ay' },
    { value: 'Geçen Ay', label: 'Geçen Ay' },
    { value: 'Bu Yıl', label: 'Bu Yıl' },
    { value: 'Geçen Yıl', label: 'Geçen Yıl' },
    { value: 'Özel Tarih', label: 'Özel Tarih' }
  ];

  const monthOptions = [
    { value: '1', label: 'Ocak' },
    { value: '2', label: 'Şubat' },
    { value: '3', label: 'Mart' },
    { value: '4', label: 'Nisan' },
    { value: '5', label: 'Mayıs' },
    { value: '6', label: 'Haziran' },
    { value: '7', label: 'Temmuz' },
    { value: '8', label: 'Ağustos' },
    { value: '9', label: 'Eylül' },
    { value: '10', label: 'Ekim' },
    { value: '11', label: 'Kasım' },
    { value: '12', label: 'Aralık' }
  ];

  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  // Veri filtreleme fonksiyonu
  const getFilteredReservations = () => {
    let filtered = [...reservations];
    
    if (timeFilter === 'Bu Ay') {
      const currentDate = new Date();
      filtered = filtered.filter(res => {
        const resDate = new Date(res.createdAt);
        return resDate.getMonth() === currentDate.getMonth() && 
               resDate.getFullYear() === currentDate.getFullYear();
      });
    } else if (timeFilter === 'Geçen Ay') {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      filtered = filtered.filter(res => {
        const resDate = new Date(res.createdAt);
        return resDate.getMonth() === lastMonth.getMonth() && 
               resDate.getFullYear() === lastMonth.getFullYear();
      });
    } else if (timeFilter === 'Bu Yıl') {
      const currentYear = new Date().getFullYear();
      filtered = filtered.filter(res => {
        const resDate = new Date(res.createdAt);
        return resDate.getFullYear() === currentYear;
      });
    } else if (timeFilter === 'Geçen Yıl') {
      const lastYear = new Date().getFullYear() - 1;
      filtered = filtered.filter(res => {
        const resDate = new Date(res.createdAt);
        return resDate.getFullYear() === lastYear;
      });
    } else if (timeFilter === 'Özel Tarih' && selectedMonth && selectedYear) {
      filtered = filtered.filter(res => {
        const resDate = new Date(res.createdAt);
        return resDate.getMonth() === parseInt(selectedMonth) - 1 && 
               resDate.getFullYear() === parseInt(selectedYear);
      });
    }
    
    return filtered;
  };

  const filteredReservations = getFilteredReservations();

  // Genel istatistikler
  const getGeneralStats = () => {
    const totalReservations = filteredReservations.length;
    const totalRevenue = filteredReservations.reduce((sum, res) => sum + res.totalPrice, 0);
    const paidRevenue = filteredReservations.reduce((sum, res) => sum + res.paidAmount, 0);
    const pendingRevenue = totalRevenue - paidRevenue;
    const averageReservationValue = totalReservations > 0 ? totalRevenue / totalReservations : 0;
    
    return {
      totalReservations,
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      averageReservationValue
    };
  };

  // Bungalov bazlı istatistikler
  const getBungalowStats = () => {
    const bungalowStats = {};
    
    filteredReservations.forEach(res => {
      const bungalow = getBungalowById(res.bungalowId);
      if (bungalow) {
        if (!bungalowStats[bungalow.id]) {
          bungalowStats[bungalow.id] = {
            name: bungalow.name,
            reservations: 0,
            revenue: 0,
            occupancy: 0
          };
        }
        bungalowStats[bungalow.id].reservations++;
        bungalowStats[bungalow.id].revenue += res.totalPrice;
      }
    });
    
    return Object.values(bungalowStats).sort((a, b) => b.revenue - a.revenue);
  };

  // Müşteri bazlı istatistikler
  const getCustomerStats = () => {
    const customerStats = {};
    
    filteredReservations.forEach(res => {
      const customer = getCustomerById(res.customerId);
      if (customer) {
        if (!customerStats[customer.id]) {
          customerStats[customer.id] = {
            name: `${customer.firstName} ${customer.lastName}`,
            email: customer.email,
            status: customer.status,
            reservations: 0,
            revenue: 0
          };
        }
        customerStats[customer.id].reservations++;
        customerStats[customer.id].revenue += res.totalPrice;
      }
    });
    
    return Object.values(customerStats).sort((a, b) => b.revenue - a.revenue);
  };

  // Rezervasyon bazlı istatistikler
  const getReservationStats = () => {
    const statusStats = {};
    const paymentStats = {};
    const monthlyStats = {};
    
    filteredReservations.forEach(res => {
      // Durum istatistikleri
      statusStats[res.status] = (statusStats[res.status] || 0) + 1;
      
      // Ödeme istatistikleri
      paymentStats[res.paymentStatus] = (paymentStats[res.paymentStatus] || 0) + 1;
      
      // Aylık istatistikler
      const month = new Date(res.createdAt).getMonth();
      if (!monthlyStats[month]) {
        monthlyStats[month] = { count: 0, revenue: 0 };
      }
      monthlyStats[month].count++;
      monthlyStats[month].revenue += res.totalPrice;
    });
    
    return { statusStats, paymentStats, monthlyStats };
  };

  const generalStats = getGeneralStats();
  const bungalowStats = getBungalowStats();
  const customerStats = getCustomerStats();
  const reservationStats = getReservationStats();

  // Grafik verilerini hazırlama fonksiyonları
  const getMonthlyChartData = () => {
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                   'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    
    const monthlyData = Array(12).fill(0);
    const monthlyRevenue = Array(12).fill(0);
    
    filteredReservations.forEach(res => {
      const month = new Date(res.createdAt).getMonth();
      monthlyData[month]++;
      monthlyRevenue[month] += res.totalPrice;
    });

    return {
      labels: months,
      datasets: [
        {
          label: 'Rezervasyon Sayısı',
          data: monthlyData,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          yAxisID: 'y',
        },
        {
          label: 'Gelir (₺)',
          data: monthlyRevenue,
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
          yAxisID: 'y1',
        }
      ]
    };
  };


  // Grafik seçenekleri
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };


  const StatCard = ({ title, value, icon: Icon, subtitle, trend }) => (
    <div className="bg-white text-gray-900 flex flex-col gap-2 rounded-xl border border-gray-200 py-6 shadow-sm">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
        <div className="text-sm font-medium text-gray-600">{title}</div>
        <Icon className="h-4 w-4 text-gray-400" aria-hidden="true" />
      </div>
      <div className="px-6">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center text-xs mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <ArrowTrendingUpIcon className="w-3 h-3 mr-1" /> : <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Raporlar</h1>
          <p className="text-gray-600 mt-1">Detaylı analiz ve raporlar</p>
        </div>

        {/* Filtreleme Alanı */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-6">
            <DocumentChartBarIcon className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Zaman Filtresi</h3>
          </div>
          
          {/* Zaman Filtresi - Tab Tasarımı */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {timeFilterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTimeFilter(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    timeFilter === option.value
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Özel Tarih Seçimi */}
          {timeFilter === 'Özel Tarih' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ay Seçin</label>
                <CustomDropdown
                  options={monthOptions}
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  placeholder="Ay Seçin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yıl Seçin</label>
                <CustomDropdown
                  options={yearOptions}
                  value={selectedYear.toString()}
                  onChange={setSelectedYear}
                  placeholder="Yıl Seçin"
                />
              </div>
            </div>
          )}

        </div>

        {/* Genel Rapor */}
        <div className="space-y-8">
            {/* 1. Satır: Temel İstatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Toplam Rezervasyon"
                value={generalStats.totalReservations.toString()}
                icon={CalendarIcon}
                subtitle={`${timeFilter} dönemi`}
              />
              <StatCard
                title="Toplam Gelir"
                value={formatPrice(generalStats.totalRevenue)}
                icon={BadgeTurkishLira}
                subtitle={`Ödenen: ${formatPrice(generalStats.paidRevenue)}`}
              />
              <StatCard
                title="Bekleyen Gelir"
                value={formatPrice(generalStats.pendingRevenue)}
                icon={ChartBarIcon}
                subtitle="Henüz ödenmemiş"
              />
              <StatCard
                title="Ortalama Rezervasyon"
                value={formatPrice(generalStats.averageReservationValue)}
                icon={ArrowTrendingUpIcon}
                subtitle="Rezervasyon başına"
              />
            </div>

            {/* 2. Satır: Aylık Rezervasyon ve Gelir Grafiği */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aylık Rezervasyon ve Gelir</h3>
              <div className="h-80">
                <Bar 
                  data={getMonthlyChartData()} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: 'Aylık Performans'
                      }
                    }
                  }} 
                />
              </div>
            </div>

            {/* 3. Satır: Ödeme Durum Detayları */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ödeme Durum Detayları</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(reservationStats.paymentStats).map(([status, count]) => (
                  <div key={status} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">{status}</h4>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{count}</p>
                    <p className="text-sm text-gray-600">Rezervasyon</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Satır: Bungalov Bazlı Gelir Performansı */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bungalov Bazlı Gelir Performansı</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bungalowStats.slice(0, 6).map((stat, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="w-5 h-5 text-gray-600 mr-2" />
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {stat.name.length > 20 ? stat.name.substring(0, 20) + '...' : stat.name}
                        </h4>
                      </div>
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Rezervasyon:</span>
                        <span className="font-semibold text-gray-900">{stat.reservations}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Toplam Gelir:</span>
                        <span className="font-bold text-green-600">{formatPrice(stat.revenue)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Ortalama:</span>
                        <span className="font-medium text-gray-900">{formatPrice(stat.revenue / stat.reservations)}</span>
                      </div>
                    </div>
                    <div className="mt-3 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(stat.revenue / Math.max(...bungalowStats.map(s => s.revenue))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Satır: Müşteri Bazlı Performans */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* En Çok Rezervasyon Yapan 5 Müşteri */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserIcon className="w-5 h-5 text-gray-600 mr-2" />
                  En Çok Rezervasyon Yapan 5 Müşteri
                </h3>
                <div className="space-y-3">
                  {customerStats
                    .sort((a, b) => b.reservations - a.reservations)
                    .slice(0, 5)
                    .map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 text-gray-800 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{stat.name}</div>
                          <div className="text-xs text-gray-500">{stat.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{stat.reservations}</div>
                        <div className="text-xs text-gray-500">rezervasyon</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* En Çok Harcama Yapan 5 Müşteri */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BadgeTurkishLira className="w-5 h-5 text-gray-600 mr-2" />
                  En Çok Harcama Yapan 5 Müşteri
                </h3>
                <div className="space-y-3">
                  {customerStats
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 5)
                    .map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 text-gray-800 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{stat.name}</div>
                          <div className="text-xs text-gray-500">{stat.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{formatPrice(stat.revenue)}</div>
                        <div className="text-xs text-gray-500">{stat.reservations} rezervasyon</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
