import React, { useState, useEffect } from 'react';
import { 
  CogIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  GlobeAltIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { settingsService } from '../services/settingsService';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('genel');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Genel Ayarlar
    siteName: 'Bungalov Yönetim Sistemi',
    siteDescription: 'Profesyonel bungalov rezervasyon yönetimi',
    timezone: 'Europe/Istanbul',
    language: 'tr', // Sabit - değiştirilemez
    currency: 'TRY', // Sabit - değiştirilemez
    
    // Bildirim Ayarları
    emailNotifications: true,
    smsNotifications: false,
    reservationAlerts: true,
    paymentAlerts: true,
    systemAlerts: true,
    
    // Güvenlik Ayarları
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    
    // Rezervasyon Ayarları
    advanceBookingDays: 365,
    cancellationPolicy: '24 saat öncesine kadar ücretsiz iptal',
    depositRequired: true,
    depositPercentage: 20,
    
    // Ödeme Ayarları
    paymentMethods: ['credit_card', 'bank_transfer', 'cash'],
    taxRate: 18,
    serviceFee: 0,
    
    // Bungalov Ayarları
    maxOccupancy: 6,
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cleaningFee: 0,
    
    // Sistem Ayarları
    maintenanceMode: false,
    backupFrequency: 'daily',
    logRetention: 30,
    
    // Fiyat Kuralları
    minimumStay: {
      enabled: true,
      value: 1
    },
    weekendPricing: {
      enabled: true,
      type: 'percentage', // 'amount' or 'percentage'
      value: 20 // 20% or 200 TL
    },
    seasonalPricing: {
      enabled: true,
      seasons: [
        { id: 1, name: 'İlkbahar', type: 'percentage', value: 0, months: [3, 4, 5] },
        { id: 2, name: 'Yaz', type: 'percentage', value: 50, months: [6, 7, 8] },
        { id: 3, name: 'Sonbahar', type: 'percentage', value: 20, months: [9, 10, 11] },
        { id: 4, name: 'Kış', type: 'percentage', value: -20, months: [12, 1, 2] }
      ]
    },
    specialDates: {
      enabled: true,
      dates: [
        { id: 1, name: 'Sevgililer Günü', startDate: '2025-02-14', endDate: '2025-02-14', type: 'percentage', value: 30 },
        { id: 2, name: 'Yılbaşı', startDate: '2025-01-01', endDate: '2025-01-01', type: 'percentage', value: 50 },
        { id: 3, name: 'Kurban Bayramı', startDate: '2025-06-16', endDate: '2025-06-19', type: 'percentage', value: 40 }
      ]
    },
    monthlyPricing: {
      enabled: true,
      months: [
        { id: 1, month: 1, name: 'Ocak', type: 'percentage', value: -10 },
        { id: 2, month: 2, name: 'Şubat', type: 'percentage', value: -5 },
        { id: 3, month: 3, name: 'Mart', type: 'percentage', value: 0 }
      ]
    }
  });

  // Ayarları yükle
  useEffect(() => {
    loadSettings();
    // Test toast
    toast.success('Settings sayfası yüklendi!');
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const allSettings = await settingsService.getAllSettings();
      setSettings(prevSettings => ({
        ...prevSettings,
        ...allSettings.general,
        ...allSettings.notifications,
        ...allSettings.security,
        ...allSettings.reservations,
        ...allSettings.payments
      }));
    } catch (error) {
      console.error('Ayarlar yüklenemedi:', error);
      toast.error('Ayarlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Genel ayarları kaydet
  const saveGeneralSettings = async () => {
    setSaving(true);
    try {
      const generalSettings = {
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        timezone: settings.timezone
        // language ve currency sabit - API'ye gönderilmez
      };
      
      await settingsService.updateGeneralSettings(generalSettings);
      toast.success('Genel ayarlar başarıyla kaydedildi');
    } catch (error) {
      console.error('Genel ayarlar kaydedilemedi:', error);
      toast.error('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  // Bildirim ayarlarını kaydet
  const saveNotificationSettings = async () => {
    setSaving(true);
    try {
      const notificationSettings = {
        emailNotifications: settings.emailNotifications,
        smsNotifications: settings.smsNotifications,
        reservationAlerts: settings.reservationAlerts,
        paymentAlerts: settings.paymentAlerts,
        systemAlerts: settings.systemAlerts
      };
      
      await settingsService.updateNotificationSettings(notificationSettings);
      toast.success('Bildirim ayarları başarıyla kaydedildi');
    } catch (error) {
      console.error('Bildirim ayarları kaydedilemedi:', error);
      toast.error('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  // Güvenlik ayarlarını kaydet
  const saveSecuritySettings = async () => {
    setSaving(true);
    try {
      const securitySettings = {
        twoFactorAuth: settings.twoFactorAuth,
        sessionTimeout: settings.sessionTimeout,
        passwordExpiry: settings.passwordExpiry,
        loginAttempts: settings.loginAttempts
      };
      
      await settingsService.updateSecuritySettings(securitySettings);
      toast.success('Güvenlik ayarları başarıyla kaydedildi');
    } catch (error) {
      console.error('Güvenlik ayarları kaydedilemedi:', error);
      toast.error('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  // Rezervasyon ayarlarını kaydet
  const saveReservationSettings = async () => {
    setSaving(true);
    try {
      const reservationSettings = {
        advanceBookingDays: settings.advanceBookingDays,
        cancellationPolicy: settings.cancellationPolicy,
        depositRequired: settings.depositRequired,
        depositPercentage: settings.depositPercentage,
        maxOccupancy: settings.maxOccupancy,
        checkInTime: settings.checkInTime,
        checkOutTime: settings.checkOutTime,
        minimumStay: settings.minimumStay,
        weekendPricing: settings.weekendPricing,
        seasonalPricing: settings.seasonalPricing,
        monthlyPricing: settings.monthlyPricing,
        specialDates: settings.specialDates
      };
      
      await settingsService.updateReservationSettings(reservationSettings);
      toast.success('Rezervasyon ayarları başarıyla kaydedildi');
    } catch (error) {
      console.error('Rezervasyon ayarları kaydedilemedi:', error);
      toast.error('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  // Ödeme ayarlarını kaydet
  const savePaymentSettings = async () => {
    setSaving(true);
    try {
      const paymentSettings = {
        paymentMethods: settings.paymentMethods,
        taxRate: settings.taxRate,
        serviceFee: settings.serviceFee
      };
      
      await settingsService.updatePaymentSettings(paymentSettings);
      toast.success('Ödeme ayarları başarıyla kaydedildi');
    } catch (error) {
      console.error('Ödeme ayarları kaydedilemedi:', error);
      toast.error('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  // Aktif tab'a göre kaydetme fonksiyonu
  const handleSave = () => {
    switch (activeTab) {
      case 'genel':
        saveGeneralSettings();
        break;
      case 'bildirimler':
        saveNotificationSettings();
        break;
      case 'guvenlik':
        saveSecuritySettings();
        break;
      case 'rezervasyonlar':
        saveReservationSettings();
        break;
      case 'odemeler':
        savePaymentSettings();
        break;
      default:
        toast.error('Bilinmeyen tab');
    }
  };

  const tabs = [
    { id: 'genel', name: 'Genel', icon: CogIcon },
    { id: 'bildirimler', name: 'Bildirimler', icon: BellIcon },
    { id: 'guvenlik', name: 'Güvenlik', icon: ShieldCheckIcon },
    { id: 'rezervasyon', name: 'Rezervasyon', icon: DocumentTextIcon },
    { id: 'odeme', name: 'Ödeme', icon: CurrencyDollarIcon },
    { id: 'bungalov', name: 'Bungalov', icon: BuildingOfficeIcon },
    { id: 'fiyat-kurallari', name: 'Kurallar', icon: CurrencyDollarIcon },
    { id: 'sistem', name: 'Sistem', icon: GlobeAltIcon }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };


  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Adı
        </label>
        <input
          type="text"
          value={settings.siteName}
          onChange={(e) => handleSettingChange('siteName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Açıklaması
        </label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Dil <span className="text-xs text-gray-400">(Sabit)</span>
          </label>
          <select
            value={settings.language}
            disabled
            className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
          >
            <option value="tr">Türkçe</option>
          </select>
          <p className="mt-1 text-xs text-gray-400">Dil ayarı sabit olarak Türkçe olarak belirlenmiştir.</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Para Birimi <span className="text-xs text-gray-400">(Sabit)</span>
          </label>
          <select
            value={settings.currency}
            disabled
            className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
          >
            <option value="TRY">Türk Lirası (₺)</option>
          </select>
          <p className="mt-1 text-xs text-gray-400">Para birimi sabit olarak Türk Lirası olarak belirlenmiştir.</p>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Bildirim Türleri</h3>
        
        <div className="space-y-3">
          {[
            { key: 'emailNotifications', label: 'E-posta Bildirimleri', description: 'E-posta ile bildirim al' },
            { key: 'smsNotifications', label: 'SMS Bildirimleri', description: 'SMS ile bildirim al' },
            { key: 'reservationAlerts', label: 'Rezervasyon Uyarıları', description: 'Yeni rezervasyon bildirimleri' },
            { key: 'paymentAlerts', label: 'Ödeme Uyarıları', description: 'Ödeme durumu bildirimleri' },
            { key: 'systemAlerts', label: 'Sistem Uyarıları', description: 'Sistem durumu bildirimleri' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{item.label}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <button
                onClick={() => handleSettingChange(item.key, !settings[item.key])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[item.key] ? 'bg-gray-900' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Güvenlik Ayarları</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">İki Faktörlü Kimlik Doğrulama</h4>
              <p className="text-sm text-gray-600">Hesap güvenliğini artır</p>
            </div>
            <button
              onClick={() => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.twoFactorAuth ? 'bg-gray-900' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oturum Zaman Aşımı (dakika)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifre Geçerlilik Süresi (gün)
              </label>
              <input
                type="number"
                value={settings.passwordExpiry}
                onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReservationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Rezervasyon Ayarları</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İleri Rezervasyon Günü
            </label>
            <input
              type="number"
              value={settings.advanceBookingDays}
              onChange={(e) => handleSettingChange('advanceBookingDays', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kapora Yüzdesi (%)
            </label>
            <input
              type="number"
              value={settings.depositPercentage}
              onChange={(e) => handleSettingChange('depositPercentage', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İptal Politikası
          </label>
          <textarea
            value={settings.cancellationPolicy}
            onChange={(e) => handleSettingChange('cancellationPolicy', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Kapora Gerekli</h4>
            <p className="text-sm text-gray-600">Rezervasyon için kapora alınması</p>
          </div>
          <button
            onClick={() => handleSettingChange('depositRequired', !settings.depositRequired)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.depositRequired ? 'bg-gray-900' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.depositRequired ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Ödeme Ayarları</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              KDV Oranı (%)
            </label>
            <input
              type="number"
              value={settings.taxRate}
              onChange={(e) => handleSettingChange('taxRate', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hizmet Bedeli (₺)
            </label>
            <input
              type="number"
              value={settings.serviceFee}
              onChange={(e) => handleSettingChange('serviceFee', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ödeme Yöntemleri
          </label>
          <div className="space-y-2">
            {[
              { key: 'credit_card', label: 'Kredi Kartı' },
              { key: 'bank_transfer', label: 'Banka Havalesi' },
              { key: 'cash', label: 'Nakit' }
            ].map((method) => (
              <label key={method.key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.paymentMethods.includes(method.key)}
                  onChange={(e) => {
                    const methods = e.target.checked
                      ? [...settings.paymentMethods, method.key]
                      : settings.paymentMethods.filter(m => m !== method.key);
                    handleSettingChange('paymentMethods', methods);
                  }}
                  className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{method.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBungalowSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Bungalov Ayarları</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maksimum Kapasite
            </label>
            <input
              type="number"
              value={settings.maxOccupancy}
              onChange={(e) => handleSettingChange('maxOccupancy', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temizlik Bedeli (₺)
            </label>
            <input
              type="number"
              value={settings.cleaningFee}
              onChange={(e) => handleSettingChange('cleaningFee', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giriş Saati
            </label>
            <input
              type="time"
              value={settings.checkInTime}
              onChange={(e) => handleSettingChange('checkInTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Çıkış Saati
            </label>
            <input
              type="time"
              value={settings.checkOutTime}
              onChange={(e) => handleSettingChange('checkOutTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPricingRulesSettings = () => (
    <div className="space-y-6">
      {/* Minimum Konaklama Süresi */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Minimum Konaklama Süresi</h4>
            <p className="text-sm text-gray-600">Rezervasyon için minimum gece sayısı</p>
          </div>
            <button
              onClick={() => handleSettingChange('minimumStay', {
                ...settings.minimumStay,
                enabled: !settings.minimumStay.enabled
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.minimumStay.enabled ? 'bg-gray-900' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.minimumStay.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {settings.minimumStay.enabled && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Konaklama Süresi (gece)
              </label>
              <input
                type="number"
                min="1"
                value={settings.minimumStay.value}
                onChange={(e) => handleSettingChange('minimumStay', {
                  ...settings.minimumStay,
                  value: parseInt(e.target.value)
                })}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Müşteriler en az {settings.minimumStay.value} gece rezervasyon yapabilir
              </p>
            </div>
          )}
        </div>

      {/* Hafta Sonu Fiyatlandırması */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Hafta Sonu Fiyat </h4>
            <p className="text-sm text-gray-600">Cumartesi ve Pazar günleri için fiyat uygula</p>
          </div>
            <button
              onClick={() => handleSettingChange('weekendPricing', {
                ...settings.weekendPricing,
                enabled: !settings.weekendPricing.enabled
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.weekendPricing.enabled ? 'bg-gray-900' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.weekendPricing.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {settings.weekendPricing.enabled && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat Türü
                  </label>
                  <select
                    value={settings.weekendPricing.type}
                    onChange={(e) => handleSettingChange('weekendPricing', {
                      ...settings.weekendPricing,
                      type: e.target.value
                    })}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="percentage">Yüzde (%)</option>
                    <option value="amount">Sabit Tutar (₺)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İşlem Türü
                  </label>
                  <select
                    value={settings.weekendPricing.value >= 0 ? 'increase' : 'decrease'}
                    onChange={(e) => {
                      const isIncrease = e.target.value === 'increase';
                      const currentValue = Math.abs(settings.weekendPricing.value);
                      handleSettingChange('weekendPricing', {
                        ...settings.weekendPricing,
                        value: isIncrease ? currentValue : -currentValue
                      });
                    }}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="increase">Artış</option>
                    <option value="decrease">İndirim</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {settings.weekendPricing.type === 'percentage' ? 'Yüzde (%)' : 'Tutar (₺)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={Math.abs(settings.weekendPricing.value)}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      const isIncrease = settings.weekendPricing.value >= 0;
                      handleSettingChange('weekendPricing', {
                        ...settings.weekendPricing,
                        value: isIncrease ? newValue : -newValue
                      });
                    }}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white rounded-md border border-gray-200">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Sonuç:</span> Hafta sonları 
                  {settings.weekendPricing.value >= 0 ? (
                    <span className="text-green-600 font-medium"> %{Math.abs(settings.weekendPricing.value)} artış</span>
                  ) : (
                    <span className="text-blue-600 font-medium"> %{Math.abs(settings.weekendPricing.value)} indirim</span>
                  )}
                  {settings.weekendPricing.type === 'percentage' ? ' uygulanacak' : ' tutarında işlem yapılacak'}
                </p>
              </div>
            </div>
          )}
        </div>
      

      {/* Sezon Bazlı Fiyatlandırma */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Sezon Bazlı Fiyat</h4>
            <p className="text-sm text-gray-600">Mevsimlere göre fiyat uygula</p>
          </div>
            <button
              onClick={() => handleSettingChange('seasonalPricing', {
                ...settings.seasonalPricing,
                enabled: !settings.seasonalPricing.enabled
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.seasonalPricing.enabled ? 'bg-gray-900' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.seasonalPricing.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {settings.seasonalPricing.enabled && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="space-y-4">
                {settings.seasonalPricing.seasons.map((season, index) => (
                  <div key={season.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mevsim Adı
                        </label>
                        <input
                          type="text"
                          value={season.name}
                          onChange={(e) => {
                            const newSeasons = [...settings.seasonalPricing.seasons];
                            newSeasons[index].name = e.target.value;
                            handleSettingChange('seasonalPricing', {
                              ...settings.seasonalPricing,
                              seasons: newSeasons
                            });
                          }}
                          className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          placeholder="Örn: Yaz"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          İşlem Türü
                        </label>
                        <select
                          value={season.value >= 0 ? 'increase' : 'decrease'}
                          onChange={(e) => {
                            const isIncrease = e.target.value === 'increase';
                            const currentValue = Math.abs(season.value);
                            const newSeasons = [...settings.seasonalPricing.seasons];
                            newSeasons[index].value = isIncrease ? currentValue : -currentValue;
                            handleSettingChange('seasonalPricing', {
                              ...settings.seasonalPricing,
                              seasons: newSeasons
                            });
                          }}
                          className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        >
                          <option value="increase">Artış</option>
                          <option value="decrease">İndirim</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Yüzde (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="200"
                          value={Math.abs(season.value)}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value) || 0;
                            const isIncrease = season.value >= 0;
                            const newSeasons = [...settings.seasonalPricing.seasons];
                            newSeasons[index].value = isIncrease ? newValue : -newValue;
                            handleSettingChange('seasonalPricing', {
                              ...settings.seasonalPricing,
                              seasons: newSeasons
                            });
                          }}
                          className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <button
                          onClick={() => {
                            const newSeasons = settings.seasonalPricing.seasons.filter((_, i) => i !== index);
                            handleSettingChange('seasonalPricing', {
                              ...settings.seasonalPricing,
                              seasons: newSeasons
                            });
                          }}
                          className="w-full h-10 px-3 py-2 border border-red-300 text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors rounded-md"
                        >
                          <TrashIcon className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Sonuç:</span> {season.name} mevsiminde 
                        {season.value >= 0 ? (
                          <span className="text-green-600 font-medium"> %{Math.abs(season.value)} artış</span>
                        ) : (
                          <span className="text-blue-600 font-medium"> %{Math.abs(season.value)} indirim</span>
                        )}
                        uygulanacak
                      </p>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    const newId = Math.max(...settings.seasonalPricing.seasons.map(s => s.id), 0) + 1;
                    const newSeasons = [
                      ...settings.seasonalPricing.seasons,
                      { id: newId, name: '', type: 'percentage', value: 0, months: [] }
                    ];
                    handleSettingChange('seasonalPricing', {
                      ...settings.seasonalPricing,
                      seasons: newSeasons
                    });
                  }}
                  className="w-full h-10 px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors rounded-md flex items-center justify-center"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Yeni Mevsim Ekle
                </button>
              </div>
            </div>
          )}
        </div>

      {/* Ay Bazlı Fiyatlandırma */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Ay Bazlı Fiyat</h4>
            <p className="text-sm text-gray-600">Aylara göre fiyat uygula</p>
          </div>
          <button
            onClick={() => handleSettingChange('monthlyPricing', {
              ...settings.monthlyPricing,
              enabled: !settings.monthlyPricing.enabled
            })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
              settings.monthlyPricing.enabled ? 'bg-gray-900' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.monthlyPricing.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {settings.monthlyPricing.enabled && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="space-y-4">
              {settings.monthlyPricing.months.map((monthData, index) => (
                <div key={monthData.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ay Seçimi
                      </label>
                      <select
                        value={monthData.month}
                        onChange={(e) => {
                          const selectedMonth = parseInt(e.target.value);
                          const monthNames = [
                            '', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
                          ];
                          const newMonths = [...settings.monthlyPricing.months];
                          newMonths[index].month = selectedMonth;
                          newMonths[index].name = monthNames[selectedMonth];
                          handleSettingChange('monthlyPricing', {
                            ...settings.monthlyPricing,
                            months: newMonths
                          });
                        }}
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      >
                        <option value="">Ay Seçin</option>
                        <option value="1">Ocak</option>
                        <option value="2">Şubat</option>
                        <option value="3">Mart</option>
                        <option value="4">Nisan</option>
                        <option value="5">Mayıs</option>
                        <option value="6">Haziran</option>
                        <option value="7">Temmuz</option>
                        <option value="8">Ağustos</option>
                        <option value="9">Eylül</option>
                        <option value="10">Ekim</option>
                        <option value="11">Kasım</option>
                        <option value="12">Aralık</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İşlem Türü
                      </label>
                      <select
                        value={monthData.value >= 0 ? 'increase' : 'decrease'}
                        onChange={(e) => {
                          const isIncrease = e.target.value === 'increase';
                          const currentValue = Math.abs(monthData.value);
                          const newMonths = [...settings.monthlyPricing.months];
                          newMonths[index].value = isIncrease ? currentValue : -currentValue;
                          handleSettingChange('monthlyPricing', {
                            ...settings.monthlyPricing,
                            months: newMonths
                          });
                        }}
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      >
                        <option value="increase">Artış</option>
                        <option value="decrease">İndirim</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Yüzde (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={Math.abs(monthData.value)}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value) || 0;
                          const isIncrease = monthData.value >= 0;
                          const newMonths = [...settings.monthlyPricing.months];
                          newMonths[index].value = isIncrease ? newValue : -newValue;
                          handleSettingChange('monthlyPricing', {
                            ...settings.monthlyPricing,
                            months: newMonths
                          });
                        }}
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          const newMonths = settings.monthlyPricing.months.filter((_, i) => i !== index);
                          handleSettingChange('monthlyPricing', {
                            ...settings.monthlyPricing,
                            months: newMonths
                          });
                        }}
                        className="w-full h-10 px-3 py-2 border border-red-300 text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors rounded-md"
                      >
                        <TrashIcon className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                  
                  {monthData.name && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Sonuç:</span> {monthData.name} ayında 
                        {monthData.value >= 0 ? (
                          <span className="text-green-600 font-medium"> %{Math.abs(monthData.value)} artış</span>
                        ) : (
                          <span className="text-blue-600 font-medium"> %{Math.abs(monthData.value)} indirim</span>
                        )}
                        uygulanacak
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              <button
                onClick={() => {
                  const newId = Math.max(...settings.monthlyPricing.months.map(m => m.id), 0) + 1;
                  const newMonths = [
                    ...settings.monthlyPricing.months,
                    { id: newId, month: '', name: '', type: 'percentage', value: 0 }
                  ];
                  handleSettingChange('monthlyPricing', {
                    ...settings.monthlyPricing,
                    months: newMonths
                  });
                }}
                className="w-full h-10 px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors rounded-md flex items-center justify-center"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Yeni Ay Ekle
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Özel Günler */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Özel Gün Fiyatlandırması</h4>
            <p className="text-sm text-gray-600">Belirli günler için özel fiyat uygula</p>
          </div>
            <button
              onClick={() => handleSettingChange('specialDates', {
                ...settings.specialDates,
                enabled: !settings.specialDates.enabled
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.specialDates.enabled ? 'bg-gray-900' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.specialDates.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {settings.specialDates.enabled && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Özel Günler Listesi</h4>
                <button
                  onClick={() => {
                    const newId = Math.max(...settings.specialDates.dates.map(d => d.id), 0) + 1;
                    handleSettingChange('specialDates', {
                      ...settings.specialDates,
                      dates: [
                        ...settings.specialDates.dates,
                        { id: newId, name: '', startDate: '', endDate: '', type: 'percentage', value: 0 }
                      ]
                    });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Yeni Özel Gün
                </button>
              </div>
              
              <div className="space-y-3">
                {settings.specialDates.dates.map((specialDate, index) => (
                  <div key={specialDate.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gün Adı
                        </label>
                        <input
                          type="text"
                          value={specialDate.name}
                          onChange={(e) => {
                            const newSpecialDates = { ...settings.specialDates };
                            newSpecialDates.dates[index].name = e.target.value;
                            handleSettingChange('specialDates', newSpecialDates);
                          }}
                          className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          placeholder="Örn: Sevgililer Günü"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Başlangıç Tarihi
                        </label>
                        <input
                          type="date"
                          value={specialDate.startDate}
                          onChange={(e) => {
                            const newSpecialDates = { ...settings.specialDates };
                            newSpecialDates.dates[index].startDate = e.target.value;
                            handleSettingChange('specialDates', newSpecialDates);
                          }}
                          className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bitiş Tarihi
                        </label>
                        <input
                          type="date"
                          value={specialDate.endDate}
                          onChange={(e) => {
                            const newSpecialDates = { ...settings.specialDates };
                            newSpecialDates.dates[index].endDate = e.target.value;
                            handleSettingChange('specialDates', newSpecialDates);
                          }}
                          className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          İşlem Türü
                        </label>
                        <select
                          value={specialDate.value >= 0 ? 'increase' : 'decrease'}
                          onChange={(e) => {
                            const isIncrease = e.target.value === 'increase';
                            const currentValue = Math.abs(specialDate.value);
                            const newSpecialDates = { ...settings.specialDates };
                            newSpecialDates.dates[index].value = isIncrease ? currentValue : -currentValue;
                            handleSettingChange('specialDates', newSpecialDates);
                          }}
                          className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        >
                          <option value="increase">Artış</option>
                          <option value="decrease">İndirim</option>
                        </select>
                      </div>
                      
                      <div className="flex items-end space-x-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {specialDate.type === 'percentage' ? 'Yüzde (%)' : 'Tutar (₺)'}
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={Math.abs(specialDate.value)}
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value) || 0;
                              const isIncrease = specialDate.value >= 0;
                              const newSpecialDates = { ...settings.specialDates };
                              newSpecialDates.dates[index].value = isIncrease ? newValue : -newValue;
                              handleSettingChange('specialDates', newSpecialDates);
                            }}
                            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          />
                        </div>
                        
                        <button
                          onClick={() => {
                            const newSpecialDates = { ...settings.specialDates };
                            newSpecialDates.dates = newSpecialDates.dates.filter((_, i) => i !== index);
                            handleSettingChange('specialDates', newSpecialDates);
                          }}
                          className="h-10 px-3 py-2 border border-red-300 text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors rounded-md"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Sonuç:</span> {specialDate.name} 
                        {specialDate.startDate && specialDate.endDate && (
                          <span> ({specialDate.startDate} - {specialDate.endDate})</span>
                        )}
                        {' '}tarihlerinde 
                        {specialDate.value >= 0 ? (
                          <span className="text-green-600 font-medium"> %{Math.abs(specialDate.value)} artış</span>
                        ) : (
                          <span className="text-blue-600 font-medium"> %{Math.abs(specialDate.value)} indirim</span>
                        )}
                        uygulanacak
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Sistem Ayarları</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Bakım Modu</h4>
              <p className="text-sm text-gray-600">Sistemi bakım moduna al</p>
            </div>
            <button
              onClick={() => handleSettingChange('maintenanceMode', !settings.maintenanceMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.maintenanceMode ? 'bg-gray-900' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yedekleme Sıklığı
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="daily">Günlük</option>
                <option value="weekly">Haftalık</option>
                <option value="monthly">Aylık</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Log Saklama Süresi (gün)
              </label>
              <input
                type="number"
                value={settings.logRetention}
                onChange={(e) => handleSettingChange('logRetention', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'genel':
        return renderGeneralSettings();
      case 'bildirimler':
        return renderNotificationSettings();
      case 'guvenlik':
        return renderSecuritySettings();
      case 'rezervasyon':
        return renderReservationSettings();
      case 'odeme':
        return renderPaymentSettings();
      case 'bungalov':
        return renderBungalowSettings();
      case 'fiyat-kurallari':
        return renderPricingRulesSettings();
      case 'sistem':
        return renderSystemSettings();
      default:
        return renderGeneralSettings();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Ayarlar yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
          <p className="text-gray-600 mt-1">Sistem ayarlarını yönetin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.name} Ayarları
                </h2>
                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                    saving || loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Kaydet
                    </>
                  )}
                </button>
              </div>
              
              {renderTabContent()}
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  };


export default Settings;
