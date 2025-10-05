import React, { useState } from 'react';
import { 
  XMarkIcon,
  CurrencyDollarIcon,
  CheckIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { BadgeTurkishLiraIcon } from './ui/icons/lucide-badge-turkish-lira';

const ChangePriceModal = ({ isOpen, onClose, reservation, onChangePrice }) => {
  const [newPrice, setNewPrice] = useState(reservation?.totalPrice || 0);
  const [priceChangeReason, setPriceChangeReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !reservation) return null;

  const handleChangePrice = async () => {
    if (newPrice <= 0) {
      alert('Lütfen geçerli bir tutar girin!');
      return;
    }

    if (!priceChangeReason.trim()) {
      alert('Lütfen fiyat değişikliği sebebini belirtin!');
      return;
    }

    setIsLoading(true);
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onChangePrice({
        reservationId: reservation.id,
        newPrice: newPrice,
        reason: priceChangeReason
      });
      
      onClose();
    } catch (error) {
      console.error('Fiyat değişikliği hatası:', error);
      alert('Fiyat değişikliği sırasında bir hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  const priceDifference = newPrice - reservation.totalPrice;
  const newRemainingAmount = newPrice - reservation.paidAmount;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Tutar Değiştir</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Rezervasyon tutarını güncelleyin
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Mevcut Fiyat Bilgileri */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Mevcut Fiyat Bilgileri</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Mevcut Toplam Tutar:</span>
                <span className="font-medium text-gray-900">₺{reservation.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ödenen Tutar:</span>
                <span className="font-medium text-gray-900">₺{reservation.paidAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kalan Ödeme:</span>
                <span className="font-medium text-gray-900">₺{reservation.remainingAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Yeni Fiyat */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yeni Toplam Tutar *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BadgeTurkishLiraIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Fiyat Değişikliği Sebebi */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fiyat Değişikliği Sebebi *
            </label>
            <textarea
              value={priceChangeReason}
              onChange={(e) => setPriceChangeReason(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Fiyat değişikliği sebebini detaylı olarak açıklayın..."
              required
            />
          </div>

          {/* Yeni Fiyat Özeti */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <h4 className="text-sm font-medium text-blue-900 mb-3">Yeni Fiyat Özeti</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Yeni Toplam Tutar:</span>
                <span className="font-medium text-blue-900">₺{newPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Ödenen Tutar:</span>
                <span className="font-medium text-blue-900">₺{reservation.paidAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Yeni Kalan Ödeme:</span>
                <span className={`font-medium ${newRemainingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₺{newRemainingAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-blue-700">Fiyat Farkı:</span>
                <span className={`font-medium ${priceDifference > 0 ? 'text-red-600' : priceDifference < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                  {priceDifference > 0 ? '+' : ''}₺{priceDifference.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Uyarı Mesajı */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Dikkat!</p>
                <p className="mt-1">
                  Fiyat değişikliği yapıldıktan sonra müşteriye bilgi verilecek ve 
                  gerekli ödeme düzenlemeleri yapılacaktır.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Vazgeç
            </button>
            <button
              onClick={handleChangePrice}
              disabled={isLoading || newPrice <= 0 || !priceChangeReason.trim()}
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
                  <span>Tutarı Güncelle</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePriceModal;
