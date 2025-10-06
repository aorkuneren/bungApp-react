<?php
// Database connection details
$host = 'localhost';
$dbname = 'aorkunere13_bungapp';
$username = 'aorkunere13_bungapp';
$password = '5oEEoZAi&,Yi';

echo "<h2>🚀 Settings Table Setup</h2>";
echo "<hr>";

try {
    // PDO bağlantısı oluştur
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
    
    echo "<p style='color: green;'>✅ Database bağlantısı başarılı!</p>";
    
    echo "<h3>📋 Settings tablosu oluşturuluyor...</h3>";

    // Settings tablosunu oluştur
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS settings (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `key` VARCHAR(191) NOT NULL UNIQUE,
            `value` TEXT NOT NULL,
            description TEXT NULL,
            created_at TIMESTAMP NULL,
            updated_at TIMESTAMP NULL
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ");
    echo "<p style='color: green;'>✅ Settings tablosu oluşturuldu!</p>";

    // Varsayılan ayarları ekle
    echo "<h3>⚙️ Varsayılan ayarlar ekleniyor...</h3>";
    
    $defaultSettings = [
        // Genel Ayarlar
        ['site_name', 'Bungalov Yönetim Sistemi', 'Site adı'],
        ['site_description', 'Profesyonel bungalov rezervasyon yönetimi', 'Site açıklaması'],
        ['timezone', 'Europe/Istanbul', 'Saat dilimi'],
        ['language', 'tr', 'Dil (sabit)'],
        ['currency', 'TRY', 'Para birimi (sabit)'],
        
        // Bildirim Ayarları
        ['email_notifications', '1', 'Email bildirimleri'],
        ['sms_notifications', '0', 'SMS bildirimleri'],
        ['reservation_alerts', '1', 'Rezervasyon uyarıları'],
        ['payment_alerts', '1', 'Ödeme uyarıları'],
        ['system_alerts', '1', 'Sistem uyarıları'],
        
        // Güvenlik Ayarları
        ['two_factor_auth', '0', 'İki faktörlü kimlik doğrulama'],
        ['session_timeout', '30', 'Oturum zaman aşımı (dakika)'],
        ['password_expiry', '90', 'Şifre süresi (gün)'],
        ['login_attempts', '5', 'Giriş deneme sayısı'],
        
        // Rezervasyon Ayarları
        ['advance_booking_days', '365', 'İleri rezervasyon günleri'],
        ['cancellation_policy', '24 saat öncesine kadar ücretsiz iptal', 'İptal politikası'],
        ['deposit_required', '1', 'Kapora gerekli'],
        ['deposit_percentage', '20', 'Kapora yüzdesi'],
        ['max_occupancy', '6', 'Maksimum kapasite'],
        ['check_in_time', '14:00', 'Giriş saati'],
        ['check_out_time', '11:00', 'Çıkış saati'],
        
        // Ödeme Ayarları
        ['payment_methods', '["credit_card","bank_transfer","cash"]', 'Ödeme yöntemleri'],
        ['tax_rate', '18', 'Vergi oranı (%)'],
        ['service_fee', '0', 'Hizmet ücreti'],
    ];

    $stmt = $pdo->prepare("
        INSERT INTO settings (`key`, `value`, description, created_at, updated_at)
        VALUES (?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
            `value` = VALUES(`value`),
            description = VALUES(description),
            updated_at = NOW()
    ");

    $insertedCount = 0;
    foreach ($defaultSettings as $setting) {
        $stmt->execute($setting);
        $insertedCount++;
    }

    echo "<p style='color: green;'>✅ $insertedCount ayar başarıyla eklendi/güncellendi!</p>";

    // Ayarları listele
    echo "<h3>📋 Mevcut Ayarlar:</h3>";
    $stmt = $pdo->query("SELECT `key`, `value`, description FROM settings ORDER BY `key`");
    $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr style='background-color: #f0f0f0;'>";
    echo "<th style='padding: 8px;'>Key</th>";
    echo "<th style='padding: 8px;'>Value</th>";
    echo "<th style='padding: 8px;'>Description</th>";
    echo "</tr>";

    foreach ($settings as $setting) {
        echo "<tr>";
        echo "<td style='padding: 8px;'>" . htmlspecialchars($setting['key']) . "</td>";
        echo "<td style='padding: 8px;'>" . htmlspecialchars($setting['value']) . "</td>";
        echo "<td style='padding: 8px;'>" . htmlspecialchars($setting['description']) . "</td>";
        echo "</tr>";
    }
    echo "</table>";

} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Hata: " . $e->getMessage() . "</p>";
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Hata: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<p>Setup tarihi: " . date('Y-m-d H:i:s') . "</p>";
?>
