import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  UserIcon,
  CalendarIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { 
  getReservationById, 
  getBungalowById, 
  getCustomerById,
  formatDate, 
  formatPrice,
  reservationService,
  customerService
} from '../data/data';
import toast from 'react-hot-toast';

const ReservationEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [reservation, setReservation] = useState(null);
  const [bungalow, setBungalow] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    guestCount: 1,
    notes: '',
    status: 'Bekleyen',
    paymentStatus: 'Ödenmedi'
  });

  useEffect(() => {
    // Rezervasyon bilgilerini getir
    const foundReservation = getReservationById(parseInt(id));
    if (foundReservation) {
      setReservation(foundReservation);
      
      // Bungalow bilgilerini getir
      const foundBungalow = getBungalowById(foundReservation.bungalowId);
      setBungalow(foundBungalow);
      
      // Müşteri bilgilerini getir
      const foundCustomer = getCustomerById(foundReservation.customerId);
      setCustomer(foundCustomer);
      
      // Form verilerini doldur
      setFormData({
        firstName: foundCustomer.firstName,
        lastName: foundCustomer.lastName,
        email: foundCustomer.email,
        phone: foundCustomer.phone,
        guestCount: foundReservation.guestCount,
        notes: foundReservation.notes || '',
        status: foundReservation.status,
        paymentStatus: foundReservation.paymentStatus
      });
    }
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Müşteri bilgilerini güncelle
      const customer = getCustomerById(reservation.customerId);
      if (customer) {
        const updatedCustomer = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        };
        
        // Local Storage'a müşteri güncelle
        const customerResult = customerService.update(customer.id, updatedCustomer);
        
        if (customerResult) {
          // Rezervasyon bilgilerini güncelle
          const updatedReservation = {
            guestCount: formData.guestCount,
            notes: formData.notes,
            status: formData.status,
            paymentStatus: formData.paymentStatus
          };
          
          const reservationResult = reservationService.update(parseInt(id), updatedReservation);
          
          if (reservationResult) {
            console.log('Rezervasyon güncellendi:', reservationResult);
            toast.success('Rezervasyon başarıyla güncellendi!');
            
            // Form verilerini güncelle
            setReservation(reservationResult);
            setFormData({
              firstName: updatedCustomer.firstName,
              lastName: updatedCustomer.lastName,
              email: updatedCustomer.email,
              phone: updatedCustomer.phone,
              guestCount: reservationResult.guestCount,
              notes: reservationResult.notes || '',
              status: reservationResult.status,
              paymentStatus: reservationResult.paymentStatus
            });
          } else {
            throw new Error('Rezervasyon güncellenemedi');
          }
        } else {
          throw new Error('Müşteri güncellenemedi');
        }
      } else {
        throw new Error('Müşteri bulunamadı');
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      toast.error('Güncelleme sırasında bir hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Eğer state'de from var ise oraya, yoksa rezervasyonlar listesine dön
    if (location.state?.from) {
      navigate(location.state.from, { replace: true });
      // Önceki sayfayı yenile ve scroll top yap
      setTimeout(() => {
        window.location.reload();
        window.scrollTo(0, 0);
      }, 100);
    } else {
      navigate(-1); // Bir önceki sayfaya dön
      // Önceki sayfayı yenile ve scroll top yap
      setTimeout(() => {
        window.location.reload();
        window.scrollTo(0, 0);
      }, 100);
    }
  };

  if (!reservation || !bungalow || !customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Rezervasyon bulunamadı</p>
        </div>
      </div>
    );
  }

  // Gece sayısını hesapla
  const nights = Math.ceil((new Date(reservation.checkOutDate) - new Date(reservation.checkInDate)) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Geri</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Rezervasyon Düzenle</h1>
                <p className="text-gray-600 mt-1">Rezervasyon kodu: {reservation.reservationCode}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
                <span>İptal</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>Değişiklikleri Kaydet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sol Kolon - Müşteri Bilgileri */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <UserIcon className="w-5 h-5 text-gray-600" />
              <div>
                <h2 className="text-lg font-medium text-gray-900">Müşteri Bilgileri</h2>
                <p className="text-sm text-gray-600">Müşteri iletişim bilgilerini güncelleyin</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Ad Soyad"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Soyad"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="ornek@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="+90 555 123 45 67"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Misafir Sayısı *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.guestCount}
                  onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value))}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notlar
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Özel istekler, notlar..."
                />
              </div>

              {/* Rezervasyon Durumu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rezervasyon Durumu
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="Bekleyen">Bekleyen</option>
                    <option value="Onaylandı">Onaylandı</option>
                    <option value="Giriş Yaptı">Giriş Yaptı</option>
                    <option value="Çıkış Yaptı">Çıkış Yaptı</option>
                    <option value="İptal Edildi">İptal Edildi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ödeme Durumu
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="Ödenmedi">Ödenmedi</option>
                    <option value="Kısmı Ödendi">Kısmı Ödendi</option>
                    <option value="Ödendi">Ödendi</option>
                    <option value="İade Edildi">İade Edildi</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Sağ Kolon - Rezervasyon Bilgileri */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CalendarIcon className="w-5 h-5 text-gray-600" />
              <div>
                <h2 className="text-lg font-medium text-gray-900">Rezervasyon Bilgileri</h2>
                <p className="text-sm text-gray-600">Rezervasyon detaylarını görüntüleyin</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bungalov</label>
                <div className="w-full h-10 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 flex items-center">
                  {bungalow.name}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tarihler</label>
                <div className="w-full h-10 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 flex items-center">
                  {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
                  <span className="ml-2 text-gray-500">({nights} gece)</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                <div className="w-full h-10 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 flex items-center">
                  Durum değişikliği bu sayfada yapılamaz
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat Bilgileri</label>
                <div className="bg-gray-50 border border-gray-300 rounded-md p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Temel fiyat ({nights} gece):</span>
                      <span className="text-gray-900">{formatPrice(reservation.bungalowPrice * nights)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">KDV:</span>
                      <span className="text-gray-900">{formatPrice(reservation.totalPrice - (reservation.bungalowPrice * nights))}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium border-t pt-2">
                      <span className="text-gray-900">Toplam:</span>
                      <span className="text-gray-900">{formatPrice(reservation.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationEditPage;
