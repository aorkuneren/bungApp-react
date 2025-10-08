import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBungalowById, getCustomerById } from '../../data/data';
import { StatusBadge } from '../ui';

const ReservationCard = memo(({ reservation, showDate = true }) => {
  const navigate = useNavigate();
  const bungalow = getBungalowById(reservation.bungalowId);
  const customer = getCustomerById(reservation.customerId);

  const formatShortDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }, []);

  const handleReservationClick = useCallback(() => {
    navigate(`/reservations/${reservation.id}`);
  }, [navigate, reservation.id]);

  return (
    <div className="block">
      <div 
        onClick={handleReservationClick}
        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      >
        <div className="flex-1">
          {/* Ad Soyad, Durum, Ödeme Durumu */}
          <div className="flex items-center gap-2 mb-2">
            <p className="font-medium text-sm text-gray-900">
              {customer ? `${customer.firstName} ${customer.lastName}` : 'Bilinmiyor'}
            </p>
            <StatusBadge status={reservation.status} type="reservation" />
            <StatusBadge status={reservation.paymentStatus} type="payment" />
          </div>
          
          {/* Bungalov Adı - Giriş/Çıkış Tarihi */}
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600 font-medium">
              {bungalow?.name || 'Bilinmiyor'}
            </p>
            {showDate && (
              <p className="text-sm text-gray-600">
                {formatShortDate(reservation.checkInDate)} / {formatShortDate(reservation.checkOutDate)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center rounded-md border border-gray-200 px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer">
            Detay
          </span>
        </div>
      </div>
    </div>
  );
});

ReservationCard.displayName = 'ReservationCard';

export default ReservationCard;
