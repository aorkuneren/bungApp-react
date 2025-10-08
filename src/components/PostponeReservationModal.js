import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  XMarkIcon,
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { reservations, getBungalowById } from '../data/data';

const PostponeReservationModal = ({ isOpen, onClose, reservation, onPostpone }) => {
  const [selectedDates, setSelectedDates] = useState({
    checkIn: '',
    checkOut: ''
  });
  const [displayMonth, setDisplayMonth] = useState(new Date().getMonth());
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [useCustomPrice, setUseCustomPrice] = useState(false);
  const [customPrice, setCustomPrice] = useState(0);

  if (!isOpen || !reservation) return null;

  // Güvenli değerler
  const totalPrice = reservation.totalPrice || 0;
  const paidAmount = reservation.paidAmount || 0;
  const remainingAmount = reservation.remainingAmount || 0;

  // Mevcut tarihleri hesapla
  const currentCheckIn = new Date(reservation.checkInDate);
  const currentCheckOut = new Date(reservation.checkOutDate);
  const currentNights = Math.ceil((currentCheckOut - currentCheckIn) / (1000 * 60 * 60 * 24));

  // Takvim yardımcı fonksiyonları
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Gerçek müsaitlik kontrolü
  const isDateAvailable = (date) => {
    // Bu tarihte rezervasyon var mı kontrol et (mevcut rezervasyon hariç)
    return !reservations.some(res => {
      if (res.id === reservation.id) return false; // Mevcut rezervasyonu hariç tut
      const checkIn = new Date(res.checkInDate);
      const checkOut = new Date(res.checkOutDate);
      
      // Çıkış günü aynı gün giriş yapılabilir
      // Sadece giriş gününden çıkış gününe kadar (çıkış günü hariç) dolu
      return date >= checkIn && date < checkOut && res.bungalowId === reservation.bungalowId;
    });
  };


  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (displayMonth === 0) {
        setDisplayMonth(11);
        setDisplayYear(displayYear - 1);
      } else {
        setDisplayMonth(displayMonth - 1);
      }
    } else {
      if (displayMonth === 11) {
        setDisplayMonth(0);
        setDisplayYear(displayYear + 1);
      } else {
        setDisplayMonth(displayMonth + 1);
      }
    }
  };

  const handleDateClick = (date) => {
    const dateStr = formatDate(date);
    
    if (!isDateAvailable(date)) {
      return; // Müsait olmayan tarihleri seçme
    }

    if (!selectedDates.checkIn) {
      // İlk tarih seçimi - check-in
      setSelectedDates({
        checkIn: dateStr,
        checkOut: ''
      });
    } else if (!selectedDates.checkOut) {
      // İkinci tarih seçimi - check-out
      if (new Date(dateStr) > new Date(selectedDates.checkIn)) {
        setSelectedDates(prev => ({
          ...prev,
          checkOut: dateStr
        }));
      } else {
        // Eğer seçilen tarih check-in'den önceyse, yeni check-in yap
        setSelectedDates({
          checkIn: dateStr,
          checkOut: ''
        });
      }
    } else {
      // Yeni tarih seçimi - mevcut seçimi temizle
      setSelectedDates({
        checkIn: dateStr,
        checkOut: ''
      });
    }
  };

  const handlePostpone = async () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      toast.error('Lütfen giriş ve çıkış tarihlerini seçin!');
      return;
    }

    const newCheckIn = selectedDates.checkIn;
    const newCheckOut = selectedDates.checkOut;

    setIsLoading(true);
    const postponeToast = toast.loading('Rezervasyon güncelleniyor...');
    
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onPostpone({
        reservationId: reservation.id,
        newCheckInDate: newCheckIn,
        newCheckOutDate: newCheckOut,
        newTotalPrice: newTotalPrice,
        priceDifference: priceDifference,
        useCustomPrice: useCustomPrice
      });
      
      toast.success('Rezervasyon başarıyla güncellendi!', { id: postponeToast });
      onClose();
    } catch (error) {
      console.error('Erteleme hatası:', error);
      toast.error('Erteleme sırasında bir hata oluştu!', { id: postponeToast });
    } finally {
      setIsLoading(false);
    }
  };

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  
  const daysInMonth = getDaysInMonth(displayYear, displayMonth);
  const firstDay = getFirstDayOfMonth(displayYear, displayMonth);
  const today = new Date();

  const newNights = selectedDates.checkIn && selectedDates.checkOut ? 
    Math.ceil((new Date(selectedDates.checkOut) - new Date(selectedDates.checkIn)) / (1000 * 60 * 60 * 24)) : 
    currentNights;

  // Fiyat hesaplama
  const calculateNewPrice = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return totalPrice;
    
    const bungalow = getBungalowById(reservation.bungalowId);
    if (!bungalow) return totalPrice;
    
    // Günlük fiyat * gece sayısı
    const basePrice = (bungalow.dailyPrice || 0) * newNights;
    
    // KDV hesaplama (%18)
    const vatRate = 0.18;
    const vatAmount = basePrice * vatRate;
    const newTotalPrice = basePrice + vatAmount;
    
    return Math.round(newTotalPrice);
  };

  const newTotalPrice = useCustomPrice ? customPrice : calculateNewPrice();
  const priceDifference = newTotalPrice - totalPrice;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Rezervasyonu Ertele</h3>
              <p className="text-sm text-gray-600 mt-1">
                Müsait günleri seçerek rezervasyon tarihlerini güncelleyin. Kırmızı günler müsait değildir.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sol Kolon - Seçilen Tarihler */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Seçilen Tarihler</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Seçilen Gece Sayısı</label>
                    <div className="text-sm text-gray-900 font-medium">
                      {newNights} gece
                    </div>
                  </div>
                  {selectedDates.checkIn && selectedDates.checkOut && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Giriş Tarihi</label>
                        <div className="text-sm text-gray-900 font-medium">
                          {new Date(selectedDates.checkIn).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Çıkış Tarihi</label>
                        <div className="text-sm text-gray-900 font-medium">
                          {new Date(selectedDates.checkOut).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Yeni süre</label>
                    <div className="text-sm text-gray-900 font-medium">{newNights} gece</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Mevcut Rezervasyon Bilgileri</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mevcut Süre:</span>
                    <span className="text-gray-900">{currentNights} gece</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mevcut Tutar:</span>
                    <span className="text-gray-900">₺{totalPrice.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Önceden Alınan:</span>
                    <span className="text-gray-900">₺{paidAmount.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kalan Ödeme:</span>
                    <span className="text-gray-900">₺{remainingAmount.toLocaleString('tr-TR')}</span>
                  </div>
                </div>
              </div>

              {/* Yeni Fiyat Bilgileri */}
              {selectedDates.checkIn && selectedDates.checkOut && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-900 mb-3">Yeni Fiyat Bilgileri</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Yeni Süre:</span>
                      <span className="text-blue-900 font-medium">{newNights} gece</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Yeni Tutar:</span>
                      <span className="text-blue-900 font-medium">₺{newTotalPrice.toLocaleString('tr-TR')}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-2">
                      <span className="text-blue-700">Fiyat Farkı:</span>
                      <span className={`font-medium ${priceDifference > 0 ? 'text-red-600' : priceDifference < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                        {priceDifference > 0 ? '+' : ''}₺{priceDifference.toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Yeni Kalan Ödeme:</span>
                      <span className={`font-medium ${(newTotalPrice - paidAmount) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₺{(newTotalPrice - paidAmount).toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Orta Kolon - Takvim */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {/* Calendar Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="w-6 h-6 text-gray-600" />
                      <h4 className="text-xl font-semibold text-gray-900">
                        {monthNames[displayMonth]} {displayYear}
                      </h4>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => navigateMonth('prev')}
                        className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
                      >
                        <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => navigateMonth('next')}
                        className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
                      >
                        <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Calendar Body */}
                <div className="p-6">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                      <div key={day} className="text-center text-sm font-semibold text-gray-600 py-3 bg-gray-50 rounded-lg">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: firstDay }, (_, i) => (
                      <div key={`empty-${i}`} className="h-12" />
                    ))}
                    
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1;
                      const date = new Date(displayYear, displayMonth, day);
                      const isAvailable = isDateAvailable(date);
                      const isToday = date.toDateString() === today.toDateString();
                      const isPast = date < today;
                      
                      // Tarih aralığındaki günleri kontrol et
                      const isInRange = selectedDates.checkIn && selectedDates.checkOut && 
                        date > new Date(selectedDates.checkIn) && date < new Date(selectedDates.checkOut);
                      const isCheckIn = selectedDates.checkIn === formatDate(date);
                      const isCheckOut = selectedDates.checkOut === formatDate(date);

                      return (
                        <button
                          key={day}
                          onClick={() => !isPast && isAvailable && handleDateClick(date)}
                          disabled={isPast || !isAvailable}
                          className={`h-12 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isPast
                              ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                              : !isAvailable
                              ? 'bg-red-50 text-red-500 cursor-not-allowed border border-red-200'
                              : isCheckIn || isCheckOut
                              ? 'bg-gray-900 text-white shadow-lg transform scale-105 border-2 border-gray-700'
                              : isInRange
                              ? 'bg-blue-200 text-blue-800 border border-blue-300 shadow-md'
                              : isToday
                              ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 hover:bg-blue-200 hover:scale-105'
                              : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:scale-105 hover:shadow-md'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-8 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-full mr-2"></div>
                      <span className="text-gray-700 font-medium">Müsait</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-50 border border-red-200 rounded-full mr-2"></div>
                      <span className="text-gray-700 font-medium">Dolu</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-900 rounded-full mr-2"></div>
                      <span className="text-gray-700 font-medium">Seçili</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-100 border-2 border-blue-300 rounded-full mr-2"></div>
                      <span className="text-gray-700 font-medium">Bugün</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manuel Fiyat Seçeneği */}
              {selectedDates.checkIn && selectedDates.checkOut && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-sm p-6 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Fiyat Ayarları</h4>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">Manuel Fiyat</span>
                      <button
                        onClick={() => {
                          setUseCustomPrice(!useCustomPrice);
                          if (!useCustomPrice) {
                            setCustomPrice(calculateNewPrice());
                          }
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          useCustomPrice ? 'bg-gray-900' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            useCustomPrice ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {useCustomPrice && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Özel Toplam Fiyat (₺)
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="number"
                          value={customPrice}
                          onChange={(e) => setCustomPrice(parseInt(e.target.value) || 0)}
                          className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          placeholder="Toplam fiyatı girin"
                          min="0"
                        />
                        <button
                          onClick={() => {
                            setUseCustomPrice(false);
                            setCustomPrice(0);
                          }}
                          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          İptal
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Otomatik hesaplanan fiyat: ₺{calculateNewPrice().toLocaleString('tr-TR')}
                      </p>
                    </div>
                  )}

                  {!useCustomPrice && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Otomatik Hesaplanan Fiyat</p>
                          <p className="text-lg font-bold text-gray-900">₺{calculateNewPrice().toLocaleString('tr-TR')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Günlük fiyat × {newNights} gece</p>
                          <p className="text-xs text-gray-500">+ KDV (%18)</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              İptal
            </button>
            <button
              onClick={handlePostpone}
              disabled={isLoading || !selectedDates.checkIn || !selectedDates.checkOut}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Güncelleniyor...</span>
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  <span>Rezervasyonu Güncelle</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostponeReservationModal;
