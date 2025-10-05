# 🏖️ BungApp - Bungalov Rezervasyon Yönetim Sistemi

Modern ve kullanıcı dostu bungalov rezervasyon yönetim sistemi. React, Tailwind CSS ve modern web teknolojileri kullanılarak geliştirilmiştir.

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Proje Yapısı](#-proje-yapısı)
- [API Referansı](#-api-referansı)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

## ✨ Özellikler

### 🏠 Bungalov Yönetimi
- **Bungalov Listesi**: Tüm bungalovları görüntüleme ve yönetme
- **Bungalov Detayları**: Kapsamlı bungalov bilgileri ve istatistikleri
- **Bungalov Düzenleme**: Dinamik bungalov bilgileri güncelleme
- **Durum Yönetimi**: Aktif, Pasif, Bakımda durumları
- **Kapasite ve Fiyat**: Esnek kapasite ve fiyat yönetimi

### 👥 Müşteri Yönetimi
- **Müşteri Listesi**: Tüm müşterileri görüntüleme ve arama
- **Müşteri Detayları**: Kapsamlı müşteri profilleri
- **Müşteri Düzenleme**: Müşteri bilgilerini güncelleme
- **Müşteri Durumları**: Aktif, Pasif, Yasaklı durumları
- **Rezervasyon Geçmişi**: Müşteri rezervasyon geçmişi

### 📅 Rezervasyon Yönetimi
- **Rezervasyon Listesi**: Tüm rezervasyonları görüntüleme
- **Rezervasyon Oluşturma**: Yeni rezervasyon ekleme
- **Rezervasyon Detayları**: Kapsamlı rezervasyon bilgileri
- **Rezervasyon Düzenleme**: Rezervasyon bilgilerini güncelleme
- **Rezervasyon Durumları**: Beklemede, Onaylandı, Giriş Yapıldı, Çıkış Yapıldı, İptal Edildi
- **Ödeme Yönetimi**: Ödeme durumu takibi ve yönetimi

### 📊 Dashboard ve Raporlar
- **Ana Dashboard**: Genel istatistikler ve özet bilgiler
- **Detaylı Raporlar**: Kapsamlı analiz ve grafikler
- **Gelir Analizi**: Aylık ve yıllık gelir raporları
- **Doluluk Oranları**: Bungalov doluluk analizi
- **Müşteri İstatistikleri**: Müşteri davranış analizi

### 🔧 Gelişmiş Özellikler
- **Modal Sistemleri**: Rezervasyon iptal, ödeme, erteleme modalları
- **Sayfalama**: Tüm listelerde sayfalama desteği
- **Arama ve Filtreleme**: Gelişmiş arama ve filtreleme seçenekleri
- **Responsive Tasarım**: Mobil ve tablet uyumlu tasarım
- **Tooltip Desteği**: Kullanıcı dostu bilgi popup'ları
- **Loading States**: Yükleme durumu göstergeleri

## 🛠️ Teknolojiler

### Frontend
- **React 19.2.0** - Modern React framework
- **React Router DOM 7.9.3** - Sayfa yönlendirme
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Modern icon kütüphanesi
- **Chart.js 4.5.0** - Grafik ve chart kütüphanesi
- **React Chart.js 2 5.3.0** - React Chart.js entegrasyonu

### Development Tools
- **Create React App** - React proje scaffold'u
- **ESLint** - Kod kalitesi kontrolü
- **Jest** - Test framework'ü
- **Web Vitals** - Performans ölçümü

### Utility Libraries
- **clsx** - Conditional className utility
- **tailwind-merge** - Tailwind CSS class merging

## 🚀 Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- npm veya yarn

### Adımlar

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/aorkuneren/bungApp-react.git
cd bungApp-react
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın**
```bash
npm start
```

4. **Tarayıcıda açın**
```
http://localhost:3000
```

### Production Build
```bash
npm run build
```

## 📱 Kullanım

### Ana Sayfalar

#### 🏠 Dashboard
- Genel istatistikler
- Hızlı erişim butonları
- Son rezervasyonlar
- Gelir özeti

#### 🏖️ Bungalovlar
- Bungalov listesi
- Yeni bungalov ekleme
- Bungalov düzenleme
- Durum yönetimi

#### 👥 Müşteriler
- Müşteri listesi
- Müşteri arama
- Müşteri detayları
- Müşteri düzenleme

#### 📅 Rezervasyonlar
- Rezervasyon listesi
- Yeni rezervasyon
- Rezervasyon detayları
- Rezervasyon düzenleme

#### 📊 Raporlar
- Detaylı analizler
- Grafik ve chartlar
- Gelir raporları
- Doluluk analizi

### Modal İşlemleri

#### 💰 Ödeme Modalı
- Ödeme kaydı oluşturma
- Ödeme yöntemi seçimi
- Ödeme notları
- Hızlı ödeme butonları

#### ❌ İptal Modalı
- Rezervasyon iptal etme
- İptal sebebi belirtme
- İade hesaplama
- İptal politikası

#### 📅 Erteleme Modalı
- Tarih değiştirme
- Müsaitlik kontrolü
- Fiyat hesaplama
- Manuel fiyat ayarı

## 📁 Proje Yapısı

```
src/
├── components/           # Yeniden kullanılabilir bileşenler
│   ├── ui/              # UI bileşenleri
│   │   └── icons/       # Icon bileşenleri
│   ├── CancelReservationModal.js
│   ├── PaymentModal.js
│   ├── PostponeReservationModal.js
│   └── Navigation.js
├── data/                # Veri yönetimi
│   ├── data.js          # Ana veri dosyası
│   ├── dataBungalows.js # Bungalov verileri
│   ├── dataCustomers.js # Müşteri verileri
│   └── dataReservations.js # Rezervasyon verileri
├── lib/                 # Yardımcı fonksiyonlar
│   └── utils.js         # Utility fonksiyonları
├── pages/               # Sayfa bileşenleri
│   ├── Dashboard.js
│   ├── Bungalows.js
│   ├── BungalowDetailsPage.js
│   ├── BungalowEditPage.js
│   ├── Customers.js
│   ├── CustomerDetailsPage.js
│   ├── CustomerEditPage.js
│   ├── Reservations.js
│   ├── ReservationDetailsPage.js
│   ├── ReservationEditPage.js
│   ├── CreateReservation.js
│   ├── Reports.js
│   ├── Profile.js
│   ├── Settings.js
│   ├── Login.js
│   └── ForgotPassword.js
├── App.js               # Ana uygulama bileşeni
├── App.css              # Ana stil dosyası
├── index.js             # Uygulama giriş noktası
└── index.css            # Global stiller
```

## 🔌 API Referansı

### Veri Fonksiyonları

#### Müşteri Fonksiyonları
```javascript
// Müşteri getirme
getCustomerById(id)
getCustomersByEmail(email)
getCustomersByName(name)
getCustomersByStatus(status)
getActiveCustomers()
getBannedCustomers()

// Müşteri güncelleme
updateCustomerStatus(id, status)
updateCustomerReservationStats(id)
updateAllCustomerStats()
```

#### Bungalov Fonksiyonları
```javascript
// Bungalov getirme
getBungalowById(id)
getBungalowsByStatus(status)
getBungalowsByCapacity(capacity)
getBungalowsByPriceRange(minPrice, maxPrice)
```

#### Rezervasyon Fonksiyonları
```javascript
// Rezervasyon getirme
getReservationById(id)
getReservationsByBungalowId(bungalowId)
getReservationsByCustomerId(customerId)
getReservationsByStatus(status)
getReservationsByPaymentStatus(paymentStatus)
getReservationsByDateRange(startDate, endDate)
getTodayReservations()
getUpcomingReservations()
```

### Durum Sabitleri

```javascript
// Müşteri durumları
CUSTOMER_STATUS = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Pasif',
  BANNED: 'Yasaklı'
}

// Bungalov durumları
BUNGALOW_STATUS = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Pasif',
  MAINTENANCE: 'Bakımda'
}

// Rezervasyon durumları
RESERVATION_STATUS = {
  PENDING: 'Beklemede',
  CONFIRMED: 'Onaylandı',
  CHECKED_IN: 'Giriş Yapıldı',
  CHECKED_OUT: 'Çıkış Yapıldı',
  CANCELLED: 'İptal Edildi'
}

// Ödeme durumları
PAYMENT_STATUS = {
  UNPAID: 'Ödenmedi',
  PAID: 'Ödendi',
  PARTIAL: 'Kısmi Ödendi',
  DEPOSIT: 'Kapora Kesildi'
}
```

## 🎨 Tasarım Sistemi

### Renk Paleti
- **Primary**: Gray-900 (#111827)
- **Secondary**: Gray-600 (#4B5563)
- **Success**: Green-600 (#059669)
- **Warning**: Yellow-600 (#D97706)
- **Error**: Red-600 (#DC2626)
- **Info**: Blue-600 (#2563EB)

### Tipografi
- **Font Family**: Inter, system-ui, sans-serif
- **Font Sizes**: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl
- **Font Weights**: font-normal, font-medium, font-semibold, font-bold

### Spacing
- **Padding**: p-1, p-2, p-3, p-4, p-6, p-8
- **Margin**: m-1, m-2, m-3, m-4, m-6, m-8
- **Gap**: gap-1, gap-2, gap-3, gap-4, gap-6, gap-8

## 📊 Performans

### Bundle Size
- **Main Bundle**: 190.18 kB (gzipped)
- **Chunk Bundle**: 1.76 kB (gzipped)
- **Total Size**: ~192 kB (gzipped)

### Optimizasyonlar
- ✅ **Code Splitting**: Sayfa bazlı kod bölme
- ✅ **Tree Shaking**: Kullanılmayan kod kaldırma
- ✅ **Minification**: Kod sıkıştırma
- ✅ **Gzip Compression**: Dosya sıkıştırma
- ✅ **ESLint Clean**: Temiz kod yapısı

## 🧪 Test

### Test Komutları
```bash
# Tüm testleri çalıştır
npm test

# Test coverage raporu
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Test Kapsamı
- Component rendering
- User interactions
- Data validation
- Error handling

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Seçenekleri
- **Netlify**: Otomatik deployment
- **Vercel**: Serverless deployment
- **GitHub Pages**: Static hosting
- **Heroku**: Container deployment

### Environment Variables
```bash
REACT_APP_API_URL=https://api.bungapp.com
REACT_APP_ENVIRONMENT=production
```

## 🤝 Katkıda Bulunma

### Geliştirme Süreci
1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

### Kod Standartları
- ESLint kurallarına uyun
- Prettier formatını kullanın
- Meaningful commit mesajları yazın
- Test coverage'ı koruyun

## 📝 Changelog

### v0.1.0 (2025-01-27)
- ✅ İlk sürüm yayınlandı
- ✅ Bungalov yönetim sistemi
- ✅ Müşteri yönetim sistemi
- ✅ Rezervasyon yönetim sistemi
- ✅ Dashboard ve raporlar
- ✅ Modal sistemleri
- ✅ Responsive tasarım
- ✅ ESLint temizliği

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👨‍💻 Geliştirici

**Ahmet Orkun Eren**
- GitHub: [@aorkuneren](https://github.com/aorkuneren)
- Repository: [bungApp-react](https://github.com/aorkuneren/bungApp-react)

## 🙏 Teşekkürler

- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Heroicons](https://heroicons.com/) - Icon library
- [Chart.js](https://www.chartjs.org/) - Chart library
- [Create React App](https://create-react-app.dev/) - Build tool

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!