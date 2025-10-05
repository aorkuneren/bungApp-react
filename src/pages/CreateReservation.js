import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  DocumentCheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { bungalows } from '../data/dataBungalows';
import { reservations } from '../data/dataReservations';
import { customers } from '../data/dataCustomers';

const CreateReservation = () => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBungalow, setSelectedBungalow] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    tcNumber: '',
    passportNumber: '',
    isTurkishCitizen: true
  });
  const [reservationDetails, setReservationDetails] = useState({
    totalNights: 0,
    totalPrice: 0,
    depositAmount: 0,
    remainingAmount: 0
  });
  const [displayMonth, setDisplayMonth] = useState(new Date().getMonth());
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [useCustomPrice, setUseCustomPrice] = useState(false);
  const [customPrice, setCustomPrice] = useState(0);
  const [depositReceived, setDepositReceived] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [guestCount, setGuestCount] = useState(1);
  const [reservationNotes, setReservationNotes] = useState('');

  // URL parametresinden bungalowId'yi al ve otomatik seç
  useEffect(() => {
    const bungalowId = searchParams.get('bungalowId');
    if (bungalowId) {
      const bungalow = bungalows.find(b => b.id === parseInt(bungalowId));
      if (bungalow) {
        setSelectedBungalow(bungalow);
        setCurrentStep(2); // Bungalov seçildiğinde tarih seçimine geç
      }
    }
  }, [searchParams]);

  const steps = [
    { id: 1, name: 'Bungalov Seç', icon: BuildingOfficeIcon },
    { id: 2, name: 'Tarih Seçimi', icon: CalendarIcon },
    { id: 3, name: 'Müşteri Bilgileri', icon: UserIcon },
    { id: 4, name: 'Rezervasyon Onayı', icon: DocumentCheckIcon }
  ];

  // Tarih hesaplama fonksiyonları
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateAvailable = (date) => {
    // Bu tarihte rezervasyon var mı kontrol et
    return !reservations.some(reservation => {
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);
      return date >= checkIn && date < checkOut && reservation.bungalowId === selectedBungalow?.id;
    });
  };

  const isDateSelected = (date) => {
    const dateStr = formatDate(date);
    return selectedDates.includes(dateStr);
  };

  const handleDateClick = (date) => {
    const dateStr = formatDate(date);
    
    if (selectedDates.includes(dateStr)) {
      // Tarihi kaldır
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
    } else {
      // Tarihi ekle - sadece müsait tarihleri ekle
      if (isDateAvailable(date)) {
        setSelectedDates([...selectedDates, dateStr]);
      }
    }
  };

  // Rezervasyon hesaplama
  const calculateReservation = () => {
    if (selectedBungalow && selectedDates.length > 0) {
      const nights = selectedDates.length;
      const basePrice = useCustomPrice ? customPrice : (selectedBungalow.dailyPrice * nights);
      
      // Kapora hesaplama - sadece alındıysa kullanıcının girdiği miktar, değilse %20
      const calculatedDepositAmount = Math.round(basePrice * 0.2); // %20 kapora
      const finalDepositAmount = depositReceived ? depositAmount : calculatedDepositAmount;
      
      const paidAmount = depositReceived ? depositAmount : 0;
      const remainingAmount = basePrice - paidAmount;

      setReservationDetails({
        totalNights: nights,
        totalPrice: basePrice,
        depositAmount: finalDepositAmount,
        paidAmount: paidAmount,
        remainingAmount: remainingAmount
      });
    }
  };

  // Tarih değiştiğinde hesaplama yap
  React.useEffect(() => {
    calculateReservation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBungalow, selectedDates, useCustomPrice, customPrice, depositReceived, depositAmount]);

  // Dropdown dışına tıklama ile kapanma
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCustomerDropdown && !event.target.closest('.customer-dropdown')) {
        setShowCustomerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCustomerDropdown]);

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Müşteri arama ve filtreleme
  const filteredCustomers = customers.filter(customer => {
    const searchTerm = customerSearch.toLowerCase();
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const email = customer.email.toLowerCase();
    const phone = customer.phone.toLowerCase();
    const tcNumber = customer.tcNumber.toLowerCase();
    
    return fullName.includes(searchTerm) || 
           email.includes(searchTerm) || 
           phone.includes(searchTerm) ||
           tcNumber.includes(searchTerm);
  });

  // Müşteri seçimi
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setCustomerInfo({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      tcNumber: customer.tcNumber,
      passportNumber: '',
      isTurkishCitizen: true
    });
    setCustomerSearch(`${customer.firstName} ${customer.lastName}`);
    setShowCustomerDropdown(false);
  };

  // Müşteri arama temizleme
  const clearCustomerSelection = () => {
    setSelectedCustomer(null);
    setCustomerSearch('');
    setCustomerInfo({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      tcNumber: '',
      passportNumber: '',
      isTurkishCitizen: true
    });
  };

  // Konuk sayısı değiştirme
  const handleGuestCountChange = (count) => {
    const newCount = Math.max(1, count); // Sadece minimum 1 kişi sınırı
    setGuestCount(newCount);
  };

  const handleSubmitReservation = () => {
    // Rezervasyon oluşturma işlemi
    console.log('Rezervasyon oluşturuluyor:', {
      bungalow: selectedBungalow,
      dates: selectedDates,
      customer: customerInfo,
      guestCount: guestCount,
      notes: reservationNotes,
      details: reservationDetails,
      depositReceived: depositReceived,
      depositAmount: depositAmount,
      customPriceUsed: useCustomPrice,
      customPriceValue: useCustomPrice ? customPrice : null
    });
    
    // Başarı mesajı ve yönlendirme
    alert('Rezervasyon başarıyla oluşturuldu!');
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isCompleted 
                  ? 'bg-green-500 border-green-500 text-white'
                  : isActive 
                    ? 'bg-gray-900 border-gray-900 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
              }`}>
                {isCompleted ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  isActive ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.name}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Bungalov Seçimi</h3>
        <p className="text-sm text-gray-600 mb-6">Rezervasyon yapmak istediğiniz bungalovu seçin</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bungalows.map((bungalow) => (
          <div
            key={bungalow.id}
            onClick={() => setSelectedBungalow(bungalow)}
            className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
              selectedBungalow?.id === bungalow.id
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{bungalow.name}</h4>
              {selectedBungalow?.id === bungalow.id && (
                <CheckIcon className="w-5 h-5 text-gray-900" />
              )}
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Kapasite: {bungalow.capacity} kişi</p>
              <p>Fiyat: ₺{bungalow.dailyPrice.toLocaleString()}/gece</p>
              <p>Durum: <span className={`px-2 py-1 rounded-full text-xs ${
                bungalow.status === 'Aktif' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {bungalow.status === 'Aktif' ? 'Müsait' : 'Dolu'}
              </span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => {
    const today = new Date();

    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    const daysInMonth = getDaysInMonth(displayYear, displayMonth);
    const firstDay = getFirstDayOfMonth(displayYear, displayMonth);

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

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tarih Seçimi</h3>
          <p className="text-sm text-gray-600 mb-6">
            {selectedBungalow ? `${selectedBungalow.name} için` : 'Bungalov seçin'} müsait tarihleri seçin
          </p>
        </div>

        {selectedBungalow && (
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
                  const isSelected = isDateSelected(date);
                  const isToday = date.toDateString() === today.toDateString();
                  const isPast = date < today;

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
                          : isSelected
                          ? 'bg-gray-900 text-white shadow-lg transform scale-105'
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
        )}

        {selectedDates.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-sm p-6">
            {/* Manuel Fiyat Seçeneği */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Fiyat Ayarları</h4>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Manuel Fiyat</span>
                  <button
                    onClick={() => {
                      setUseCustomPrice(!useCustomPrice);
                      if (!useCustomPrice) {
                        setCustomPrice(selectedBungalow?.dailyPrice * selectedDates.length || 0);
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
                    Varsayılan fiyat: ₺{selectedBungalow?.dailyPrice.toLocaleString()} × {selectedDates.length} gece = ₺{(selectedBungalow?.dailyPrice * selectedDates.length || 0).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Kapora Ayarları */}
            <div className="mb-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-1">Kapora Durumu</h5>
                    <p className="text-xs text-gray-500">Kapora alındı mı?</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      {depositReceived ? 'Alındı' : 'Alınmadı'}
                    </span>
                    <button
                      onClick={() => {
                        setDepositReceived(!depositReceived);
                        if (!depositReceived) {
                          // Kapora alındı olarak işaretlendiğinde varsayılan %20 miktarını set et
                          const defaultDeposit = Math.round((useCustomPrice ? customPrice : (selectedBungalow?.dailyPrice * selectedDates.length || 0)) * 0.2);
                          setDepositAmount(defaultDeposit);
                        } else {
                          // Kapora alınmadı olarak işaretlendiğinde miktarı sıfırla
                          setDepositAmount(0);
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        depositReceived ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          depositReceived ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {depositReceived && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alınan Kapora Miktarı (₺)
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(parseInt(e.target.value) || 0)}
                        className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        placeholder="Alınan kapora miktarını girin"
                        min="0"
                      />
                      <button
                        onClick={() => {
                          const defaultDeposit = Math.round((useCustomPrice ? customPrice : (selectedBungalow?.dailyPrice * selectedDates.length || 0)) * 0.2);
                          setDepositAmount(defaultDeposit);
                        }}
                        className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        %20
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Varsayılan kapora: %20 = ₺{Math.round((useCustomPrice ? customPrice : (selectedBungalow?.dailyPrice * selectedDates.length || 0)) * 0.2).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Fiyat Özeti */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-500 mb-1">Toplam Gece</p>
                  <p className="text-xl font-bold text-gray-900">{selectedDates.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 mb-1">
                    {useCustomPrice ? 'Özel Fiyat' : 'Toplam Fiyat'}
                  </p>
                  <p className="text-xl font-bold text-green-600">₺{reservationDetails.totalPrice.toLocaleString()}</p>
                  {useCustomPrice && (
                    <p className="text-xs text-gray-500 mt-1">
                      (₺{Math.round(reservationDetails.totalPrice / selectedDates.length).toLocaleString()}/gece)
                    </p>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-gray-500 mb-1">Kapora</p>
                  <p className="text-lg font-semibold text-orange-600">₺{reservationDetails.depositAmount.toLocaleString()}</p>
                  <p className={`text-xs mt-1 ${depositReceived ? 'text-green-600' : 'text-red-600'}`}>
                    {depositReceived ? '✓ Alındı' : '✗ Alınmadı'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 mb-1">Kalan Tutar</p>
                  <p className="text-lg font-semibold text-blue-600">₺{reservationDetails.remainingAmount.toLocaleString()}</p>
                </div>
              </div>
              
              {selectedDates.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Giriş:</span> {new Date(selectedDates.sort()[0]).toLocaleDateString('tr-TR')} - 
                    <span className="font-medium ml-2">Çıkış:</span> {new Date(selectedDates.sort()[selectedDates.length - 1]).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Müşteri Bilgileri</h3>
        <p className="text-sm text-gray-600 mb-6">Mevcut müşterilerden seçin veya yeni müşteri bilgilerini girin</p>
      </div>

      {/* Müşteri Arama ve Seçim */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Müşteri Ara ve Seç
          </label>
          <div className="relative customer-dropdown">
            <input
              type="text"
              value={customerSearch}
              onChange={(e) => {
                setCustomerSearch(e.target.value);
                setShowCustomerDropdown(true);
              }}
              onFocus={() => setShowCustomerDropdown(true)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Ad, soyad, e-posta, telefon veya TC ile ara..."
            />
            
            {selectedCustomer && (
              <button
                onClick={clearCustomerSelection}
                className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}

            {/* Müşteri Dropdown */}
            {showCustomerDropdown && customerSearch.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{customer.email}</p>
                          <p className="text-xs text-gray-500">{customer.phone}</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {customer.totalReservations} rezervasyon
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    Müşteri bulunamadı
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Seçilen Müşteri Bilgisi */}
        {selectedCustomer && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Seçilen Müşteri</span>
            </div>
            <p className="text-sm text-green-700">
              {selectedCustomer.firstName} {selectedCustomer.lastName} - {selectedCustomer.email}
            </p>
          </div>
        )}

        {/* Müşteri Bilgi Formu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Müşteri Ad *
            </label>
            <input
              type="text"
              value={customerInfo.firstName}
              onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Müşteri adını girin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Müşteri Soyad *
            </label>
            <input
              type="text"
              value={customerInfo.lastName}
              onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Müşteri soyadını girin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Müşteri Tel *
            </label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="+90 555 123 45 67"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Müşteri Mail *
            </label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="ornek@email.com"
            />
          </div>

          {/* TC/Pasaport Seçimi */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="citizenship"
                    checked={customerInfo.isTurkishCitizen}
                    onChange={() => handleCustomerInfoChange('isTurkishCitizen', true)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">TC Vatandaşı</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="citizenship"
                    checked={!customerInfo.isTurkishCitizen}
                    onChange={() => handleCustomerInfoChange('isTurkishCitizen', false)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">TC vatandaşı değilim</span>
                </label>
              </div>
            </div>

            {customerInfo.isTurkishCitizen ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TC Kimlik No
                </label>
                <input
                  type="text"
                  value={customerInfo.tcNumber}
                  onChange={(e) => handleCustomerInfoChange('tcNumber', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="12345678901"
                  maxLength="11"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pasaport No
                </label>
                <input
                  type="text"
                  value={customerInfo.passportNumber}
                  onChange={(e) => handleCustomerInfoChange('passportNumber', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="A1234567"
                />
              </div>
            )}
          </div>
        </div>

        {/* Misafir Sayısı */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Misafir Sayısı
          </label>
          <input
            type="number"
            value={guestCount}
            onChange={(e) => handleGuestCountChange(parseInt(e.target.value) || 1)}
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            placeholder="Misafir sayısını girin"
            min="1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Bungalow kapasitesi: {selectedBungalow?.capacity || 'Belirtilmemiş'} kişi (önerilen)
          </p>
        </div>

        {/* Referans Notu */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Referans Notu
          </label>
          <textarea
            value={reservationNotes}
            onChange={(e) => setReservationNotes(e.target.value)}
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
            placeholder="Referans notu, özel istekler, notlar..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Referans notu ve özel istekleri buraya yazabilirsiniz
          </p>
        </div>
      </div>

    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Rezervasyon Onayı</h3>
        <p className="text-sm text-gray-600 mb-6">Rezervasyon detaylarını kontrol edin ve onaylayın</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bungalov Bilgileri */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Bungalov Bilgileri</h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Bungalov:</span> {selectedBungalow?.name}</p>
            <p><span className="font-medium">Kapasite:</span> {selectedBungalow?.capacity} kişi</p>
            <p><span className="font-medium">Gece Fiyatı:</span> ₺{selectedBungalow?.dailyPrice.toLocaleString()}</p>
          </div>
        </div>

        {/* Tarih Bilgileri */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Tarih Bilgileri</h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Giriş:</span> {selectedDates[0] && new Date(selectedDates[0]).toLocaleDateString('tr-TR')}</p>
            <p><span className="font-medium">Çıkış:</span> {selectedDates[selectedDates.length - 1] && new Date(selectedDates[selectedDates.length - 1]).toLocaleDateString('tr-TR')}</p>
            <p><span className="font-medium">Gece Sayısı:</span> {selectedDates.length}</p>
          </div>
        </div>

        {/* Müşteri Bilgileri */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Müşteri Bilgileri</h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Ad Soyad:</span> {customerInfo.firstName} {customerInfo.lastName}</p>
            <p><span className="font-medium">Telefon:</span> {customerInfo.phone}</p>
            <p><span className="font-medium">E-posta:</span> {customerInfo.email}</p>
            {customerInfo.isTurkishCitizen ? (
              <p><span className="font-medium">TC No:</span> {customerInfo.tcNumber || 'Girilmemiş'}</p>
            ) : (
              <p><span className="font-medium">Pasaport No:</span> {customerInfo.passportNumber || 'Girilmemiş'}</p>
            )}
          </div>
        </div>

        {/* Rezervasyon Detayları */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Rezervasyon Detayları</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Misafir Sayısı:</span>
              <span className="font-medium text-gray-900">{guestCount} kişi</span>
            </div>
            {reservationNotes && (
              <div>
                <span className="text-gray-600 block mb-1">Referans Notu:</span>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md text-sm">
                  {reservationNotes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Fiyat Bilgileri */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Fiyat Bilgileri</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{useCustomPrice ? 'Özel Fiyat:' : 'Toplam Fiyat:'}</span>
              <span className="font-medium">₺{reservationDetails.totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Kapora (%20):</span>
              <span className="font-medium">₺{reservationDetails.depositAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Kapora Durumu:</span>
              <span className={`font-medium ${depositReceived ? 'text-green-600' : 'text-red-600'}`}>
                {depositReceived ? '✓ Alındı' : '✗ Alınmadı'}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Kalan Tutar:</span>
              <span className="font-medium">₺{reservationDetails.remainingAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedBungalow !== null;
      case 2:
        return selectedDates.length > 0;
      case 3:
        return customerInfo.firstName && customerInfo.lastName && customerInfo.email && customerInfo.phone && customerInfo.tcNumber;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Yeni Rezervasyon</h1>
          <p className="text-gray-600 mt-1">Adım adım rezervasyon oluşturun</p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Önceki
          </button>

          <div className="text-sm text-gray-500">
            Adım {currentStep} / {steps.length}
          </div>

          {currentStep === 4 ? (
            <button
              onClick={handleSubmitReservation}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
            >
              <CheckIcon className="w-4 h-4 mr-2" />
              Rezervasyonu Oluştur
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sonraki
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateReservation;
