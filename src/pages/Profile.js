import React, { useState } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  CalendarIcon,
  ShieldCheckIcon,
  KeyIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('genel');
  const [isEditing, setIsEditing] = useState(false);
  
  // Log filtreleme state'leri
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [logLevelFilter, setLogLevelFilter] = useState('');
  const [logDateFilter, setLogDateFilter] = useState('');
  const [logCurrentPage, setLogCurrentPage] = useState(1);
  const logItemsPerPage = 5;
  const [profile, setProfile] = useState({
    // Genel Bilgiler
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet.yilmaz@bungalovapp.com',
    phone: '+90 555 123 45 67',
    position: 'Sistem Yöneticisi',
    department: 'Bilgi İşlem',
    employeeId: 'EMP-001',
    hireDate: '2024-01-15',
    
    // Kişisel Bilgiler
    birthDate: '1985-06-20',
    address: 'Antalya, Türkiye',
    emergencyContact: '+90 555 987 65 43',
    emergencyName: 'Ayşe Yılmaz',
    
    // Güvenlik
    lastLogin: '2024-12-19 14:30',
    loginCount: 156,
    twoFactorEnabled: true,
    passwordLastChanged: '2024-11-15'
  });

  const [formData, setFormData] = useState({ ...profile });

  // Demo log verileri
  const logs = [
    {
      id: 1,
      timestamp: '2024-12-19 14:30:25',
      level: 'INFO',
      action: 'Giriş yapıldı',
      details: 'Kullanıcı sisteme başarıyla giriş yaptı',
      ipAddress: '192.168.1.100'
    },
    {
      id: 2,
      timestamp: '2024-12-19 14:25:10',
      level: 'SUCCESS',
      action: 'Profil güncellendi',
      details: 'Kişisel bilgiler başarıyla güncellendi',
      ipAddress: '192.168.1.100'
    },
    {
      id: 3,
      timestamp: '2024-12-19 14:20:45',
      level: 'WARNING',
      action: 'Şifre değiştirme denemesi',
      details: 'Yanlış mevcut şifre girildi',
      ipAddress: '192.168.1.100'
    },
    {
      id: 4,
      timestamp: '2024-12-19 14:15:30',
      level: 'SUCCESS',
      action: 'Şifre değiştirildi',
      details: 'Kullanıcı şifresini başarıyla değiştirdi',
      ipAddress: '192.168.1.100'
    },
    {
      id: 5,
      timestamp: '2024-12-19 14:10:15',
      level: 'INFO',
      action: 'Profil görüntülendi',
      details: 'Kullanıcı profil sayfasını ziyaret etti',
      ipAddress: '192.168.1.100'
    },
    {
      id: 6,
      timestamp: '2024-12-19 14:05:00',
      level: 'ERROR',
      action: 'Giriş başarısız',
      details: 'Yanlış şifre ile giriş denemesi',
      ipAddress: '192.168.1.100'
    },
    {
      id: 7,
      timestamp: '2024-12-19 14:00:30',
      level: 'INFO',
      action: 'Çıkış yapıldı',
      details: 'Kullanıcı sistemden çıkış yaptı',
      ipAddress: '192.168.1.100'
    },
    {
      id: 8,
      timestamp: '2024-12-19 13:55:20',
      level: 'SUCCESS',
      action: 'İki faktörlü kimlik doğrulama aktif edildi',
      details: '2FA başarıyla etkinleştirildi',
      ipAddress: '192.168.1.100'
    },
    {
      id: 9,
      timestamp: '2024-12-19 13:50:10',
      level: 'INFO',
      action: 'Güvenlik ayarları görüntülendi',
      details: 'Kullanıcı güvenlik sekmesini ziyaret etti',
      ipAddress: '192.168.1.100'
    },
    {
      id: 10,
      timestamp: '2024-12-19 13:45:45',
      level: 'WARNING',
      action: 'Çoklu giriş denemesi',
      details: 'Aynı IP adresinden 3 başarısız giriş denemesi',
      ipAddress: '192.168.1.100'
    },
    {
      id: 11,
      timestamp: '2024-12-19 13:40:30',
      level: 'SUCCESS',
      action: 'Rezervasyon oluşturuldu',
      details: 'Yeni rezervasyon başarıyla oluşturuldu - RES-2025-016',
      ipAddress: '192.168.1.100'
    },
    {
      id: 12,
      timestamp: '2024-12-19 13:35:15',
      level: 'INFO',
      action: 'Müşteri bilgileri görüntülendi',
      details: 'Müşteri detay sayfası ziyaret edildi',
      ipAddress: '192.168.1.100'
    },
    {
      id: 13,
      timestamp: '2024-12-19 13:30:00',
      level: 'SUCCESS',
      action: 'Ödeme alındı',
      details: 'Rezervasyon ödemesi başarıyla alındı - 2,500 TL',
      ipAddress: '192.168.1.100'
    },
    {
      id: 14,
      timestamp: '2024-12-19 13:25:45',
      level: 'WARNING',
      action: 'Rezervasyon iptal edildi',
      details: 'Müşteri talebi üzerine rezervasyon iptal edildi',
      ipAddress: '192.168.1.100'
    },
    {
      id: 15,
      timestamp: '2024-12-19 13:20:30',
      level: 'INFO',
      action: 'Rapor oluşturuldu',
      details: 'Aylık gelir raporu PDF olarak oluşturuldu',
      ipAddress: '192.168.1.100'
    },
    {
      id: 16,
      timestamp: '2024-12-19 13:15:15',
      level: 'SUCCESS',
      action: 'Bungalov fiyatı güncellendi',
      details: 'Bungalov #5 fiyatı 3,000 TL olarak güncellendi',
      ipAddress: '192.168.1.100'
    },
    {
      id: 17,
      timestamp: '2024-12-19 13:10:00',
      level: 'ERROR',
      action: 'E-posta gönderimi başarısız',
      details: 'Rezervasyon onay e-postası gönderilemedi',
      ipAddress: '192.168.1.100'
    },
    {
      id: 18,
      timestamp: '2024-12-19 13:05:45',
      level: 'INFO',
      action: 'Sistem yedeklemesi',
      details: 'Günlük veritabanı yedeklemesi başlatıldı',
      ipAddress: '127.0.0.1'
    },
    {
      id: 19,
      timestamp: '2024-12-19 13:00:30',
      level: 'SUCCESS',
      action: 'Müşteri eklendi',
      details: 'Yeni müşteri kaydı oluşturuldu - ID: 12347',
      ipAddress: '192.168.1.100'
    },
    {
      id: 20,
      timestamp: '2024-12-19 12:55:15',
      level: 'WARNING',
      action: 'Düşük stok uyarısı',
      details: 'Bungalov #2 için stok seviyesi düşük',
      ipAddress: '192.168.1.100'
    }
  ];

  const tabs = [
    { id: 'genel', name: 'Genel Bilgiler', icon: UserIcon },
    { id: 'kisisel', name: 'Kişisel Bilgiler', icon: UserIcon },
    { id: 'guvenlik', name: 'Güvenlik', icon: ShieldCheckIcon },
    { id: 'sifre', name: 'Şifre Değiştir', icon: KeyIcon },
    { id: 'logs', name: 'İşlem Geçmişi', icon: ClipboardDocumentListIcon }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setProfile({ ...formData });
    setIsEditing(false);
    // Başarı mesajı gösterilebilir
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
  };

  // Log filtreleme
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(logSearchTerm.toLowerCase());
    const matchesLevel = !logLevelFilter || log.level === logLevelFilter;
    const matchesDate = !logDateFilter || log.timestamp.startsWith(logDateFilter);
    
    return matchesSearch && matchesLevel && matchesDate;
  });

  // Log sayfalama
  const logTotalPages = Math.ceil(filteredLogs.length / logItemsPerPage);
  const logStartIndex = (logCurrentPage - 1) * logItemsPerPage;
  const logEndIndex = logStartIndex + logItemsPerPage;
  const currentLogs = filteredLogs.slice(logStartIndex, logEndIndex);

  // Log seviyesi badge'leri
  const getLogLevelBadge = (level) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (level) {
      case 'INFO':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'SUCCESS':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'WARNING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'ERROR':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Log seviyesi Türkçe açıklamaları
  const getLogLevelText = (level) => {
    switch (level) {
      case 'INFO':
        return 'Bilgi';
      case 'SUCCESS':
        return 'Başarılı';
      case 'WARNING':
        return 'Uyarı';
      case 'ERROR':
        return 'Hata';
      default:
        return 'Bilinmiyor';
    }
  };

  // Log seviyesi ikonları
  const getLogLevelIcon = (level) => {
    switch (level) {
      case 'INFO':
        return <InformationCircleIcon className="w-4 h-4" />;
      case 'SUCCESS':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'WARNING':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'ERROR':
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <InformationCircleIcon className="w-4 h-4" />;
    }
  };

  // Log sayfa değiştirme
  const handleLogPageChange = (page) => {
    setLogCurrentPage(page);
  };

  const handleLogPreviousPage = () => {
    if (logCurrentPage > 1) {
      setLogCurrentPage(logCurrentPage - 1);
    }
  };

  const handleLogNextPage = () => {
    if (logCurrentPage < logTotalPages) {
      setLogCurrentPage(logCurrentPage + 1);
    }
  };

  // Log sayfa numaraları
  const getLogPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (logTotalPages <= maxVisiblePages) {
      for (let i = 1; i <= logTotalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, logCurrentPage - 2);
      const endPage = Math.min(logTotalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < logTotalPages) {
        if (endPage < logTotalPages - 1) {
          pages.push('...');
        }
        pages.push(logTotalPages);
      }
    }
    
    return pages;
  };

  const renderGeneralInfo = () => (
    <div className="space-y-6">
      {/* Temel Bilgiler */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Adınızı girin"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Soyad
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Soyadınızı girin"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.lastName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pozisyon
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Pozisyonunuzu girin"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.position}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departman
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Departmanınızı girin"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.department}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Çalışan ID
            </label>
            <p className="text-gray-900 py-2">{profile.employeeId}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İşe Başlama Tarihi
            </label>
            {isEditing ? (
              <input
                type="date"
                value={formData.hireDate}
                onChange={(e) => handleInputChange('hireDate', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 py-2">{new Date(profile.hireDate).toLocaleDateString('tr-TR')}</p>
            )}
          </div>
        </div>
      </div>

      {/* İletişim Bilgileri */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <EnvelopeIcon className="w-4 h-4 inline mr-2" />
              E-posta
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="E-posta adresinizi girin"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <PhoneIcon className="w-4 h-4 inline mr-2" />
              Telefon
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Telefon numaranızı girin"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.phone}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kişisel Bilgiler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="w-4 h-4 inline mr-2" />
              Doğum Tarihi
            </label>
            {isEditing ? (
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 py-2">{new Date(profile.birthDate).toLocaleDateString('tr-TR')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPinIcon className="w-4 h-4 inline mr-2" />
              Adres
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Adresinizi girin"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.address}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acil Durum Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <UserIcon className="w-4 h-4 inline mr-2" />
              Acil Durum Kişisi
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.emergencyName}
                onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Acil durum kişisinin adını girin"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.emergencyName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <PhoneIcon className="w-4 h-4 inline mr-2" />
              Acil Durum İletişim
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Acil durum telefon numarasını girin"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.emergencyContact}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityInfo = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Güvenlik Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Son Giriş
            </label>
            <p className="text-gray-900 py-2">{new Date(profile.lastLogin).toLocaleString('tr-TR')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Toplam Giriş Sayısı
            </label>
            <p className="text-gray-900 py-2">{profile.loginCount}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İki Faktörlü Kimlik Doğrulama
            </label>
            <div className="flex items-center py-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                profile.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {profile.twoFactorEnabled ? 'Aktif' : 'Pasif'}
              </span>
              {isEditing && (
                <button className="ml-2 text-sm text-gray-600 hover:text-gray-800">
                  Değiştir
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifre Son Değişiklik
            </label>
            <p className="text-gray-900 py-2">{new Date(profile.passwordLastChanged).toLocaleDateString('tr-TR')}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPasswordChange = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Şifre Değiştir</h3>
        <div className="max-w-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mevcut Şifre
              </label>
              <input
                type="password"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Mevcut şifrenizi girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yeni Şifre
              </label>
              <input
                type="password"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Yeni şifrenizi girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifre Tekrar
              </label>
              <input
                type="password"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Yeni şifrenizi tekrar girin"
              />
            </div>

            <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
              Şifreyi Güncelle
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogsInfo = () => (
    <div className="space-y-6">
      {/* Filtreleme Alanı */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <FunnelIcon className="w-5 h-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Filtreleme</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Arama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arama
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={logSearchTerm}
                onChange={(e) => setLogSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="İşlem veya detay ara..."
              />
            </div>
          </div>

          {/* Durum */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durum
            </label>
            <select
              value={logLevelFilter}
              onChange={(e) => setLogLevelFilter(e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="">Tüm Durumlar</option>
              <option value="INFO">Bilgi</option>
              <option value="SUCCESS">Başarılı</option>
              <option value="WARNING">Uyarı</option>
              <option value="ERROR">Hata</option>
            </select>
          </div>

          {/* Tarih */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarih
            </label>
            <input
              type="date"
              value={logDateFilter}
              onChange={(e) => setLogDateFilter(e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* İşlem Geçmişi Listesi */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">İşlem Geçmişi</h3>
          <div className="text-sm text-gray-500">
            Toplam: {filteredLogs.length} işlem (Sayfa {logCurrentPage}/{logTotalPages})
          </div>
        </div>

        {/* İşlem Kartları */}
        <div className="space-y-3">
          {currentLogs.map((log) => (
            <div key={log.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={getLogLevelBadge(log.level)}>
                      <div className="flex items-center">
                        {getLogLevelIcon(log.level)}
                        <span className="ml-1">{getLogLevelText(log.level)}</span>
                      </div>
                    </span>
                    <h4 className="text-sm font-medium text-gray-900">{log.action}</h4>
                    <span className="text-xs text-gray-500">{log.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>IP: {log.ipAddress}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sayfalama */}
        {logTotalPages > 1 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{logStartIndex + 1}</span>
                {' '}-{' '}
                <span className="font-medium">{Math.min(logEndIndex, filteredLogs.length)}</span>
                {' '}arası, toplam{' '}
                <span className="font-medium">{filteredLogs.length}</span>
                {' '}işlem
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLogPreviousPage}
                  disabled={logCurrentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Önceki
                </button>
                
                <div className="flex items-center space-x-1">
                  {getLogPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && handleLogPageChange(page)}
                      disabled={page === '...'}
                      className={`px-3 py-1 text-sm border rounded-md ${
                        page === logCurrentPage
                          ? 'bg-gray-900 border-gray-900 text-white'
                          : page === '...'
                          ? 'border-gray-300 bg-white text-gray-700 cursor-default'
                          : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleLogNextPage}
                  disabled={logCurrentPage === logTotalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sonraki
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'genel':
        return renderGeneralInfo();
      case 'kisisel':
        return renderPersonalInfo();
      case 'guvenlik':
        return renderSecurityInfo();
      case 'sifre':
        return renderPasswordChange();
      case 'logs':
        return renderLogsInfo();
      default:
        return renderGeneralInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
              <p className="text-gray-600 mt-1">Kişisel bilgilerinizi yönetin</p>
            </div>
            
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <XMarkIcon className="w-4 h-4 mr-2" />
                    İptal
                  </button>
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Kaydet
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Düzenle
                </button>
              )}
            </div>
          </div>
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
                  {tabs.find(tab => tab.id === activeTab)?.name}
                </h2>
              </div>
              
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
