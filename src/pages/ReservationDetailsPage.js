import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
  CreditCardIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  PencilIcon,
  LinkIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { 
  getReservationById, 
  getBungalowById, 
  getCustomerById,
  formatDate, 
  formatPrice, 
  RESERVATION_STATUS,
  getReservationStatusBadge,
  getPaymentStatusBadge,
  reservationService,
  getSettings
} from '../data/data';
import PostponeReservationModal from '../components/PostponeReservationModal';
import CancelReservationModal from '../components/CancelReservationModal';
import ChangePriceModal from '../components/ChangePriceModal';
import PaymentModal from '../components/PaymentModal';

const ReservationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [bungalow, setBungalow] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal states
  const [showPostponeModal, setShowPostponeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showChangePriceModal, setShowChangePriceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Onay linki fonksiyonları
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Link panoya kopyalandı!');
    }).catch(() => {
      toast.error('Kopyalama başarısız!');
    });
  };

  const openWhatsApp = () => {
    if (!reservation?.confirmationLink || !customer?.phone) {
      toast.error('WhatsApp bilgileri eksik!');
      return;
    }

    const settings = getSettings();
    const phone = customer.phone.replace(/[^\d]/g, '');
    
    // WhatsApp şablonunu kullan
    let message = settings.whatsappIntegration?.confirmationMessage || `Merhaba ${customer.firstName} ${customer.lastName},

Rezervasyonunuz için onay linki:

{confirmationLink}

Bu link 24 saat geçerlidir. Lütfen kapora ödemesini yaparak rezervasyonunuzu onaylayın.

İyi günler!`;

    // Şablon değişkenlerini değiştir
    message = message
      .replace(/{customerName}/g, `${customer.firstName} ${customer.lastName}`)
      .replace(/{reservationCode}/g, reservation.code || reservation.reservationCode)
      .replace(/{bungalowName}/g, bungalow?.name || 'Bilinmiyor')
      .replace(/{checkInDate}/g, formatDate(reservation.checkInDate))
      .replace(/{checkOutDate}/g, formatDate(reservation.checkOutDate))
      .replace(/{totalPrice}/g, formatPrice(reservation.totalPrice))
      .replace(/{depositAmount}/g, formatPrice(reservation.depositAmount))
      .replace(/{confirmationLink}/g, reservation.confirmationLink);

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const sendEmail = () => {
    if (!reservation?.confirmationLink || !customer?.email) {
      toast.error('E-posta bilgileri eksik!');
      return;
    }

    const settings = getSettings();
    
    // E-posta şablonunu kullan
    let subject = settings.emailTemplates?.reservationConfirmation?.subject || `Rezervasyon Onay Linki - {reservationCode}`;
    let body = settings.emailTemplates?.reservationConfirmation?.template || `Merhaba {customerName},

Rezervasyonunuz için onay linki:

{confirmationLink}

Bu link 24 saat geçerlidir. Lütfen kapora ödemesini yaparak rezervasyonunuzu onaylayın.

Rezervasyon Detayları:
- Bungalov: {bungalowName}
- Giriş: {checkInDate}
- Çıkış: {checkOutDate}
- Toplam Tutar: {totalPrice}
- Kapora: {depositAmount}

İyi günler!`;

    // Şablon değişkenlerini değiştir
    const replacements = {
      '{customerName}': `${customer.firstName} ${customer.lastName}`,
      '{reservationCode}': reservation.code || reservation.reservationCode,
      '{bungalowName}': bungalow?.name || 'Bilinmiyor',
      '{checkInDate}': formatDate(reservation.checkInDate),
      '{checkOutDate}': formatDate(reservation.checkOutDate),
      '{totalPrice}': formatPrice(reservation.totalPrice),
      '{depositAmount}': formatPrice(reservation.depositAmount),
      '{confirmationLink}': reservation.confirmationLink
    };

    Object.entries(replacements).forEach(([key, value]) => {
      subject = subject.replace(new RegExp(key, 'g'), value);
      body = body.replace(new RegExp(key, 'g'), value);
    });

    const mailtoUrl = `mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

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
    }
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setIsLoading(true);
    try {
      // Rezervasyon durumunu güncelle
      const updatedReservation = reservationService.update(reservation.id, {
        ...reservation,
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      setReservation(updatedReservation);
      toast.success(`Rezervasyon durumu "${newStatus}" olarak güncellendi!`);
    } catch (error) {
      console.error('Durum değişikliği hatası:', error);
      toast.error('Durum değişikliği sırasında bir hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = () => {
    handleStatusChange(RESERVATION_STATUS.CHECKED_OUT);
  };

  const handlePostponeReservation = () => {
    setShowPostponeModal(true);
  };

  const handlePostpone = (data) => {
    try {
      // Yeni gece sayısını hesapla
      const newNights = Math.ceil((new Date(data.newCheckOutDate) - new Date(data.newCheckInDate)) / (1000 * 60 * 60 * 24));
      
      // Yeni fiyat bilgilerini hesapla
      const bungalow = getBungalowById(reservation.bungalowId);
      let newTotalPrice = reservation.totalPrice;
      let newRemainingAmount = reservation.remainingAmount;
      
      if (bungalow && data.newTotalPrice) {
        newTotalPrice = data.newTotalPrice;
        newRemainingAmount = newTotalPrice - (reservation.paidAmount || 0);
      }
      
      const updatedReservation = reservationService.update(reservation.id, {
        ...reservation,
        checkInDate: data.newCheckInDate,
        checkOutDate: data.newCheckOutDate,
        nights: newNights,
        totalPrice: newTotalPrice,
        remainingAmount: newRemainingAmount,
        updatedAt: new Date().toISOString()
      });
      
      setReservation(updatedReservation);
      setShowPostponeModal(false);
      toast.success('Rezervasyon başarıyla ertelendi!');
    } catch (error) {
      console.error('Erteleme hatası:', error);
      toast.error('Rezervasyon ertelenirken bir hata oluştu!');
    }
  };

  const handleCancelReservation = () => {
    setShowCancelModal(true);
  };

  const handleCancel = (data) => {
    try {
      const updatedReservation = reservationService.update(reservation.id, {
        ...reservation,
        status: 'İptal Edildi',
        cancelReason: data.reason,
        updatedAt: new Date().toISOString()
      });
      
      setReservation(updatedReservation);
      setShowCancelModal(false);
      toast.success('Rezervasyon başarıyla iptal edildi!');
    } catch (error) {
      console.error('İptal hatası:', error);
      toast.error('Rezervasyon iptal edilirken bir hata oluştu!');
    }
  };

  const handleChangePrice = () => {
    setShowChangePriceModal(true);
  };

  const handlePriceChange = (data) => {
    try {
      const updatedReservation = reservationService.update(reservation.id, {
        ...reservation,
        totalPrice: data.newTotalPrice,
        remainingAmount: data.newTotalPrice - (reservation.paidAmount || 0),
        updatedAt: new Date().toISOString()
      });
      
      setReservation(updatedReservation);
      setShowChangePriceModal(false);
      toast.success('Fiyat başarıyla güncellendi!');
    } catch (error) {
      console.error('Fiyat değişikliği hatası:', error);
      toast.error('Fiyat güncellenirken bir hata oluştu!');
    }
  };

  const handleTakePayment = () => {
    setShowPaymentModal(true);
  };

  const handlePayment = (data) => {
    try {
      const newPaidAmount = (reservation.paidAmount || 0) + data.amount;
      const newRemainingAmount = reservation.totalPrice - newPaidAmount;
      
      const updatedReservation = reservationService.update(reservation.id, {
        ...reservation,
        paidAmount: newPaidAmount,
        remainingAmount: newRemainingAmount,
        paymentStatus: newRemainingAmount <= 0 ? 'Ödendi' : 'Kısmı Ödendi',
        updatedAt: new Date().toISOString()
      });
      
      setReservation(updatedReservation);
      setShowPaymentModal(false);
      toast.success('Ödeme başarıyla kaydedildi!');
    } catch (error) {
      console.error('Ödeme hatası:', error);
      toast.error('Ödeme kaydedilirken bir hata oluştu!');
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
  
  // Güvenli değerler
  const bungalowPrice = reservation.bungalowPrice || 0;
  const totalPrice = reservation.totalPrice || 0;
  const paidAmount = reservation.paidAmount || 0;
  const remainingAmount = reservation.remainingAmount || 0;

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
                <h1 className="text-2xl font-bold text-gray-900">Rezervasyon Detayı</h1>
                <p className="text-gray-600 mt-1">Rezervasyon kodu: {reservation.reservationCode}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
            
              <button 
                onClick={() => navigate(`/reservations/${reservation.id}/edit`)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <PencilIcon className="w-4 h-4" />
                <span>Düzenle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="space-y-6">
          {/* 1. Satır: Rezervasyon Bilgileri - Müşteri Bilgileri */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rezervasyon Bilgileri */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Rezervasyon Bilgileri</h2>
                  <p className="text-sm text-gray-600">Rezervasyon detayları ve tarih bilgileri</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Ana Bilgiler */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Bungalov</p>
                      <button 
                        onClick={() => navigate(`/bungalows/${bungalow.id}`)}
                        className="text-base text-gray-900 font-medium hover:text-gray-600 hover:underline cursor-pointer"
                      >
                        {bungalow.name}
                      </button>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Rezervasyon Kodu</p>
                      <p className="text-base text-gray-900 font-mono bg-gray-100 px-3 py-1 rounded-md inline-block">
                        {reservation.reservationCode}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Misafir Sayısı</p>
                      <p className="text-base text-gray-900 font-medium">{reservation.guestCount} kişi</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Giriş Tarihi</p>
                      <p className="text-base text-gray-900 font-medium">{formatDate(reservation.checkInDate)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Çıkış Tarihi</p>
                      <p className="text-base text-gray-900 font-medium">{formatDate(reservation.checkOutDate)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Konaklama Süresi</p>
                      <p className="text-base text-gray-900 font-medium">{nights} gece</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Müşteri Bilgileri */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Müşteri Bilgileri</h2>
                  <p className="text-sm text-gray-600">Müşteri iletişim bilgileri</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Ad Soyad</p>
                  <button 
                    onClick={() => navigate(`/customers/${customer.id}`)}
                    className="text-base text-gray-900 font-medium hover:text-gray-600 hover:underline cursor-pointer"
                  >
                    {customer.firstName} {customer.lastName}
                  </button>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">E-posta</p>
                  <p className="text-base text-gray-900 font-medium">{customer.email}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Telefon</p>
                  <p className="text-base text-gray-900 font-medium">{customer.phone}</p>
                </div>
                
                {reservation.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Notlar</p>
                    <p className="text-base text-gray-900 font-medium">
                      {reservation.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Onay Linki Bölümü - Sadece Bekleyen rezervasyonlar için */}
          {reservation.status === RESERVATION_STATUS.PENDING && reservation.confirmationLink && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <LinkIcon className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Onay Linki</h2>
                  <p className="text-sm text-gray-600">Müşteriye gönderilecek onay linki</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Onay Linki */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Onay Linki
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={reservation.confirmationLink}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(reservation.confirmationLink)}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 h-9 px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
                      title="Kopyala"
                    >
                      <ClipboardDocumentIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Süre Bilgisi */}
                {reservation.confirmationExpiresAt && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Onay Süresi</p>
                        <p className="text-sm text-yellow-700">
                          Bu link {new Date(reservation.confirmationExpiresAt).toLocaleString('tr-TR')} tarihine kadar geçerlidir.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Gönderim Butonları */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={openWhatsApp}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 h-9 px-4 py-2 bg-green-600 text-white hover:bg-green-700"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    <span>WhatsApp ile Gönder</span>
                  </button>
                  
                  <button
                    onClick={sendEmail}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 h-9 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <EnvelopeIcon className="w-4 h-4" />
                    <span>E-posta ile Gönder</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. Satır: Durum İşlemleri - Fiyat ve Ödeme Detayları */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Durum İşlemleri */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Durum İşlemleri</h2>
                  <p className="text-sm text-gray-600">Rezervasyon durumunu yönetin</p>
                </div>
              </div>
              
              {/* Mevcut Durum Göstergesi */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Mevcut Durum</p>
                    <div className="mt-1">
                      {getReservationStatusBadge(reservation.status)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Son Güncelleme</p>
                    <p className="text-sm text-gray-900">{formatDate(reservation.updatedAt || reservation.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Ana Durum İşlemleri */}
              <div className="space-y-4">
                {/* Birincil İşlem */}
                {reservation.status === RESERVATION_STATUS.PENDING && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-3 h-3 text-gray-600" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-800">Rezervasyon Onayı</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">Bu rezervasyonu onaylayarak müşteriye onay e-postası gönderilecek.</p>
                    <button
                      onClick={() => handleStatusChange(RESERVATION_STATUS.CONFIRMED)}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <CheckIcon className="w-4 h-4" />
                      )}
                      <span>Rezervasyonu Onayla</span>
                    </button>
                  </div>
                )}
                
                {reservation.status === RESERVATION_STATUS.CONFIRMED && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-3 h-3 text-gray-600" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-800">Giriş İşlemi</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">Müşteri bungalova giriş yapmıştır. Giriş işlemini onaylayın.</p>
                    <button
                      onClick={() => handleStatusChange(RESERVATION_STATUS.CHECKED_IN)}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <CheckIcon className="w-4 h-4" />
                      )}
                      <span>Giriş Yapıldı Olarak İşaretle</span>
                    </button>
                  </div>
                )}
                
                {reservation.status === RESERVATION_STATUS.CHECKED_IN && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-3 h-3 text-gray-600" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-800">Çıkış İşlemi</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">Müşteri bungalovdan çıkış yapmıştır. Rezervasyonu tamamlayın.</p>
                    <button
                      onClick={handleCheckOut}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <CheckIcon className="w-4 h-4" />
                      )}
                      <span>Çıkış Yapıldı Olarak İşaretle</span>
                    </button>
                  </div>
                )}
                
                {reservation.status === RESERVATION_STATUS.CHECKED_OUT && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-3 h-3 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Rezervasyon Tamamlandı</h3>
                        <p className="text-sm text-gray-700">Bu rezervasyon başarıyla tamamlanmıştır.</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Fiyat ve Ödeme Detayları */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CreditCardIcon className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Fiyat ve Ödeme Detayları</h2>
                  <p className="text-sm text-gray-600">Ödeme durumu ve fiyat bilgileri</p>
                </div>
              </div>
              
              <div className="mb-6">
                {getPaymentStatusBadge(reservation.paymentStatus)}
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Temel fiyat ({nights} gece) (KDV Dahil)</span>
                  <span className="text-sm text-gray-900">{formatPrice(bungalowPrice * nights)}</span>
                </div>
                
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-sm font-medium text-gray-900">Toplam Tutar</span>
                  <span className="text-lg font-bold text-gray-900">{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Alınan Kapora</span>
                  <span className="text-sm text-gray-900 font-medium">{formatPrice(paidAmount)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Kalan Ödeme</span>
                  <span className={`text-sm font-medium ${remainingAmount > 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                    {formatPrice(remainingAmount)}
                  </span>
                </div>
              </div>
              
              {remainingAmount > 0 ? (
                <div className="mt-6">
                  <button
                    onClick={handleTakePayment}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <CreditCardIcon className="w-4 h-4" />
                    <span>Ödeme Al</span>
                  </button>
                </div>
              ) : (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <span className="text-sm text-gray-800 font-medium">Ödeme Tamamlandı</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">Tüm ödemeler alınmıştır</p>
                </div>
              )}
            </div>
          </div>

          {/* 3. Satır: Yardımcı İşlemler */}
          {reservation.status !== RESERVATION_STATUS.CHECKED_OUT && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Yardımcı İşlemler</h2>
                  <p className="text-sm text-gray-600">Rezervasyon için ek işlemler</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handlePostponeReservation}
                  className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ClockIcon className="w-4 h-4" />
                  <span>Rezervasyonu Ertele</span>
                </button>
                
                <button
                  onClick={handleCancelReservation}
                  className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                  <span>Rezervasyonu İptal Et</span>
                </button>
                
                {reservation.status !== RESERVATION_STATUS.CHECKED_IN && (
                  <button
                    onClick={handleChangePrice}
                    className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <CurrencyDollarIcon className="w-4 h-4" />
                    <span>Fiyatı Değiştir</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <PostponeReservationModal
        isOpen={showPostponeModal}
        onClose={() => setShowPostponeModal(false)}
        reservation={reservation}
        onPostpone={handlePostpone}
      />

      <CancelReservationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        reservation={reservation}
        onCancel={handleCancel}
      />

      <ChangePriceModal
        isOpen={showChangePriceModal}
        onClose={() => setShowChangePriceModal(false)}
        reservation={reservation}
        onChangePrice={handlePriceChange}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        reservation={reservation}
        onPayment={handlePayment}
      />
    </div>
  );
};

export default ReservationDetailsPage;
