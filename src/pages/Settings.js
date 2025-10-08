import React, { useState, useEffect } from 'react';
import { 
  GlobeAltIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  BellIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon,
  CircleStackIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  BoldIcon,
  ItalicIcon,
  ListBulletIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { loadDemoData, hasData, customerService, bungalowService, reservationService } from '../data/data';
import { clearAllData } from '../data/localStorage';
import ConfirmModal from '../components/ConfirmModal';
import MDEditor from '@uiw/react-md-editor';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('firma');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Helper function to safely access nested properties
  const safeGet = (obj, path, defaultValue = null) => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
  };

  
  // Modal state'leri
  const [showLoadDemoModal, setShowLoadDemoModal] = useState(false);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [showClearDemoModal, setShowClearDemoModal] = useState(false);
  
  // Accordion state'leri
  const [accordionOpen, setAccordionOpen] = useState({
    cancellation: false,
    usage: false,
    rental: false,
    privacy: false,
    kvkk: false
  });
  const [settings, setSettings] = useState({
    
    // Firma Bilgileri
    companyInfo: {
      logo: '',
      companyType: 'sahis', // 'sahis' veya 'limited'
      companyName: '',
      tradeName: '',
      taxOffice: '',
      taxNumber: '',
      phone: '',
      email: '',
      address: '',
      authorizedPerson: '',
      iban: '',
      bankName: '',
      accountNumber: '',
      googleBusinessUrl: '' // Google Business Profil URL'i
    },
    
    // Rezervasyon Ayarları
    depositRule: {
      enabled: true,
      amount: 500
    },
    defaultCheckInTime: '14:00',
    defaultCheckOutTime: '11:00',
    minimumStayRule: {
      enabled: true,
      days: 1
    },
    cancellationRule: {
      enabled: true,
      daysBeforeCheckIn: 1
    },
    
    // Ek Hizmetler
    services: [
      {
        id: 1,
        name: 'Kahvaltı',
        description: 'Sabah kahvaltı hizmeti',
        price: 0,
        enabled: false,
        type: 'per_person' // 'per_person' veya 'per_night'
      }
    ],
    
    // Sistem Ayarları
    maintenanceMode: false,
    backupFrequency: 'daily',
    logRetention: 30,
    
    // Fiyat Kuralları
    weekendPricing: {
      enabled: true,
      type: 'percentage', // 'amount' or 'percentage'
      value: 20 // 20% or 200 TL
    },
    earlyBirdDiscount: {
      enabled: false,
      percentage: 5,
      daysBefore: 30
    },
    lastMinuteDiscount: {
      enabled: false,
      percentage: 10,
      daysBefore: 7
    },
    
    // Bildirim ve İletişim Ayarları
    notifications: {
      newReservation: { enabled: false, email: true, whatsapp: false },
      cancellation: { enabled: false, email: true, whatsapp: false },
      postponement: { enabled: false, email: true, whatsapp: false },
      experienceMessage: { enabled: false, email: true, whatsapp: false }
    },
    emailTemplates: {
      enabled: false,
      reservationConfirmation: {
        enabled: false,
        subject: 'Rezervasyon Onayı - {reservationCode}',
        template: 'Sayın {customerName},\n\nRezervasyonunuz onaylanmıştır.\n\nRezervasyon Detayları:\n- Rezervasyon Kodu: {reservationCode}\n- Bungalov: {bungalowName}\n- Giriş: {checkInDate}\n- Çıkış: {checkOutDate}\n- Toplam Tutar: {totalPrice}\n\nİyi günler dileriz.'
      },
      reminderMessage: {
        enabled: false,
        subject: 'Rezervasyon Hatırlatması - {reservationCode}',
        template: 'Sayın {customerName},\n\nRezervasyonunuzu hatırlatmak isteriz.\n\nRezervasyon Detayları:\n- Rezervasyon Kodu: {reservationCode}\n- Bungalov: {bungalowName}\n- Giriş: {checkInDate}\n- Çıkış: {checkOutDate}\n\nİyi günler dileriz.'
      },
      thankYouMessage: {
        enabled: false,
        subject: 'Teşekkür Mesajı - {reservationCode}',
        template: 'Sayın {customerName},\n\nRezervasyonunuz için teşekkür ederiz.\n\nRezervasyon Detayları:\n- Rezervasyon Kodu: {reservationCode}\n- Bungalov: {bungalowName}\n- Giriş: {checkInDate}\n- Çıkış: {checkOutDate}\n\nTekrar görüşmek üzere!'
      },
      experienceMessage: {
        enabled: false,
        subject: 'Deneyim Mesajı ve Puanlama - {reservationCode}',
        template: 'Sayın {customerName},\n\nKonaklamanızın nasıl geçtiğini merak ediyoruz.\n\nLütfen deneyiminizi bizimle paylaşın ve Google\'da yorum yapın:\n- Rezervasyon Kodu: {reservationCode}\n- Bungalov: {bungalowName}\n- Giriş: {checkInDate}\n- Çıkış: {checkOutDate}\n\nGoogle\'da Yorum Yapın: {googleBusinessUrl}\n\nGörüşleriniz bizim için çok değerli!'
      }
    },
    smtpSettings: {
      enabled: false,
      host: '',
      port: 587,
      secure: false,
      username: '',
      password: '',
      fromEmail: '',
      fromName: ''
    },
    smsProvider: {
      enabled: false,
      provider: 'netgsm', // 'netgsm', 'iletimerkezi', 'verimor'
      apiKey: '',
      senderName: 'BungApp'
    },
    whatsappTemplates: {
      enabled: false,
      reservationConfirmation: {
        enabled: false,
        message: 'Sayın {customerName}, rezervasyonunuz onaylanmıştır. Rezervasyon Kodu: {reservationCode}'
      },
      reminderMessage: {
        enabled: false,
        message: 'Sayın {customerName}, rezervasyonunuzu hatırlatmak isteriz. Giriş: {checkInDate}'
      },
      thankYouMessage: {
        enabled: false,
        message: 'Sayın {customerName}, rezervasyonunuz için teşekkür ederiz. İyi günler!'
      },
      experienceMessage: {
        enabled: false,
        message: 'Sayın {customerName}, konaklamanızın nasıl geçtiğini merak ediyoruz. Google\'da yorum yapın: {googleBusinessUrl}'
      }
    },
    whatsappIntegration: {
      enabled: true,
      phoneNumber: '',
      businessName: 'BungApp',
      welcomeMessage: 'Merhaba! Rezervasyonunuz hakkında bilgi almak için buradayız.',
      confirmationMessage: 'Rezervasyonunuzu onaylamak için aşağıdaki linke tıklayın: {confirmationLink}'
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
    },
    
    // Şartlar ve Kurallar
    termsAndConditions: {
      cancellationTerms: '<h3>İptal ve İade Koşulları</h3><ul><li>Rezervasyon giriş tarihinden <strong>24 saat öncesine kadar</strong> ücretsiz iptal edilebilir.</li><li>24 saatten kısa süre kala yapılan iptallerde <strong>%50 iade</strong> yapılır.</li><li>Giriş yapıldıktan sonra iptal edilemez.</li><li>Doğal afet, salgın hastalık gibi mücbir sebep durumlarında özel koşullar uygulanır.</li></ul>',
      usageTerms: '<h3>Kullanım Koşulları</h3><ul><li>Bungalov kullanımı sadece rezervasyon sahibi ve belirtilen kişi sayısı ile sınırlıdır.</li><li><strong>Gürültü yapmak, rahatsızlık vermek yasaktır.</strong></li><li><strong>Sigara içmek yasaktır.</strong></li><li>Evcil hayvan getirmek önceden bildirilmelidir.</li><li>Tesis kurallarına uyulması zorunludur.</li></ul>',
      rentalTerms: '<h3>Kiralama Şartları ve Sözleşmesi</h3><ul><li>Minimum konaklama süresi <strong>1 gecedir</strong>.</li><li><strong>Giriş saati:</strong> 14:00, <strong>Çıkış saati:</strong> 11:00</li><li>Kapora ödemesi rezervasyon sırasında alınır.</li><li>Hasarlar için güvenlik depozitosu alınabilir.</li><li>Sözleşme şartları rezervasyon onayı ile kabul edilmiş sayılır.</li><li>Tüm anlaşmazlıklar Türk hukuku çerçevesinde çözülür.</li></ul>',
      privacyPolicy: '<h3>Gizlilik Bildirimi</h3><ul><li>Kişisel verileriniz 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında işlenmektedir.</li><li>Rezervasyon bilgileriniz sadece hizmet sunumu amacıyla kullanılır.</li><li>Verileriniz üçüncü kişilerle paylaşılmaz.</li><li>Veri güvenliği için gerekli teknik ve idari tedbirler alınmıştır.</li><li>Verilerinizin silinmesini talep edebilirsiniz.</li></ul>',
      kvkkText: '<h3>KVKK Aydınlatma Metni</h3><ul><li><strong>Veri Sorumlusu:</strong> [Firma Adı]</li><li><strong>Veri İşleme Amacı:</strong> Rezervasyon hizmeti sunumu</li><li><strong>İşlenen Veriler:</strong> Ad, soyad, telefon, e-posta, kimlik bilgileri</li><li><strong>Veri Saklama Süresi:</strong> Hizmet süresi boyunca</li><li><strong>Veri Güvenliği:</strong> SSL şifreleme ve güvenli sunucular kullanılmaktadır</li><li><strong>Haklarınız:</strong> Bilgi alma, düzeltme, silme, itiraz etme hakkınız bulunmaktadır</li></ul>'
    }
  });

  // Ayarları yükle
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // Frontend-only mode: Load settings from localStorage
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prevSettings => {
          // Deep merge to ensure nested objects are properly merged
          const mergedSettings = {
            ...prevSettings,
            ...parsedSettings,
            // Ensure nested objects are properly merged
            notifications: {
              ...prevSettings.notifications,
              ...parsedSettings.notifications
            },
            emailTemplates: {
              ...prevSettings.emailTemplates,
              ...parsedSettings.emailTemplates
            },
            smtpSettings: {
              ...prevSettings.smtpSettings,
              ...parsedSettings.smtpSettings
            },
            smsProvider: {
              ...prevSettings.smsProvider,
              ...parsedSettings.smsProvider
            },
            whatsappTemplates: {
              ...prevSettings.whatsappTemplates,
              ...parsedSettings.whatsappTemplates
            },
            whatsappIntegration: {
              ...prevSettings.whatsappIntegration,
              ...parsedSettings.whatsappIntegration
            },
            companyInfo: {
              ...prevSettings.companyInfo,
              ...parsedSettings.companyInfo
            },
            termsAndConditions: {
              ...prevSettings.termsAndConditions,
              ...parsedSettings.termsAndConditions
            }
          };
          return mergedSettings;
        });
      }
      // If no saved settings, use default values (already set in useState)
    } catch (error) {
      console.error('Ayarlar yüklenemedi:', error);
      toast.error('Ayarlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Rezervasyon ayarlarını kaydet
  const saveReservationSettings = async () => {
    setSaving(true);
    try {
      // Rezervasyon ayarlarını kaydet
      const currentSettings = { ...settings };
      localStorage.setItem('appSettings', JSON.stringify(currentSettings));
      toast.success('Rezervasyon ayarları başarıyla kaydedildi');
    } catch (error) {
      console.error('Rezervasyon ayarları kaydedilemedi:', error);
      toast.error('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const saveServicesSettings = async () => {
    setSaving(true);
    try {
      // Ek hizmetler ayarlarını kaydet
      const currentSettings = { ...settings };
      localStorage.setItem('appSettings', JSON.stringify(currentSettings));
      toast.success('Ek hizmetler başarıyla kaydedildi');
    } catch (error) {
      console.error('Ek hizmetler kaydedilemedi:', error);
      toast.error('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  // Gelecekte aktif edilecek
  // const savePriceRulesSettings = async () => {
  //   setSaving(true);
  //   try {
  //     // Fiyat kuralları ayarlarını kaydet
  //     const currentSettings = { ...settings };
  //     localStorage.setItem('appSettings', JSON.stringify(currentSettings));
  //     toast.success('Fiyat kuralları başarıyla kaydedildi');
  //   } catch (error) {
  //     console.error('Fiyat kuralları kaydedilemedi:', error);
  //     toast.error('Ayarlar kaydedilirken hata oluştu');
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const saveNotificationSettings = async () => {
    setSaving(true);
    try {
      const currentSettings = { ...settings };
      localStorage.setItem('appSettings', JSON.stringify(currentSettings));
      toast.success('Bildirim ve iletişim ayarları başarıyla kaydedildi');
    } catch (error) {
      console.error('Bildirim ayarları kaydedilemedi:', error);
      toast.error('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const saveTermsAndConditionsSettings = async () => {
    setSaving(true);
    try {
      // Şartlar ve kurallar ayarlarını kaydet
      const currentSettings = { ...settings };
      localStorage.setItem('appSettings', JSON.stringify(currentSettings));
      toast.success('Şartlar ve kurallar başarıyla kaydedildi');
    } catch (error) {
      console.error('Şartlar ve kurallar kaydedilemedi:', error);
      toast.error('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const saveSystemSettings = async () => {
    setSaving(true);
    try {
      // Sistem ayarlarını kaydet
      const currentSettings = { ...settings };
      localStorage.setItem('appSettings', JSON.stringify(currentSettings));
      toast.success('Sistem ayarları başarıyla kaydedildi');
    } catch (error) {
      console.error('Sistem ayarları kaydedilemedi:', error);
      toast.error('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };


  const saveCompanySettings = async () => {
    setSaving(true);
    try {
      // Firma bilgilerini kaydet
      const currentSettings = { ...settings };
      localStorage.setItem('appSettings', JSON.stringify(currentSettings));
      toast.success('Firma bilgileri başarıyla kaydedildi');
    } catch (error) {
      console.error('Firma bilgileri kaydedilemedi:', error);
      toast.error('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  // Aktif tab'a göre kaydetme fonksiyonu
  const handleSave = () => {
    switch (activeTab) {
      case 'firma':
        saveCompanySettings();
        break;
      case 'rezervasyon':
        saveReservationSettings();
        break;
      case 'ek-hizmetler':
        saveServicesSettings();
        break;
      // case 'fiyat-kurallari': // Gelecekte aktif edilecek
      //   savePriceRulesSettings();
      //   break;
      case 'bildirim-iletisim':
        saveNotificationSettings();
        break;
      case 'sartlar-kurallar':
        saveTermsAndConditionsSettings();
        break;
      case 'sistem':
        saveSystemSettings();
        break;
      case 'veri-yonetimi':
        // Veri yönetimi için kaydetme işlemi yok
        toast.info('Veri yönetimi ayarları kaydedildi');
        break;
      default:
        toast.error('Bilinmeyen tab');
    }
  };

  const tabs = [
    { id: 'firma', name: 'Firma Bilgileri', icon: BuildingOfficeIcon },
    { id: 'rezervasyon', name: 'Rezervasyon', icon: DocumentTextIcon },
    { id: 'ek-hizmetler', name: 'Ek Hizmetler', icon: BuildingOfficeIcon },
    // { id: 'fiyat-kurallari', name: 'Fiyat Kuralları', icon: CurrencyDollarIcon }, // Gelecekte aktif edilecek
    { id: 'bildirim-iletisim', name: 'Bildirim & İletişim', icon: BellIcon },
    { id: 'sartlar-kurallar', name: 'Şartlar ve Kurallar', icon: DocumentTextIcon },
    { id: 'sistem', name: 'Sistem', icon: GlobeAltIcon },
    { id: 'veri-yonetimi', name: 'Veri Yönetimi', icon: CircleStackIcon }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleAccordion = (section) => {
    setAccordionOpen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };


  const handleCompanySettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [key]: value
      }
    }));
  };

  // Veri yönetimi fonksiyonları
  const handleLoadDemoData = () => {
    setShowLoadDemoModal(true);
  };

  const confirmLoadDemoData = () => {
    try {
      clearAllData();
      loadDemoData();
      toast.success('Demo verileri başarıyla yüklendi!');
      // Sayfayı yenile
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Demo veri yükleme hatası:', error);
      toast.error('Demo verileri yüklenirken hata oluştu!');
    }
    setShowLoadDemoModal(false);
  };

  const handleClearAllData = () => {
    setShowClearAllModal(true);
  };

  const confirmClearAllData = () => {
    try {
      clearAllData();
      toast.success('Tüm veriler başarıyla silindi!');
      // Sayfayı yenile
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Veri silme hatası:', error);
      toast.error('Veriler silinirken hata oluştu!');
    }
    setShowClearAllModal(false);
  };

  const handleClearDemoData = () => {
    setShowClearDemoModal(true);
  };

  const confirmClearDemoData = () => {
    try {
      // Demo verilerini sil (ID 1, 2, 3 olan veriler)
      const customers = customerService.getAll();
      const bungalows = bungalowService.getAll();
      const reservations = reservationService.getAll();
      
      // Demo müşterileri sil
      const filteredCustomers = customers.filter(customer => customer.id > 3);
      customerService.clearAll();
      filteredCustomers.forEach(customer => customerService.create(customer));
      
      // Demo bungalovları sil
      const filteredBungalows = bungalows.filter(bungalow => bungalow.id > 3);
      bungalowService.clearAll();
      filteredBungalows.forEach(bungalow => bungalowService.create(bungalow));
      
      // Demo rezervasyonları sil
      const filteredReservations = reservations.filter(reservation => reservation.id > 3);
      reservationService.clearAll();
      filteredReservations.forEach(reservation => reservationService.create(reservation));
      
      toast.success('Demo verileri başarıyla silindi! Kendi verileriniz korundu.');
      // Sayfayı yenile
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Demo veri silme hatası:', error);
      toast.error('Demo verileri silinirken hata oluştu!');
    }
    setShowClearDemoModal(false);
  };

  const renderCompanySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Logo */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-800">Logo</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Firma Logosu
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                {settings.companyInfo.logo ? (
                  <>
                    <img src={settings.companyInfo.logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                    <button
                      onClick={() => handleCompanySettingChange('logo', '')}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      title="Logoyu Kaldır"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <span className="text-gray-400 text-xs">Logo</span>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => handleCompanySettingChange('logo', e.target.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Logo Yükle
                </label>
                {settings.companyInfo.logo && (
                  <button
                    onClick={() => handleCompanySettingChange('logo', '')}
                    className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 cursor-pointer"
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Logoyu Kaldır
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Firma Türü */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-800">Firma Türü</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="sahis"
                name="companyType"
                value="sahis"
                checked={settings.companyInfo.companyType === 'sahis'}
                onChange={(e) => handleCompanySettingChange('companyType', e.target.value)}
                className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300"
              />
              <label htmlFor="sahis" className="text-sm font-medium text-gray-700">
                Şahıs Firması
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="limited"
                name="companyType"
                value="limited"
                checked={settings.companyInfo.companyType === 'limited'}
                onChange={(e) => handleCompanySettingChange('companyType', e.target.value)}
                className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300"
              />
              <label htmlFor="limited" className="text-sm font-medium text-gray-700">
                Limited A.Ş.
              </label>
            </div>
          </div>
        </div>

        {/* Firma Bilgileri */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-800">Firma Bilgileri</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Firma Adı
              </label>
              <input
                type="text"
                value={settings.companyInfo.companyName}
                onChange={(e) => handleCompanySettingChange('companyName', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Firma Adı"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticaret Unvanı
              </label>
              <input
                type="text"
                value={settings.companyInfo.tradeName}
                onChange={(e) => handleCompanySettingChange('tradeName', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Ticaret Unvanı"
              />
            </div>
          </div>
        </div>

        {/* Vergi Bilgileri */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-800">Vergi Bilgileri</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vergi Dairesi
              </label>
              <input
                type="text"
                value={settings.companyInfo.taxOffice}
                onChange={(e) => handleCompanySettingChange('taxOffice', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Vergi Dairesi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {settings.companyInfo.companyType === 'sahis' ? 'TC Kimlik No' : 'Vergi No'}
              </label>
              <input
                type="text"
                value={settings.companyInfo.taxNumber}
                onChange={(e) => handleCompanySettingChange('taxNumber', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder={settings.companyInfo.companyType === 'sahis' ? 'TC Kimlik No' : 'Vergi No'}
                maxLength={settings.companyInfo.companyType === 'sahis' ? 11 : undefined}
              />
            </div>
          </div>
        </div>

        {/* İletişim Bilgileri */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-800">İletişim Bilgileri</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon No
              </label>
              <input
                type="tel"
                value={settings.companyInfo.phone}
                onChange={(e) => handleCompanySettingChange('phone', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="0XXXXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta
              </label>
              <input
                type="email"
                value={settings.companyInfo.email}
                onChange={(e) => handleCompanySettingChange('email', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="info@firma.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adres
            </label>
            <textarea
              value={settings.companyInfo.address}
              onChange={(e) => handleCompanySettingChange('address', e.target.value)}
              className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Tam adres bilgisi"
              rows={3}
            />
          </div>
        </div>

        {/* Yetkili Kişi */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-800">Yetkili Kişi</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yetkili Kişi Adı Soyadı
            </label>
            <input
              type="text"
              value={settings.companyInfo.authorizedPerson}
              onChange={(e) => handleCompanySettingChange('authorizedPerson', e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Ad Soyad"
            />
          </div>
        </div>

        {/* Banka Bilgileri */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-800">Banka Bilgileri</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IBAN
              </label>
              <input
                type="text"
                value={settings.companyInfo.iban}
                onChange={(e) => handleCompanySettingChange('iban', e.target.value.toUpperCase())}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                maxLength="34"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banka Adı
              </label>
              <input
                type="text"
                value={settings.companyInfo.bankName}
                onChange={(e) => handleCompanySettingChange('bankName', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Banka Adı"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hesap No
            </label>
            <input
              type="text"
              value={settings.companyInfo.accountNumber}
              onChange={(e) => handleCompanySettingChange('accountNumber', e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Hesap Numarası"
            />
          </div>
        </div>

        {/* Google Business Profil */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-800">Google Business Profil</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Business Profil URL'i
            </label>
            <input
              type="url"
              value={settings.companyInfo.googleBusinessUrl}
              onChange={(e) => handleCompanySettingChange('googleBusinessUrl', e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="https://g.page/your-business-name"
            />
            <p className="text-xs text-gray-500 mt-1">
              Müşterilerin deneyim mesajlarında Google'da yorum yapabilmesi için Google Business Profil URL'inizi girin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReservationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">

        {/* Giriş/Çıkış Saati Tanımlaması */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-800">Giriş/Çıkış Saati Tanımlaması</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Varsayılan Giriş Saati
              </label>
              <input
                type="time"
                value={settings.defaultCheckInTime}
                onChange={(e) => handleSettingChange('defaultCheckInTime', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Yeni rezervasyonlarda varsayılan giriş saati
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Varsayılan Çıkış Saati
              </label>
              <input
                type="time"
                value={settings.defaultCheckOutTime}
                onChange={(e) => handleSettingChange('defaultCheckOutTime', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Yeni rezervasyonlarda varsayılan çıkış saati
              </p>
            </div>
          </div>
        </div>

        {/* Minimum Konaklama Süresi */}
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h5 className="font-medium text-gray-900">Minimum Konaklama Kuralı</h5>
                <p className="text-sm text-gray-600">
                  Müşterilerin en az kaç gün konaklama yapması gerektiği
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('minimumStayRule', {
                  ...settings.minimumStayRule,
                  enabled: !settings.minimumStayRule.enabled
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.minimumStayRule.enabled ? 'bg-gray-900' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.minimumStayRule.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {settings.minimumStayRule.enabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Konaklama Süresi (Gün)
                </label>
                <input
                  type="number"
                  min="1"
                  value={settings.minimumStayRule.days}
                  onChange={(e) => handleSettingChange('minimumStayRule', {
                    ...settings.minimumStayRule,
                    days: parseInt(e.target.value) || 1
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Müşteriler en az {settings.minimumStayRule.days} gün konaklama yapabilir
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Kapora Bedeli */}
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h5 className="font-medium text-gray-900">Kapora Bedeli Kuralı</h5>
                <p className="text-sm text-gray-600">
                  Rezervasyon onay sayfasında gösterilecek sabit kapora tutarı
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('depositRule', {
                  ...settings.depositRule,
                  enabled: !settings.depositRule.enabled
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.depositRule.enabled ? 'bg-gray-900' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.depositRule.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {settings.depositRule.enabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Varsayılan Kapora Tutarı (₺)
                </label>
                <input
                  type="number"
                  value={settings.depositRule.amount}
                  onChange={(e) => handleSettingChange('depositRule', {
                    ...settings.depositRule,
                    amount: parseInt(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="500"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Rezervasyon onay sayfasında gösterilecek sabit kapora tutarı: ₺{settings.depositRule.amount}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* İptal/İade Kuralları */}
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h5 className="font-medium text-gray-900">İptal/İade Kuralları</h5>
                <p className="text-sm text-gray-600">
                  Giriş yapmamış onaylı rezervasyonların iptal edilebileceği süre
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('cancellationRule', {
                  ...settings.cancellationRule,
                  enabled: !settings.cancellationRule.enabled
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.cancellationRule.enabled ? 'bg-gray-900' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.cancellationRule.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {settings.cancellationRule.enabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İptal Süresi (Giriş yapmamış Onaylı Rezervasyonlar)
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.cancellationRule.daysBeforeCheckIn}
                  onChange={(e) => handleSettingChange('cancellationRule', {
                    ...settings.cancellationRule,
                    daysBeforeCheckIn: parseInt(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Giriş tarihinden {settings.cancellationRule.daysBeforeCheckIn} gün öncesine kadar iptal edilebilir
                </p>
              </div>
            )}
          </div>
        </div>

       
      </div>
    </div>
  );

  const renderServicesSettings = () => {
    const addService = () => {
      const newId = Math.max(...settings.services.map(s => s.id), 0) + 1;
      const newService = {
        id: newId,
        name: '',
        description: '',
        price: 0,
        enabled: false,
        type: 'per_person'
      };
      handleSettingChange('services', [...settings.services, newService]);
    };

    const updateService = (id, field, value) => {
      const updatedServices = settings.services.map(service =>
        service.id === id ? { ...service, [field]: value } : service
      );
      handleSettingChange('services', updatedServices);
    };

    const deleteService = (id) => {
      const updatedServices = settings.services.filter(service => service.id !== id);
      handleSettingChange('services', updatedServices);
    };

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {/* Hizmetler Listesi */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-gray-800">Ek Hizmetler</h4>
              <button
                onClick={addService}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Yeni Hizmet Ekle
              </button>
            </div>

            {settings.services.map((service, index) => (
              <div key={service.id} className={`p-4 rounded-lg border transition-colors ${
                service.enabled 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-gray-25 border-gray-100'
              }`}>
                <div className="space-y-4">
                  {/* Hizmet Başlığı ve Aktif/Pasif */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateService(service.id, 'name', e.target.value)}
                        placeholder="Hizmet adı (örn: Kahvaltı, Transfer, vb.)"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent font-medium ${
                          service.enabled 
                            ? 'border-gray-300 bg-white' 
                            : 'border-gray-200 bg-gray-50 text-gray-500'
                        }`}
                      />
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <span className={`text-sm ${service.enabled ? 'text-gray-600' : 'text-gray-400'}`}>
                        Aktif
                      </span>
                      <button
                        onClick={() => updateService(service.id, 'enabled', !service.enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          service.enabled ? 'bg-gray-900' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            service.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => deleteService(service.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Hizmeti Sil"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Hizmet Detayları - Sadece aktif hizmetler için göster */}
                  {service.enabled && (
                    <>
                      {/* Hizmet Açıklaması */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hizmet Açıklaması
                        </label>
                        <textarea
                          value={service.description}
                          onChange={(e) => updateService(service.id, 'description', e.target.value)}
                          placeholder="Hizmet hakkında detaylı açıklama"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          rows={2}
                        />
                      </div>

                      {/* Fiyat ve Tür */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fiyat (₺)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={service.price}
                            onChange={(e) => updateService(service.id, 'price', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fiyat Türü
                          </label>
                          <select
                            value={service.type}
                            onChange={(e) => updateService(service.id, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          >
                            <option value="per_person">Kişi Başına</option>
                            <option value="per_night">Gece Başına</option>
                          </select>
                        </div>
                      </div>

                      {/* Önizleme */}
                      {service.name && (
                        <div className="p-3 bg-white rounded-md border border-gray-200">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Önizleme:</span> {service.name}
                            {service.description && ` - ${service.description}`}
                            {service.price > 0 && ` - ₺${service.price} (${service.type === 'per_person' ? 'kişi başına' : 'gece başına'})`}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Pasif hizmetler için kısa bilgi */}
                  {!service.enabled && service.name && (
                    <div className="p-3 bg-gray-100 rounded-md border border-gray-150">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Hizmet:</span> {service.name}
                        {service.description && ` - ${service.description}`}
                        {service.price > 0 && ` - ₺${service.price} (${service.type === 'per_person' ? 'kişi başına' : 'gece başına'})`}
                        <span className="text-gray-400 ml-2">(Pasif)</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {settings.services.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Henüz ek hizmet eklenmemiş.</p>
                <p className="text-sm">Yukarıdaki "Yeni Hizmet Ekle" butonuna tıklayarak hizmet ekleyebilirsiniz.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Gelecekte aktif edilecek
  // const renderPricingRulesSettings = () => (
    <div className="space-y-6">

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

      {/* Erken Rezervasyon İndirimi */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Erken Rezervasyon İndirimi</h4>
            <p className="text-sm text-gray-600">Erken rezervasyon yapan müşterilere indirim uygula</p>
          </div>
          <button
            onClick={() => handleSettingChange('earlyBirdDiscount', {
              ...settings.earlyBirdDiscount,
              enabled: !settings.earlyBirdDiscount.enabled
            })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.earlyBirdDiscount.enabled ? 'bg-gray-900' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.earlyBirdDiscount.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {settings.earlyBirdDiscount.enabled && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İndirim Yüzdesi (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.earlyBirdDiscount.percentage}
                  onChange={(e) => handleSettingChange('earlyBirdDiscount', {
                    ...settings.earlyBirdDiscount,
                    percentage: parseInt(e.target.value) || 0
                  })}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kaç Gün Öncesi
                </label>
                <input
                  type="number"
                  min="1"
                  value={settings.earlyBirdDiscount.daysBefore}
                  onChange={(e) => handleSettingChange('earlyBirdDiscount', {
                    ...settings.earlyBirdDiscount,
                    daysBefore: parseInt(e.target.value) || 1
                  })}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded-md border border-gray-200">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Sonuç:</span> Rezervasyon giriş tarihinden 
                <span className="text-blue-600 font-medium"> {settings.earlyBirdDiscount.daysBefore} gün öncesi</span> 
                ve daha erken rezervasyon yapan müşterilere 
                <span className="text-green-600 font-medium"> %{settings.earlyBirdDiscount.percentage} indirim</span> uygulanacak
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Son Dakika İndirimi */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Son Dakika İndirimi</h4>
            <p className="text-sm text-gray-600">Son dakika rezervasyon yapan müşterilere indirim uygula</p>
          </div>
          <button
            onClick={() => handleSettingChange('lastMinuteDiscount', {
              ...settings.lastMinuteDiscount,
              enabled: !settings.lastMinuteDiscount.enabled
            })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.lastMinuteDiscount.enabled ? 'bg-gray-900' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.lastMinuteDiscount.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {settings.lastMinuteDiscount.enabled && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İndirim Yüzdesi (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.lastMinuteDiscount.percentage}
                  onChange={(e) => handleSettingChange('lastMinuteDiscount', {
                    ...settings.lastMinuteDiscount,
                    percentage: parseInt(e.target.value) || 0
                  })}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kaç Gün Öncesi
                </label>
                <input
                  type="number"
                  min="1"
                  value={settings.lastMinuteDiscount.daysBefore}
                  onChange={(e) => handleSettingChange('lastMinuteDiscount', {
                    ...settings.lastMinuteDiscount,
                    daysBefore: parseInt(e.target.value) || 1
                  })}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded-md border border-gray-200">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Sonuç:</span> Rezervasyon giriş tarihinden 
                <span className="text-orange-600 font-medium"> {settings.lastMinuteDiscount.daysBefore} gün öncesi</span> 
                ve daha geç rezervasyon yapan müşterilere 
                <span className="text-red-600 font-medium"> %{settings.lastMinuteDiscount.percentage} indirim</span> uygulanacak
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
    // </div>
  // );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
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

  const renderDataManagementSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Önemli Uyarı</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Veri yönetimi işlemleri geri alınamaz. Lütfen işlem yapmadan önce dikkatli olun.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Demo Verileri Yükle</h4>
                <p className="text-sm text-gray-600">Sistemi test etmek için örnek veriler yükleyin</p>
              </div>
              <button
                onClick={handleLoadDemoData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <CircleStackIcon className="w-4 h-4 mr-2" />
                Demo Verileri Yükle
              </button>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-yellow-900">Demo Verilerini Sil</h4>
                <p className="text-sm text-yellow-600">Sadece demo verilerini sil, kendi verilerinizi koru</p>
              </div>
              <button
                onClick={handleClearDemoData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Demo Verilerini Sil
              </button>
            </div>
          </div>

          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-900">Tüm Verileri Sil</h4>
                <p className="text-sm text-red-600">Tüm müşteri, bungalov ve rezervasyon verilerini kalıcı olarak sil</p>
              </div>
              <button
                onClick={handleClearAllData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Tüm Verileri Sil
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Veri Durumu</h4>
          <div className="text-sm text-gray-600">
            <p>Sistemde veri bulunuyor: <span className="font-medium">{hasData() ? 'Evet' : 'Hayır'}</span></p>
            <p className="mt-1">Veriler browser'ın localStorage'ında saklanmaktadır.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTermsAndConditionsSettings = () => (
    <div className="space-y-4">
      {/* İptal/İade Koşulları Accordion */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleAccordion('cancellation')}
          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-inset"
        >
          <h4 className="text-md font-medium text-gray-800">İptal/İade Koşulları</h4>
          <svg
            className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
              accordionOpen.cancellation ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {accordionOpen.cancellation && (
          <div className="px-4 pb-4 border-t border-gray-200">
            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İptal ve İade Koşulları Metni
              </label>
              <div className="w-full h-48 border border-gray-300 rounded-md overflow-hidden">
                <MDEditor
                  value={settings.termsAndConditions?.cancellationTerms || ''}
                  onChange={(value) => handleSettingChange('termsAndConditions', {
                    ...settings.termsAndConditions,
                    cancellationTerms: value || ''
                  })}
                  data-color-mode="light"
                  height={192}
                  preview="live"
                  hideToolbar={false}
                  visibleDragBar={false}
                  textareaProps={{
                    placeholder: 'İptal ve iade koşullarınızı buraya yazın...'
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Bu metin rezervasyon onay sayfasında ve iptal işlemlerinde gösterilecektir.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Kullanım Koşulları Accordion */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleAccordion('usage')}
          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-inset"
        >
          <h4 className="text-md font-medium text-gray-800">Kullanım Koşulları</h4>
          <svg
            className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
              accordionOpen.usage ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {accordionOpen.usage && (
          <div className="px-4 pb-4 border-t border-gray-200">
            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kullanım Koşulları Metni
              </label>
              <div className="w-full h-48 border border-gray-300 rounded-md overflow-hidden">
                <MDEditor
                  value={settings.termsAndConditions?.usageTerms || ''}
                  onChange={(value) => handleSettingChange('termsAndConditions', {
                    ...settings.termsAndConditions,
                    usageTerms: value || ''
                  })}
                  data-color-mode="light"
                  height={192}
                  preview="live"
                  hideToolbar={false}
                  visibleDragBar={false}
                  textareaProps={{
                    placeholder: 'Kullanım koşullarınızı buraya yazın...'
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Bu metin rezervasyon onay sayfasında ve bungalov kullanım kurallarında gösterilecektir.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Kiralama Şartları ve Sözleşmesi Accordion */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleAccordion('rental')}
          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-inset"
        >
          <h4 className="text-md font-medium text-gray-800">Kiralama Şartları ve Sözleşmesi</h4>
          <svg
            className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
              accordionOpen.rental ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {accordionOpen.rental && (
          <div className="px-4 pb-4 border-t border-gray-200">
            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kiralama Şartları ve Sözleşmesi Metni
              </label>
              <div className="w-full h-48 border border-gray-300 rounded-md overflow-hidden">
                <MDEditor
                  value={settings.termsAndConditions?.rentalTerms || ''}
                  onChange={(value) => handleSettingChange('termsAndConditions', {
                    ...settings.termsAndConditions,
                    rentalTerms: value || ''
                  })}
                  data-color-mode="light"
                  height={192}
                  preview="live"
                  hideToolbar={false}
                  visibleDragBar={false}
                  textareaProps={{
                    placeholder: 'Kiralama şartları ve sözleşme metnini buraya yazın...'
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Bu metin rezervasyon onay sayfasında ve sözleşme kabul işlemlerinde gösterilecektir.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Gizlilik Bildirimi Accordion */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleAccordion('privacy')}
          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-inset"
        >
          <h4 className="text-md font-medium text-gray-800">Gizlilik Bildirimi</h4>
          <svg
            className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
              accordionOpen.privacy ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {accordionOpen.privacy && (
          <div className="px-4 pb-4 border-t border-gray-200">
            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gizlilik Bildirimi Metni
              </label>
              <div className="w-full h-48 border border-gray-300 rounded-md overflow-hidden">
                <MDEditor
                  value={settings.termsAndConditions?.privacyPolicy || ''}
                  onChange={(value) => handleSettingChange('termsAndConditions', {
                    ...settings.termsAndConditions,
                    privacyPolicy: value || ''
                  })}
                  data-color-mode="light"
                  height={192}
                  preview="live"
                  hideToolbar={false}
                  visibleDragBar={false}
                  textareaProps={{
                    placeholder: 'Gizlilik bildirimi metnini buraya yazın...'
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Bu metin gizlilik politikası sayfasında ve veri işleme onaylarında gösterilecektir.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* KVKK Aydınlatma Metni Accordion */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleAccordion('kvkk')}
          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-inset"
        >
          <h4 className="text-md font-medium text-gray-800">KVKK Aydınlatma Metni</h4>
          <svg
            className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
              accordionOpen.kvkk ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {accordionOpen.kvkk && (
          <div className="px-4 pb-4 border-t border-gray-200">
            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                KVKK Aydınlatma Metni
              </label>
              <div className="w-full h-48 border border-gray-300 rounded-md overflow-hidden">
                <MDEditor
                  value={settings.termsAndConditions?.kvkkText || ''}
                  onChange={(value) => handleSettingChange('termsAndConditions', {
                    ...settings.termsAndConditions,
                    kvkkText: value || ''
                  })}
                  data-color-mode="light"
                  height={192}
                  preview="live"
                  hideToolbar={false}
                  visibleDragBar={false}
                  textareaProps={{
                    placeholder: 'KVKK aydınlatma metnini buraya yazın...'
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Bu metin KVKK uyumluluğu için rezervasyon sürecinde ve veri işleme onaylarında gösterilecektir.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bilgilendirme */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Önemli Bilgi</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>• Bu metinler rezervasyon onay sayfasında müşterilere gösterilecektir.</p>
              <p>• Yasal açıdan geçerli olması için hukuki danışmanlık almanız önerilir.</p>
              <p>• Metinlerde değişiklik yaptığınızda mevcut rezervasyonlar etkilenmez.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-8">
      {/* 1. BİLDİRİM AYARLARI GRUBU */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 5.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Bildirim Ayarları</h3>
            <p className="text-sm text-gray-600">Hangi durumlarda müşteriye bildirim gönderileceğini belirleyin</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {Object.entries(settings.notifications || {}).map(([type, notification]) => {
            // Ensure notification object has default structure
            const safeNotification = {
              enabled: false,
              email: true,
              whatsapp: false,
              ...notification
            };
            
            return (
              <div key={type} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-gray-900">
                      {type === 'newReservation' ? 'Yeni Rezervasyon' :
                       type === 'cancellation' ? 'İptal' :
                       type === 'postponement' ? 'Erteleme' :
                       type === 'experienceMessage' ? 'Deneyim Mesajı ve Puanlama' :
                       'Bildirim'} Bildirimi
                    </h5>
                    <p className="text-sm text-gray-600">
                      Bu durumda müşteriye bildirim gönder
                    </p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('notifications', {
                      ...settings.notifications,
                      [type]: { ...safeNotification, enabled: !safeNotification.enabled }
                    })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      safeNotification.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        safeNotification.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                {safeNotification.enabled && (
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={safeNotification.email}
                        onChange={(e) => handleSettingChange('notifications', {
                          ...settings.notifications,
                          [type]: { ...safeNotification, email: e.target.checked }
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">E-posta</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={safeNotification.whatsapp}
                        onChange={(e) => handleSettingChange('notifications', {
                          ...settings.notifications,
                          [type]: { ...safeNotification, whatsapp: e.target.checked }
                        })}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">WhatsApp</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. E-POSTA ŞABLONLARI GRUBU */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mr-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">E-posta Şablonları</h3>
              <p className="text-sm text-gray-600">Otomatik e-posta şablonları ve içerikleri</p>
            </div>
          </div>
          <button
            onClick={() => handleSettingChange('emailTemplates', {
              ...settings.emailTemplates,
              enabled: !settings.emailTemplates.enabled
            })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.emailTemplates.enabled ? 'bg-purple-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.emailTemplates.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
          
        {settings.emailTemplates.enabled && (
          <div className="space-y-4">
            {/* Rezervasyon Onayı */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Rezervasyon Onayı</h5>
                  <button
                    onClick={() => handleSettingChange('emailTemplates', {
                      ...settings.emailTemplates,
                      reservationConfirmation: {
                        ...(settings.emailTemplates?.reservationConfirmation || {}),
                        enabled: !(settings.emailTemplates?.reservationConfirmation?.enabled || false)
                      }
                    })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.emailTemplates?.reservationConfirmation?.enabled ? 'bg-gray-900' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.emailTemplates?.reservationConfirmation?.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {settings.emailTemplates?.reservationConfirmation?.enabled && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                      <input
                        type="text"
                        value={settings.emailTemplates?.reservationConfirmation?.subject || ''}
                        onChange={(e) => handleSettingChange('emailTemplates', {
                          ...settings.emailTemplates,
                          reservationConfirmation: {
                            ...(settings.emailTemplates?.reservationConfirmation || {}),
                            subject: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Şablon</label>
                      <textarea
                        rows={6}
                        value={settings.emailTemplates?.reservationConfirmation?.template || ''}
                        onChange={(e) => handleSettingChange('emailTemplates', {
                          ...settings.emailTemplates,
                          reservationConfirmation: {
                            ...(settings.emailTemplates?.reservationConfirmation || {}),
                            template: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Hatırlatma Mesajı */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Hatırlatma Mesajı</h5>
                  <button
                    onClick={() => handleSettingChange('emailTemplates', {
                      ...settings.emailTemplates,
                      reminderMessage: {
                        ...settings.emailTemplates.reminderMessage,
                        enabled: !settings.emailTemplates.reminderMessage.enabled
                      }
                    })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.emailTemplates.reminderMessage.enabled ? 'bg-gray-900' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.emailTemplates.reminderMessage.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {settings.emailTemplates.reminderMessage.enabled && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                      <input
                        type="text"
                        value={settings.emailTemplates.reminderMessage.subject}
                        onChange={(e) => handleSettingChange('emailTemplates', {
                          ...settings.emailTemplates,
                          reminderMessage: {
                            ...settings.emailTemplates.reminderMessage,
                            subject: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Şablon</label>
                      <textarea
                        rows={6}
                        value={settings.emailTemplates.reminderMessage.template}
                        onChange={(e) => handleSettingChange('emailTemplates', {
                          ...settings.emailTemplates,
                          reminderMessage: {
                            ...settings.emailTemplates.reminderMessage,
                            template: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Teşekkür Mesajı */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Teşekkür Mesajı</h5>
                  <button
                    onClick={() => handleSettingChange('emailTemplates', {
                      ...settings.emailTemplates,
                      thankYouMessage: {
                        ...settings.emailTemplates.thankYouMessage,
                        enabled: !settings.emailTemplates.thankYouMessage.enabled
                      }
                    })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.emailTemplates.thankYouMessage.enabled ? 'bg-gray-900' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.emailTemplates.thankYouMessage.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {settings.emailTemplates.thankYouMessage.enabled && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                      <input
                        type="text"
                        value={settings.emailTemplates.thankYouMessage.subject}
                        onChange={(e) => handleSettingChange('emailTemplates', {
                          ...settings.emailTemplates,
                          thankYouMessage: {
                            ...settings.emailTemplates.thankYouMessage,
                            subject: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Şablon</label>
                      <textarea
                        rows={6}
                        value={settings.emailTemplates.thankYouMessage.template}
                        onChange={(e) => handleSettingChange('emailTemplates', {
                          ...settings.emailTemplates,
                          thankYouMessage: {
                            ...settings.emailTemplates.thankYouMessage,
                            template: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Deneyim Mesajı ve Puanlama */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Deneyim Mesajı ve Puanlama</h5>
                  <button
                    onClick={() => handleSettingChange('emailTemplates', {
                      ...settings.emailTemplates,
                      experienceMessage: {
                        ...settings.emailTemplates.experienceMessage,
                        enabled: !settings.emailTemplates.experienceMessage.enabled
                      }
                    })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.emailTemplates.experienceMessage.enabled ? 'bg-gray-900' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.emailTemplates.experienceMessage.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {settings.emailTemplates.experienceMessage.enabled && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                      <input
                        type="text"
                        value={settings.emailTemplates.experienceMessage.subject}
                        onChange={(e) => handleSettingChange('emailTemplates', {
                          ...settings.emailTemplates,
                          experienceMessage: {
                            ...settings.emailTemplates.experienceMessage,
                            subject: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Şablon</label>
                      <textarea
                        rows={6}
                        value={settings.emailTemplates.experienceMessage.template}
                        onChange={(e) => handleSettingChange('emailTemplates', {
                          ...settings.emailTemplates,
                          experienceMessage: {
                            ...settings.emailTemplates.experienceMessage,
                            template: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* 3. E-POSTA GÖNDERİM AYARLARI GRUBU */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg mr-3">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">E-posta Gönderim Ayarları (SMTP)</h3>
              <p className="text-sm text-gray-600">E-posta gönderimi için sunucu konfigürasyonu</p>
            </div>
          </div>
          <button
            onClick={() => handleSettingChange('smtpSettings', {
              ...settings.smtpSettings,
              enabled: !settings.smtpSettings.enabled
            })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.smtpSettings.enabled ? 'bg-orange-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.smtpSettings.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
          
          {settings.smtpSettings.enabled && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                  <input
                    type="text"
                    value={settings.smtpSettings.host}
                    onChange={(e) => handleSettingChange('smtpSettings', {
                      ...settings.smtpSettings,
                      host: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
                  <input
                    type="number"
                    value={settings.smtpSettings.port}
                    onChange={(e) => handleSettingChange('smtpSettings', {
                      ...settings.smtpSettings,
                      port: parseInt(e.target.value) || 587
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="587"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kullanıcı Adı</label>
                  <input
                    type="text"
                    value={settings.smtpSettings.username}
                    onChange={(e) => handleSettingChange('smtpSettings', {
                      ...settings.smtpSettings,
                      username: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
                  <input
                    type="password"
                    value={settings.smtpSettings.password}
                    onChange={(e) => handleSettingChange('smtpSettings', {
                      ...settings.smtpSettings,
                      password: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gönderen E-posta</label>
                  <input
                    type="email"
                    value={settings.smtpSettings.fromEmail}
                    onChange={(e) => handleSettingChange('smtpSettings', {
                      ...settings.smtpSettings,
                      fromEmail: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="noreply@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gönderen Adı</label>
                  <input
                    type="text"
                    value={settings.smtpSettings.fromName}
                    onChange={(e) => handleSettingChange('smtpSettings', {
                      ...settings.smtpSettings,
                      fromName: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="BungApp"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.smtpSettings.secure}
                  onChange={(e) => handleSettingChange('smtpSettings', {
                    ...settings.smtpSettings,
                    secure: e.target.checked
                  })}
                  className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">SSL/TLS Kullan (Port 465 için)</span>
              </div>
            </div>
          )}
      </div>
    </div>
  );

  const renderWhatsAppTemplates = () => (
    <div className="space-y-8">
      {/* WHATSAPP ŞABLONLARI GRUBU */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mr-3">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">WhatsApp Bilgilendirme Kuralları</h3>
              <p className="text-sm text-gray-600">WhatsApp üzerinden gönderilecek mesaj şablonları</p>
            </div>
          </div>
          <button
            onClick={() => handleSettingChange('whatsappTemplates', {
              ...settings.whatsappTemplates,
              enabled: !settings.whatsappTemplates.enabled
            })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.whatsappTemplates.enabled ? 'bg-green-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.whatsappTemplates.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
          
          {settings.whatsappTemplates.enabled && (
            <div className="space-y-4">
              {/* Rezervasyon Onayı */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Rezervasyon Onayı</h5>
                  <button
                    onClick={() => handleSettingChange('whatsappTemplates', {
                      ...settings.whatsappTemplates,
                      reservationConfirmation: {
                        ...settings.whatsappTemplates.reservationConfirmation,
                        enabled: !settings.whatsappTemplates.reservationConfirmation.enabled
                      }
                    })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.whatsappTemplates.reservationConfirmation.enabled ? 'bg-gray-900' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.whatsappTemplates.reservationConfirmation.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {settings.whatsappTemplates.reservationConfirmation.enabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mesaj</label>
                    <textarea
                      rows={3}
                      value={settings.whatsappTemplates.reservationConfirmation.message}
                      onChange={(e) => handleSettingChange('whatsappTemplates', {
                        ...settings.whatsappTemplates,
                        reservationConfirmation: {
                          ...settings.whatsappTemplates.reservationConfirmation,
                          message: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Hatırlatma Mesajı */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Hatırlatma Mesajı</h5>
                  <button
                    onClick={() => handleSettingChange('whatsappTemplates', {
                      ...settings.whatsappTemplates,
                      reminderMessage: {
                        ...settings.whatsappTemplates.reminderMessage,
                        enabled: !settings.whatsappTemplates.reminderMessage.enabled
                      }
                    })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.whatsappTemplates.reminderMessage.enabled ? 'bg-gray-900' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.whatsappTemplates.reminderMessage.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {settings.whatsappTemplates.reminderMessage.enabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mesaj</label>
                    <textarea
                      rows={3}
                      value={settings.whatsappTemplates.reminderMessage.message}
                      onChange={(e) => handleSettingChange('whatsappTemplates', {
                        ...settings.whatsappTemplates,
                        reminderMessage: {
                          ...settings.whatsappTemplates.reminderMessage,
                          message: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Teşekkür Mesajı */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Teşekkür Mesajı</h5>
                  <button
                    onClick={() => handleSettingChange('whatsappTemplates', {
                      ...settings.whatsappTemplates,
                      thankYouMessage: {
                        ...settings.whatsappTemplates.thankYouMessage,
                        enabled: !settings.whatsappTemplates.thankYouMessage.enabled
                      }
                    })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.whatsappTemplates.thankYouMessage.enabled ? 'bg-gray-900' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.whatsappTemplates.thankYouMessage.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {settings.whatsappTemplates.thankYouMessage.enabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mesaj</label>
                    <textarea
                      rows={3}
                      value={settings.whatsappTemplates.thankYouMessage.message}
                      onChange={(e) => handleSettingChange('whatsappTemplates', {
                        ...settings.whatsappTemplates,
                        thankYouMessage: {
                          ...settings.whatsappTemplates.thankYouMessage,
                          message: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Deneyim Mesajı ve Puanlama */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Deneyim Mesajı ve Puanlama</h5>
                  <button
                    onClick={() => handleSettingChange('whatsappTemplates', {
                      ...settings.whatsappTemplates,
                      experienceMessage: {
                        ...settings.whatsappTemplates.experienceMessage,
                        enabled: !settings.whatsappTemplates.experienceMessage.enabled
                      }
                    })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.whatsappTemplates.experienceMessage.enabled ? 'bg-gray-900' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.whatsappTemplates.experienceMessage.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {settings.whatsappTemplates.experienceMessage.enabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mesaj</label>
                    <textarea
                      rows={3}
                      value={settings.whatsappTemplates.experienceMessage.message}
                      onChange={(e) => handleSettingChange('whatsappTemplates', {
                        ...settings.whatsappTemplates,
                        experienceMessage: {
                          ...settings.whatsappTemplates.experienceMessage,
                          message: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );

  const renderSmsSettings = () => (
    <div className="space-y-8">
      {/* SMS SAĞLAYICISI GRUBU */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg mr-3">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">SMS Sağlayıcısı</h3>
              <p className="text-sm text-gray-600">SMS gönderimi için sağlayıcı ayarları (Gelecekte aktif edilebilir)</p>
            </div>
          </div>
          <button
            onClick={() => handleSettingChange('smsProvider', {
              ...settings.smsProvider,
              enabled: !settings.smsProvider.enabled
            })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.smsProvider.enabled ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.smsProvider.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {settings.smsProvider.enabled && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sağlayıcı</label>
                  <select
                    value={settings.smsProvider.provider}
                    onChange={(e) => handleSettingChange('smsProvider', {
                      ...settings.smsProvider,
                      provider: e.target.value
                    })}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="netgsm">NetGSM</option>
                    <option value="iletimerkezi">İleti Merkezi</option>
                    <option value="verimor">Verimor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gönderen Adı</label>
                  <input
                    type="text"
                    value={settings.smsProvider.senderName}
                    onChange={(e) => handleSettingChange('smsProvider', {
                      ...settings.smsProvider,
                      senderName: e.target.value
                    })}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">API Anahtarı</label>
                <input
                  type="password"
                  value={settings.smsProvider.apiKey}
                  onChange={(e) => handleSettingChange('smsProvider', {
                    ...settings.smsProvider,
                    apiKey: e.target.value
                  })}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="API anahtarınızı girin"
                />
              </div>
              
              {/* Test Butonu */}
              <div className="mt-4">
                <button
                  onClick={() => {
                    if (!settings.smsProvider.apiKey) {
                      toast.error('API anahtarı giriniz!');
                      return;
                    }
                    toast.info('SMS test özelliği gelecekte eklenecek!');
                  }}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 h-9 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>SMS Test Gönder</span>
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );

  const renderWhatsAppSettings = () => (
    <div className="space-y-8">
      {/* WHATSAPP REZERVASYON ONAY GRUBU */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mr-3">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">WhatsApp Rezervasyon Onay</h3>
              <p className="text-sm text-gray-600">Rezervasyon onay linklerini WhatsApp ile gönder</p>
            </div>
          </div>
          <button
            onClick={() => handleSettingChange('whatsappIntegration', {
              ...settings.whatsappIntegration,
              enabled: !settings.whatsappIntegration.enabled
            })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.whatsappIntegration.enabled ? 'bg-green-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.whatsappIntegration.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {settings.whatsappIntegration.enabled && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              {/* İşletme Bilgileri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İşletme Adı</label>
                  <input
                    type="text"
                    value={settings.whatsappIntegration.businessName}
                    onChange={(e) => handleSettingChange('whatsappIntegration', {
                      ...settings.whatsappIntegration,
                      businessName: e.target.value
                    })}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="BungApp"
                  />
                  <p className="text-xs text-gray-500 mt-1">Mesajlarda görünecek işletme adı</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Telefon Numarası</label>
                  <input
                    type="tel"
                    value={settings.whatsappIntegration.phoneNumber}
                    onChange={(e) => handleSettingChange('whatsappIntegration', {
                      ...settings.whatsappIntegration,
                      phoneNumber: e.target.value
                    })}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="905551234567"
                  />
                  <p className="text-xs text-gray-500 mt-1">Test mesajları için kullanılacak numara</p>
                </div>
              </div>
              
              {/* Rezervasyon Onay Mesajı Şablonu */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rezervasyon Onay Mesajı Şablonu
                  </label>
                  <textarea
                    rows={6}
                    value={settings.whatsappIntegration.confirmationMessage}
                    onChange={(e) => handleSettingChange('whatsappIntegration', {
                      ...settings.whatsappIntegration,
                      confirmationMessage: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Merhaba {customerName},

Rezervasyonunuz için onay linki:

{confirmationLink}

Bu link 24 saat geçerlidir. Lütfen kapora ödemesini yaparak rezervasyonunuzu onaylayın.

Rezervasyon Detayları:
- Bungalov: {bungalowName}
- Giriş: {checkInDate}
- Çıkış: {checkOutDate}
- Toplam Tutar: {totalPrice}
- Kapora: {depositAmount}

İyi günler!"
                  />
                  <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <p className="text-xs text-blue-700">
                      <span className="font-medium">Kullanılabilir Değişkenler:</span> {'{customerName}'}, {'{reservationCode}'}, {'{bungalowName}'}, {'{checkInDate}'}, {'{checkOutDate}'}, {'{totalPrice}'}, {'{depositAmount}'}, {'{confirmationLink}'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Test Butonları */}
              <div className="mt-6 space-y-3">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      const phone = settings.whatsappIntegration.phoneNumber;
                      if (!phone) {
                        toast.error('Test telefon numarası giriniz!');
                        return;
                      }
                      
                      // Test verileri ile şablonu doldur
                      let message = settings.whatsappIntegration.confirmationMessage || 'Test mesajı';
                      const testData = {
                        '{customerName}': 'Ahmet Yılmaz',
                        '{reservationCode}': 'REZ-2024-001',
                        '{bungalowName}': 'Villa 1',
                        '{checkInDate}': '15.01.2024',
                        '{checkOutDate}': '17.01.2024',
                        '{totalPrice}': '₺2.000',
                        '{depositAmount}': '₺400',
                        '{confirmationLink}': 'https://example.com/confirm/ABC123'
                      };
                      
                      Object.entries(testData).forEach(([key, value]) => {
                        message = message.replace(new RegExp(key, 'g'), value);
                      });
                      
                      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 h-9 px-4 py-2 bg-green-600 text-white hover:bg-green-700"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.214-.361a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    <span>Rezervasyon Onay Mesajı Test</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
                <p className="text-sm text-green-700">
                  <span className="font-medium">Özellik:</span> Rezervasyon onay linklerini WhatsApp üzerinden müşteriye gönderebilirsiniz.
                </p>
                <p className="text-sm text-green-600 mt-2">
                  <span className="font-medium">Kullanım:</span> Rezervasyon detay sayfasında "WhatsApp ile Gönder" butonuna tıklayarak müşteriye onay mesajı gönderebilirsiniz. Mesaj şablonu yukarıdaki ayarlardan özelleştirilebilir.
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'firma':
        return renderCompanySettings();
      case 'rezervasyon':
        return renderReservationSettings();
      case 'ek-hizmetler':
        return renderServicesSettings();
      // case 'fiyat-kurallari': // Gelecekte aktif edilecek
      //   return renderPricingRulesSettings();
      case 'bildirim-iletisim':
        return (
          <div className="space-y-8">
            {renderNotificationSettings()}
            {renderWhatsAppTemplates()}
            {renderSmsSettings()}
            {renderWhatsAppSettings()}
          </div>
        );
      case 'sartlar-kurallar':
        return renderTermsAndConditionsSettings();
      case 'sistem':
        return renderSystemSettings();
      case 'veri-yonetimi':
        return renderDataManagementSettings();
      default:
        return renderCompanySettings();
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

        {/* Modal'lar */}
        <ConfirmModal
          isOpen={showLoadDemoModal}
          onClose={() => setShowLoadDemoModal(false)}
          onConfirm={confirmLoadDemoData}
          title="Demo Verileri Yükle"
          message="Demo verileri yüklemek istediğinizden emin misiniz? Mevcut verileriniz silinecektir."
          confirmText="Yükle"
          cancelText="İptal"
          type="warning"
        />

        <ConfirmModal
          isOpen={showClearAllModal}
          onClose={() => setShowClearAllModal(false)}
          onConfirm={confirmClearAllData}
          title="Tüm Verileri Sil"
          message="TÜM VERİLERİ SİLMEK istediğinizden emin misiniz? Bu işlem geri alınamaz! Tüm müşteri, bungalov ve rezervasyon verileri kalıcı olarak silinecektir."
          confirmText="Sil"
          cancelText="İptal"
          type="danger"
        />

        <ConfirmModal
          isOpen={showClearDemoModal}
          onClose={() => setShowClearDemoModal(false)}
          onConfirm={confirmClearDemoData}
          title="Demo Verilerini Sil"
          message="Demo verilerini silmek istediğinizden emin misiniz? Sadece demo verileri silinecek, kendi eklediğiniz veriler korunacak."
          confirmText="Sil"
          cancelText="İptal"
          type="info"
        />
      </div>
    );
};

export default Settings;