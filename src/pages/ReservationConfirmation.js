import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { getReservationByConfirmationCode, getBungalowById, getCustomerById, reservationService, getSettings } from '../data/data';

const ReservationConfirmation = () => {
  const { confirmationCode } = useParams();
  const navigate = useNavigate();
  
  console.log('ReservationConfirmation component loaded!');
  console.log('Confirmation code:', confirmationCode);
  const [reservation, setReservation] = useState(null);
  const [bungalow, setBungalow] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [expired, setExpired] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [settings, setSettings] = useState(null);

  // Form data - Sadece gerekli alanlar
  const [formData, setFormData] = useState({
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    iban: '',
    transferDate: '',
    referenceNumber: ''
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadReservation = async () => {
      try {
        setLoading(true);
        
        console.log('Aranan confirmationCode:', confirmationCode);
        
        // Rezervasyonu confirmationCode ile bul
        const foundReservation = getReservationByConfirmationCode(confirmationCode);
        
        if (foundReservation) {
          console.log('Rezervasyon bulundu:', foundReservation);
          setReservation(foundReservation);
          
          // Müşteri bilgilerini getir
          const customer = getCustomerById(foundReservation.customerId);
          if (customer) {
            setCustomer(customer);
          }
          
          // Bungalov bilgilerini getir
          const bungalow = getBungalowById(foundReservation.bungalowId);
          if (bungalow) {
            setBungalow(bungalow);
          }
          
          // Onay süresi kontrolü
          if (foundReservation.confirmationExpiresAt) {
            const now = new Date();
            const expiresAt = new Date(foundReservation.confirmationExpiresAt);
            if (now > expiresAt) {
              setExpired(true);
            }
          }
        } else {
          console.log('Rezervasyon bulunamadı');
          setNotFound(true);
        }
      } catch (error) {
        console.error('Rezervasyon yükleme hatası:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    const loadSettings = () => {
      const appSettings = getSettings();
      setSettings(appSettings);
    };

    loadReservation();
    loadSettings();
  }, [confirmationCode]);

  useEffect(() => {
    if (reservation && reservation.confirmationExpiresAt) {
      const interval = setInterval(() => {
        const now = new Date();
        const expiresAt = new Date(reservation.confirmationExpiresAt);
        const diff = expiresAt.getTime() - now.getTime();

        if (diff <= 0) {
          setExpired(true);
          clearInterval(interval);
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft({ hours, minutes, seconds });
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [reservation]);


  const validateForm = () => {
    const newErrors = {};

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Banka adı gereklidir';
    }
    if (!formData.accountHolder.trim()) {
      newErrors.accountHolder = 'Hesap sahibi adı gereklidir';
    }
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Hesap numarası gereklidir';
    }
    if (!formData.iban.trim()) {
      newErrors.iban = 'IBAN gereklidir';
    }
    if (!formData.transferDate) {
      newErrors.transferDate = 'Havale tarihi gereklidir';
    }
    if (!formData.referenceNumber.trim()) {
      newErrors.referenceNumber = 'Referans numarası gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Hata varsa temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleConfirmReservation = async () => {
    if (!validateForm()) {
      toast.error('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    try {
      setConfirming(true);

      const depositAmount = settings?.defaultDepositAmount || 500;

      // Rezervasyonu güncelle
      const updatedReservation = reservationService.update(reservation.id, {
        ...reservation,
        status: 'Onaylandı',
        paymentStatus: 'Kısmı Ödendi',
        paidAmount: depositAmount,
        remainingAmount: reservation.totalPrice - depositAmount,
        depositInfo: {
          amount: depositAmount,
          bankName: formData.bankName,
          accountHolder: formData.accountHolder,
          accountNumber: formData.accountNumber,
          iban: formData.iban,
          transferDate: formData.transferDate,
          referenceNumber: formData.referenceNumber,
          confirmedAt: new Date().toISOString()
        },
        confirmedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      setReservation(updatedReservation);
      toast.success('Rezervasyonunuz başarıyla onaylandı!');
      
      // 3 saniye sonra ana sayfaya yönlendir
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Rezervasyon onaylanırken hata:', error);
      toast.error('Rezervasyon onaylanırken hata oluştu');
    } finally {
      setConfirming(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Test için basit sayfa
  if (confirmationCode === 'test') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Test Sayfası</h1>
          <p className="text-gray-600">Bu sayfa herkese açık!</p>
          <p className="text-gray-600">Confirmation Code: {confirmationCode}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Rezervasyon yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!reservation || !bungalow || !customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Rezervasyon Bulunamadı</h1>
          <p className="text-gray-600 mb-6">Aradığınız rezervasyon bulunamadı veya geçersiz.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <ClockIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Onay Süresi Doldu</h1>
          <p className="text-gray-600 mb-6">Rezervasyon onay süresi dolmuş ve otomatik olarak iptal edilmiştir.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  const depositAmount = settings?.defaultDepositAmount || 500;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rezervasyon Onayı</h1>
          <p className="text-gray-600">Rezervasyonunuzu onaylamak için kapora ödemesini yapın</p>
        </div>

        {/* Süre Sayacı */}
        {timeLeft && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center">
              <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800 font-medium">
                Onay süresi: {timeLeft.hours} saat {timeLeft.minutes} dakika {timeLeft.seconds} saniye
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rezervasyon Bilgileri */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 text-blue-600 mr-2" />
              Rezervasyon Bilgileri
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Bungalov</p>
                  <p className="font-medium text-gray-900">{bungalow.name}</p>
                </div>
              </div>

              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Tarih</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Süre</p>
                  <p className="font-medium text-gray-900">{reservation.nights} gece</p>
                </div>
              </div>

              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Toplam Tutar</p>
                  <p className="font-medium text-gray-900">{formatPrice(reservation.totalPrice)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Müşteri</p>
                  <p className="font-medium text-gray-900">{customer.firstName} {customer.lastName}</p>
                </div>
              </div>

              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="font-medium text-gray-900">{customer.phone}</p>
                </div>
              </div>

              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">E-posta</p>
                  <p className="font-medium text-gray-900">{customer.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kapora Ödeme Formu */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <BanknotesIcon className="h-5 w-5 text-green-600 mr-2" />
              Kapora Ödeme Bilgileri
            </h2>
            
            {/* Kapora Tutarı - Sabit */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Kapora Tutarı</p>
                  <p className="text-2xl font-bold text-green-800">{formatPrice(depositAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">Sabit Tutar</p>
                  <p className="text-xs text-green-500">Değiştirilemez</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleConfirmReservation(); }} className="space-y-4">
              {/* Banka Adı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banka Adı *
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className={`w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.bankName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Örn: Ziraat Bankası"
                />
                {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
              </div>

              {/* Hesap Sahibi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hesap Sahibi Adı *
                </label>
                <input
                  type="text"
                  name="accountHolder"
                  value={formData.accountHolder}
                  onChange={handleInputChange}
                  className={`w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.accountHolder ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ad Soyad"
                />
                {errors.accountHolder && <p className="text-red-500 text-xs mt-1">{errors.accountHolder}</p>}
              </div>

              {/* Hesap Numarası */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hesap Numarası *
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className={`w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.accountNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Hesap numarası"
                />
                {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
              </div>

              {/* IBAN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IBAN *
                </label>
                <input
                  type="text"
                  name="iban"
                  value={formData.iban}
                  onChange={handleInputChange}
                  className={`w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.iban ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                />
                {errors.iban && <p className="text-red-500 text-xs mt-1">{errors.iban}</p>}
              </div>

              {/* Havale Tarihi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Havale Tarihi *
                </label>
                <input
                  type="date"
                  name="transferDate"
                  value={formData.transferDate}
                  onChange={handleInputChange}
                  className={`w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.transferDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.transferDate && <p className="text-red-500 text-xs mt-1">{errors.transferDate}</p>}
              </div>

              {/* Referans Numarası */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referans Numarası *
                </label>
                <input
                  type="text"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleInputChange}
                  className={`w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.referenceNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Havale referans numarası"
                />
                {errors.referenceNumber && <p className="text-red-500 text-xs mt-1">{errors.referenceNumber}</p>}
              </div>

              {/* Onay Butonu */}
              <button
                type="submit"
                disabled={confirming}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {confirming ? 'Onaylanıyor...' : 'Rezervasyonu Onayla'}
              </button>
            </form>

            {/* Bilgilendirme */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Not:</strong> Kapora ödemesi yapıldıktan sonra rezervasyonunuz otomatik olarak onaylanacaktır. 
                Ödeme bilgileriniz güvenli bir şekilde saklanmaktadır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationConfirmation;