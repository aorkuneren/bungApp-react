#!/bin/bash

# Laravel Backend Installation Script
# Bu script Laravel backend'i sunucuya kurar

echo "🚀 Laravel Backend Kurulumu Başlıyor..."

# Renkli output için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database Bilgileri
DB_HOST="localhost"
DB_NAME="aorkunere13_bungapp"
DB_USER="aorkunere13_bungapp"
DB_PASS="5oEEoZAi&,Yi"

echo -e "${BLUE}📦 Laravel projesi oluşturuluyor...${NC}"

# Laravel projesi oluştur
composer create-project laravel/laravel bungapp-backend

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Laravel projesi oluşturuldu!${NC}"
else
    echo -e "${RED}❌ Laravel projesi oluşturulamadı!${NC}"
    exit 1
fi

cd bungapp-backend

echo -e "${BLUE}🔧 Environment dosyası ayarlanıyor...${NC}"

# .env dosyasını güncelle
cat > .env << EOF
APP_NAME=BungApp
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://aorkuneren.com

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=$DB_HOST
DB_PORT=3306
DB_DATABASE=$DB_NAME
DB_USERNAME=$DB_USER
DB_PASSWORD=$DB_PASS

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@aorkuneren.com"
MAIL_FROM_NAME="\${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_PUSHER_APP_KEY="\${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="\${PUSHER_HOST}"
VITE_PUSHER_PORT="\${PUSHER_PORT}"
VITE_PUSHER_SCHEME="\${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="\${PUSHER_APP_CLUSTER}"

SANCTUM_STATEFUL_DOMAINS=aorkuneren.com
EOF

echo -e "${BLUE}🔑 Application key oluşturuluyor...${NC}"
php artisan key:generate

echo -e "${BLUE}📊 Database migration'ları çalıştırılıyor...${NC}"
php artisan migrate

echo -e "${BLUE}🌱 Database seeder'ları çalıştırılıyor...${NC}"
php artisan db:seed

echo -e "${BLUE}🔗 Storage link oluşturuluyor...${NC}"
php artisan storage:link

echo -e "${BLUE}📁 CORS konfigürasyonu ayarlanıyor...${NC}"

# CORS konfigürasyonu
cat > config/cors.php << 'EOF'
<?php

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
EOF

echo -e "${BLUE}🔒 Sanctum konfigürasyonu ayarlanıyor...${NC}"

# Sanctum konfigürasyonu
cat > config/sanctum.php << 'EOF'
<?php

use Laravel\Sanctum\Sanctum;

return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
        Sanctum::currentApplicationUrlWithPort()
    ))),

    'guard' => ['web'],

    'expiration' => null,

    'middleware' => [
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
    ],
];
EOF

echo -e "${GREEN}🎉 Laravel backend kurulumu tamamlandı!${NC}"

echo -e "${YELLOW}📋 Sonraki adımlar:${NC}"
echo "1. Backend dosyalarını sunucuya yükle"
echo "2. Web server konfigürasyonunu yap"
echo "3. API endpoint'lerini test et"
echo "4. Frontend ile entegrasyonu test et"

echo -e "${BLUE}🔗 Test URL'leri:${NC}"
echo "API Test: https://aorkuneren.com/api/test"
echo "Login: https://aorkuneren.com/api/auth/login"

echo -e "${YELLOW}📝 Admin Giriş Bilgileri:${NC}"
echo "Email: admin@aorkuneren.com"
echo "Password: admin123"
