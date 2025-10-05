import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const CancelReservationModal = ({ isOpen, onClose, reservation, onCancel }) => {
  const [cancelReason, setCancelReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !reservation) return null;

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Lütfen iptal sebebini belirtin!');
      return;
    }

    setIsLoading(true);
    const cancelToast = toast.loading('Rezervasyon iptal ediliyor...');
    
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onCancel({
        reservationId: reservation.id,
        reason: cancelReason,
        refundAmount: calculateRefund()
      });
      
      toast.success('Rezervasyon başarıyla iptal edildi!', { id: cancelToast });
      onClose();
    } catch (error) {
      console.error('İptal hatası:', error);
      toast.error('İptal sırasında bir hata oluştu!', { id: cancelToast });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRefund = () => {
    // İptal politikası: 24 saat öncesine kadar %100, sonrası %50
    const now = new Date();
    const checkIn = new Date(reservation.checkInDate);
    const hoursUntilCheckIn = (checkIn - now) / (1000 * 60 * 60);
    
    if (hoursUntilCheckIn > 24) {
      return reservation.paidAmount; // %100 iade
    } else if (hoursUntilCheckIn > 0) {
      return Math.round(reservation.paidAmount * 0.5); // %50 iade
    } else {
      return 0; // İade yok
    }
  };

  const refundPercentage = () => {
    const now = new Date();
    const checkIn = new Date(reservation.checkInDate);
    const hoursUntilCheckIn = (checkIn - now) / (1000 * 60 * 60);
    
    if (hoursUntilCheckIn > 24) return '100%';
    if (hoursUntilCheckIn > 0) return '50%';
    return '0%';
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Rezervasyonu İptal Et</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Bu işlem geri alınamaz. Lütfen dikkatli olun.
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

          {/* Rezervasyon Bilgileri */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Rezervasyon Bilgileri</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Rezervasyon Kodu:</span>
                <div className="font-medium text-gray-900">{reservation.reservationCode}</div>
              </div>
              <div>
                <span className="text-gray-600">Bungalov:</span>
                <div className="font-medium text-gray-900">Bungalov #{reservation.bungalowId}</div>
              </div>
              <div>
                <span className="text-gray-600">Giriş Tarihi:</span>
                <div className="font-medium text-gray-900">
                  {new Date(reservation.checkInDate).toLocaleDateString('tr-TR')}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Çıkış Tarihi:</span>
                <div className="font-medium text-gray-900">
                  {new Date(reservation.checkOutDate).toLocaleDateString('tr-TR')}
                </div>
              </div>
            </div>
          </div>

          {/* Ödeme Bilgileri */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Ödeme Bilgileri</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Tutar:</span>
                <span className="font-medium text-gray-900">₺{reservation.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ödenen Tutar:</span>
                <span className="font-medium text-gray-900">₺{reservation.paidAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">İade Edilecek Tutar:</span>
                <span className="font-medium text-green-600">₺{calculateRefund().toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500">
                İptal politikası: {refundPercentage()} iade (24 saat öncesine kadar %100, sonrası %50)
              </div>
            </div>
          </div>

          {/* İptal Sebebi */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İptal Sebebi *
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="İptal sebebini detaylı olarak açıklayın..."
              required
            />
          </div>

          {/* Uyarı Mesajı */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Dikkat!</p>
                <p className="mt-1">
                  Bu rezervasyon iptal edildikten sonra geri alınamaz. 
                  İptal işlemi sonrasında müşteriye bilgi verilecek ve gerekli iade işlemleri yapılacaktır.
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
              onClick={handleCancel}
              disabled={isLoading || !cancelReason.trim()}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>İptal Ediliyor...</span>
                </>
              ) : (
                <>
                  <XMarkIcon className="w-4 h-4" />
                  <span>Rezervasyonu İptal Et</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelReservationModal;
