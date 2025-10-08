import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  UserIcon, 
  EnvelopeIcon, 
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { customers, CUSTOMER_STATUS, getCustomerStatusBadge, customerService } from '../data/data';
import toast from 'react-hot-toast';

const CustomerEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    tcNumber: '',
    status: CUSTOMER_STATUS.ACTIVE
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Müşteri bilgilerini getir
    const foundCustomer = customers.find(c => c.id === parseInt(id));
    if (foundCustomer) {
      setCustomer(foundCustomer);
      setFormData({
        firstName: foundCustomer.firstName,
        lastName: foundCustomer.lastName,
        email: foundCustomer.email,
        phone: foundCustomer.phone,
        tcNumber: foundCustomer.tcNumber,
        status: foundCustomer.status
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
      // Local Storage'a müşteri güncelle
      const updatedCustomer = customerService.update(parseInt(id), formData);
      
      if (updatedCustomer) {
        console.log('Müşteri güncellendi:', updatedCustomer);
        toast.success('Müşteri başarıyla güncellendi!');
        
        // Form verilerini güncelle
        setCustomer(updatedCustomer);
        setFormData({
          firstName: updatedCustomer.firstName,
          lastName: updatedCustomer.lastName,
          email: updatedCustomer.email,
          phone: updatedCustomer.phone,
          tcNumber: updatedCustomer.tcNumber,
          status: updatedCustomer.status
        });
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
    // Eğer state'de from var ise oraya, yoksa müşteriler listesine dön
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

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Müşteri bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
                <h1 className="text-2xl font-bold text-gray-900">Müşteri Düzenle</h1>
                <p className="text-gray-600 mt-1">{customer.firstName} {customer.lastName}</p>
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
                    <span>Kaydet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kişisel Bilgiler */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <UserIcon className="w-5 h-5 text-gray-600 mr-2" />
                Kişisel Bilgiler
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Ad"
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
            </div>

            {/* İletişim Bilgileri */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <EnvelopeIcon className="w-5 h-5 text-gray-600 mr-2" />
                İletişim Bilgileri
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            </div>

            {/* Kimlik Bilgileri */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <DocumentTextIcon className="w-5 h-5 text-gray-600 mr-2" />
                Kimlik Bilgileri
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TC Kimlik No
                  </label>
                  <input
                    type="text"
                    value={formData.tcNumber}
                    onChange={(e) => handleInputChange('tcNumber', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="12345678901"
                    maxLength="11"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durum
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value={CUSTOMER_STATUS.ACTIVE}>Aktif</option>
                    <option value={CUSTOMER_STATUS.INACTIVE}>Pasif</option>
                    <option value={CUSTOMER_STATUS.BANNED}>Yasaklı</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mevcut Durum Gösterimi */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Mevcut Durum</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Durum:</span>
                  {getCustomerStatusBadge(customer.status)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Toplam Rezervasyon:</span>
                  <span className="text-sm font-medium text-gray-900">{customer.totalReservations}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Toplam Harcama:</span>
                  <span className="text-sm font-medium text-gray-900">₺{customer.totalSpent.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerEditPage;
