import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  CreditCardIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from './ui';

const PaymentModal = ({ isOpen, onClose, reservation, onPayment }) => {
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !reservation) return null;

  const handlePayment = async () => {
    if (paymentAmount <= 0) {
      toast.error('Lütfen geçerli bir ödeme tutarı girin!');
      return;
    }

    if (paymentAmount > remainingAmount) {
      toast.error('Ödeme tutarı kalan tutardan fazla olamaz!');
      return;
    }

    setIsLoading(true);
    const paymentToast = toast.loading('Ödeme kaydediliyor...');
    
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onPayment({
        reservationId: reservation.id,
        amount: paymentAmount,
        method: paymentMethod,
        notes: paymentNotes
      });
      
      toast.success('Ödeme başarıyla kaydedildi!', { id: paymentToast });
      onClose();
    } catch (error) {
      console.error('Ödeme hatası:', error);
      toast.error('Ödeme sırasında bir hata oluştu!', { id: paymentToast });
    } finally {
      setIsLoading(false);
    }
  };

  const paidAmount = reservation.paidAmount || 0;
  const totalPrice = reservation.totalPrice || 0;
  const remainingAmount = reservation.remainingAmount || 0;
  
  const newPaidAmount = paidAmount + paymentAmount;
  const newRemainingAmount = totalPrice - newPaidAmount;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ödeme Al"
      size="lg"
    >
      <ModalHeader>
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <CreditCardIcon className="w-8 h-8 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mt-1">
              Rezervasyon için ödeme kaydı oluşturun
            </p>
          </div>
        </div>
      </ModalHeader>
      
      <ModalBody>

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
            </div>
          </div>

          {/* Ödeme Bilgileri */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Mevcut Ödeme Durumu</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Tutar:</span>
                <span className="font-medium text-gray-900">₺{totalPrice.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ödenen Tutar:</span>
                <span className="font-medium text-gray-900">₺{paidAmount.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Kalan Tutar:</span>
                <span className="font-medium text-red-600">₺{remainingAmount.toLocaleString('tr-TR')}</span>
              </div>
            </div>
          </div>

          {/* Ödeme Tutarı */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ödeme Tutarı (₺) *
            </label>
            <input
              type="text"
              value={paymentAmount === 0 ? '' : paymentAmount.toLocaleString('tr-TR')}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '');
                setPaymentAmount(parseInt(value) || 0);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="0"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Maksimum: ₺{remainingAmount.toLocaleString('tr-TR')}
            </p>
          </div>

          {/* Ödeme Yöntemi */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ödeme Yöntemi *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="cash">Nakit</option>
              <option value="card">Kredi Kartı</option>
              <option value="bank_transfer">Banka Havalesi</option>
              <option value="other">Diğer</option>
            </select>
          </div>

          {/* Ödeme Notları */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ödeme Notları
            </label>
            <textarea
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Ödeme ile ilgili notlar..."
            />
          </div>

          {/* Ödeme Özeti */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
            <h4 className="text-sm font-medium text-green-900 mb-3">Ödeme Sonrası Durum</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Yeni Ödenen Tutar:</span>
                <span className="font-medium text-green-900">₺{newPaidAmount.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Yeni Kalan Tutar:</span>
                <span className={`font-medium ${newRemainingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₺{newRemainingAmount.toLocaleString('tr-TR')}
                </span>
              </div>
              {newRemainingAmount === 0 && (
                <div className="text-xs text-green-700 mt-2 p-2 bg-green-100 rounded">
                  ✅ Tüm ödemeler tamamlandı!
                </div>
              )}
            </div>
          </div>

          {/* Hızlı Ödeme Butonları */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hızlı Ödeme
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setPaymentAmount(remainingAmount)}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
              >
                Tümünü Öde
              </button>
              <button
                onClick={() => setPaymentAmount(Math.round(remainingAmount * 0.5))}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
              >
                %50'si
              </button>
              <button
                onClick={() => setPaymentAmount(Math.round(remainingAmount * 0.25))}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
              >
                %25'i
              </button>
            </div>
          </div>

      </ModalBody>
      
      <ModalFooter>
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Vazgeç
        </Button>
        <Button
          variant="success"
          onClick={handlePayment}
          disabled={isLoading || paymentAmount <= 0 || paymentAmount > remainingAmount}
          loading={isLoading}
          icon={<CheckIcon className="w-4 h-4" />}
        >
          Ödemeyi Kaydet
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PaymentModal;
