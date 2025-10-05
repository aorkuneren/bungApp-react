#!/bin/bash

# BungApp Deployment Script
# Bu script projeyi production sunucusuna deploy eder

echo "🚀 BungApp Deployment Başlıyor..."

# Renkli output için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# FTP Bilgileri
FTP_HOST="ftp.aorkuneren.com"
FTP_USER="demoaorkun@demo.aorkuneren.com"
FTP_PASS="D*~eGa;Yo7{U"
FTP_DIR="/public_html"

# Database Bilgileri
DB_HOST="localhost"
DB_NAME="aorkunere13_bungapp"
DB_USER="aorkunere13_bungapp"
DB_PASS="5oEEoZAi&,Yi"

echo -e "${BLUE}📦 Production build oluşturuluyor...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build başarılı!${NC}"
else
    echo -e "${RED}❌ Build başarısız!${NC}"
    exit 1
fi

echo -e "${BLUE}📁 Build dosyaları hazırlanıyor...${NC}"

# Build dosyalarını geçici klasöre kopyala
mkdir -p deploy-temp
cp -r build/* deploy-temp/

# .htaccess dosyası oluştur (React Router için)
cat > deploy-temp/.htaccess << 'EOF'
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
EOF

echo -e "${BLUE}🌐 FTP ile dosyalar yükleniyor...${NC}"

# FTP ile dosyaları yükle
lftp -c "
set ftp:ssl-allow no
open -u $FTP_USER,$FTP_PASS $FTP_HOST
lcd deploy-temp
cd $FTP_DIR
mirror -R --delete --verbose .
bye
"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dosyaları başarıyla yüklendi!${NC}"
else
    echo -e "${RED}❌ FTP yükleme başarısız!${NC}"
    exit 1
fi

echo -e "${BLUE}🧹 Geçici dosyalar temizleniyor...${NC}"
rm -rf deploy-temp

echo -e "${GREEN}🎉 Frontend deployment tamamlandı!${NC}"
echo -e "${YELLOW}📋 Sonraki adımlar:${NC}"
echo "1. Laravel backend'i sunucuya yükle"
echo "2. Database migration'ları çalıştır"
echo "3. API endpoint'lerini test et"
echo "4. https://aorkuneren.com adresini kontrol et"

echo -e "${BLUE}🔗 Test URL'leri:${NC}"
echo "Frontend: https://aorkuneren.com"
echo "API Test: https://aorkuneren.com/api/test"
