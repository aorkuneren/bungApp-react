# BungApp Deployment Instructions

## 🚀 Sunucuya Deploy Adımları

### 1. Frontend (React) Deploy

#### A. Production Build Oluştur
```bash
# Proje dizininde
npm run build
```

#### B. Build Dosyalarını Sunucuya Yükle
```bash
# FTP ile build/ klasörünün içeriğini sunucuya yükle
# Hedef: /public_html/ (veya domain'in root dizini)
```

### 2. Backend (Laravel) Kurulum

#### A. Laravel Projesi Oluştur
```bash
# Sunucuda
composer create-project laravel/laravel bungapp-backend
cd bungApp-backend
```

#### B. Database Bağlantısı (.env)
```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=aorkunere13_bungapp
DB_USERNAME=aorkunere13_bungapp
DB_PASSWORD=5oEEoZAi&,Yi
```

#### C. Laravel Konfigürasyonu
```bash
# .env dosyasını kopyala
cp .env.example .env

# Application key oluştur
php artisan key:generate

# Database migration
php artisan migrate

# Storage link
php artisan storage:link
```

### 3. API Endpoints

#### A. Routes (routes/api.php)
```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('profile', [AuthController::class, 'profile'])->middleware('auth:sanctum');
});

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Bungalows
    Route::apiResource('bungalows', BungalowController::class);
    
    // Customers
    Route::apiResource('customers', CustomerController::class);
    
    // Reservations
    Route::apiResource('reservations', ReservationController::class);
    Route::post('reservations/{id}/cancel', [ReservationController::class, 'cancel']);
    Route::post('reservations/{id}/postpone', [ReservationController::class, 'postpone']);
    Route::post('reservations/{id}/payment', [ReservationController::class, 'addPayment']);
    
    // Reports
    Route::prefix('reports')->group(function () {
        Route::get('dashboard', [ReportController::class, 'dashboard']);
        Route::get('revenue', [ReportController::class, 'revenue']);
        Route::get('occupancy', [ReportController::class, 'occupancy']);
    });
});
```

### 4. Database Migration Dosyaları

#### A. Users Table
```php
// database/migrations/xxxx_xx_xx_create_users_table.php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->string('role')->default('admin');
    $table->rememberToken();
    $table->timestamps();
});
```

#### B. Bungalows Table
```php
// database/migrations/xxxx_xx_xx_create_bungalows_table.php
Schema::create('bungalows', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('description')->nullable();
    $table->integer('capacity');
    $table->decimal('price_per_night', 10, 2);
    $table->string('status')->default('active');
    $table->json('amenities')->nullable();
    $table->string('image')->nullable();
    $table->timestamps();
});
```

#### C. Customers Table
```php
// database/migrations/xxxx_xx_xx_create_customers_table.php
Schema::create('customers', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('phone');
    $table->string('tc_no')->nullable();
    $table->date('birth_date')->nullable();
    $table->text('address')->nullable();
    $table->string('status')->default('active');
    $table->timestamps();
});
```

#### D. Reservations Table
```php
// database/migrations/xxxx_xx_xx_create_reservations_table.php
Schema::create('reservations', function (Blueprint $table) {
    $table->id();
    $table->string('reservation_code')->unique();
    $table->foreignId('bungalow_id')->constrained()->onDelete('cascade');
    $table->foreignId('customer_id')->constrained()->onDelete('cascade');
    $table->date('check_in');
    $table->date('check_out');
    $table->integer('guest_count');
    $table->decimal('total_amount', 10, 2);
    $table->decimal('paid_amount', 10, 2)->default(0);
    $table->string('status')->default('pending');
    $table->string('payment_status')->default('pending');
    $table->text('notes')->nullable();
    $table->timestamps();
});
```

### 5. CORS Konfigürasyonu

#### A. config/cors.php
```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['https://aorkuneren.com'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

### 6. Sunucu Konfigürasyonu

#### A. .htaccess (Apache)
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

#### B. Nginx Konfigürasyonu
```nginx
server {
    listen 80;
    server_name aorkuneren.com;
    root /path/to/bungapp-backend/public;
    
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    
    index index.php;
    
    charset utf-8;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }
    
    error_page 404 /index.php;
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 7. Test Adımları

#### A. Frontend Test
1. https://aorkuneren.com adresine git
2. Login sayfasının yüklendiğini kontrol et
3. Console'da hata olmadığını kontrol et

#### B. Backend Test
1. https://aorkuneren.com/api/test endpoint'ini test et
2. Database bağlantısını kontrol et
3. API response'larını kontrol et

### 8. Güvenlik

#### A. SSL Sertifikası
- Let's Encrypt ile ücretsiz SSL
- HTTPS yönlendirmesi

#### B. Firewall
- Gereksiz portları kapat
- SSH erişimini sınırla

#### C. Backup
- Database backup
- Dosya backup
- Otomatik backup scripti

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Log dosyalarını kontrol edin
2. Database bağlantısını test edin
3. API endpoint'lerini test edin
4. Browser console'da hataları kontrol edin
