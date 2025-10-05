import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  BuildingOfficeIcon,
  UserIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { bungalows, BUNGALOW_STATUS } from '../data/data';

const BungalowEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bungalow, setBungalow] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    capacity: 2,
    dailyPrice: 0,
    status: BUNGALOW_STATUS.ACTIVE,
    description: '',
    feature: ''
  });

  // Form validation
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Bungalov bilgilerini getir
    const foundBungalow = bungalows.find(b => b.id === parseInt(id));
    if (foundBungalow) {
      setBungalow(foundBungalow);
      setFormData({
        name: foundBungalow.name,
        capacity: foundBungalow.capacity,
        dailyPrice: foundBungalow.dailyPrice,
        status: foundBungalow.status,
        description: foundBungalow.description || '',
        feature: foundBungalow.feature || ''
      });
    }
  }, [id]);

  // Form validation
  useEffect(() => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Bungalov adı gereklidir';
    }
    
    if (formData.capacity < 1) {
      newErrors.capacity = 'Kapasite en az 1 olmalıdır';
    }
    
    if (formData.dailyPrice < 0) {
      newErrors.dailyPrice = 'Fiyat negatif olamaz';
    }
    
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!isFormValid) return;
    
    setIsSaving(true);
    
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Başarı mesajı
      alert('Bungalov başarıyla güncellendi!');
      
      // Bungalov detay sayfasına yönlendir
      navigate(`/bungalows/${id}`);
    } catch (error) {
      alert('Güncelleme sırasında bir hata oluştu!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/bungalows/${id}`);
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Bungalov Düzenle</h1>
                <p className="text-gray-600 mt-1">{bungalow.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={!isFormValid || isSaving}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Kaydet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-6">
            {/* Bungalov Adı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bungalov Adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Bungalov adını girin"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Kapasite ve Fiyat */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kapasite <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                    className={`w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                      errors.capacity ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="1"
                    max="20"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Günlük Fiyat (₺) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.dailyPrice}
                    onChange={(e) => handleInputChange('dailyPrice', parseInt(e.target.value) || 0)}
                    className={`w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                      errors.dailyPrice ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="0"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                {errors.dailyPrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.dailyPrice}</p>
                )}
              </div>
            </div>

            {/* Durum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durum <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="Aktif">Aktif</option>
                <option value="Pasif">Pasif</option>
                <option value="Bakımda">Bakımda</option>
              </select>
            </div>

            {/* Özellik */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Özellik
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.feature}
                  onChange={(e) => handleInputChange('feature', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Bungalov özelliği (örn: Deniz manzaralı, Havuzlu)"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <MapPinIcon className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                placeholder="Bungalov açıklaması"
              />
            </div>
          </div>
        </div>

        {/* Form Özeti */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-medium text-blue-900">Form Özeti</h3>
          </div>
          <div className="text-sm text-blue-800">
            <p><strong>Bungalov Adı:</strong> {formData.name || 'Belirtilmemiş'}</p>
            <p><strong>Kapasite:</strong> {formData.capacity} kişi</p>
            <p><strong>Günlük Fiyat:</strong> ₺{formData.dailyPrice.toLocaleString()}</p>
            <p><strong>Durum:</strong> {formData.status}</p>
            {formData.feature && <p><strong>Özellik:</strong> {formData.feature}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BungalowEditPage;
