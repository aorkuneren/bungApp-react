<?php
// Database Bağlantı Test Script'i
// Bu dosya database bağlantısını test eder

// Database bilgileri
$host = 'localhost';
$dbname = 'aorkunere13_bungapp';
$username = 'aorkunere13_bungapp';
$password = '5oEEoZAi&,Yi';

echo "<h2>🔍 Database Bağlantı Testi</h2>";
echo "<hr>";

try {
    // PDO bağlantısı oluştur
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<p style='color: green;'>✅ Database bağlantısı başarılı!</p>";
    
    // Database bilgilerini göster
    echo "<h3>📊 Database Bilgileri:</h3>";
    echo "<ul>";
    echo "<li><strong>Host:</strong> $host</li>";
    echo "<li><strong>Database:</strong> $dbname</li>";
    echo "<li><strong>Username:</strong> $username</li>";
    echo "<li><strong>Charset:</strong> utf8mb4</li>";
    echo "</ul>";
    
    // Mevcut tabloları listele
    echo "<h3>📋 Mevcut Tablolar:</h3>";
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (empty($tables)) {
        echo "<p style='color: orange;'>⚠️ Database boş - hiç tablo yok</p>";
    } else {
        echo "<ul>";
        foreach ($tables as $table) {
            echo "<li>$table</li>";
        }
        echo "</ul>";
    }
    
    // MySQL versiyonunu göster
    $stmt = $pdo->query("SELECT VERSION() as version");
    $version = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p><strong>MySQL Versiyonu:</strong> " . $version['version'] . "</p>";
    
    // Database boyutunu göster
    $stmt = $pdo->query("SELECT 
        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'DB Size in MB' 
        FROM information_schema.tables 
        WHERE table_schema = '$dbname'");
    $size = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p><strong>Database Boyutu:</strong> " . $size['DB Size in MB'] . " MB</p>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Database bağlantı hatası: " . $e->getMessage() . "</p>";
    
    // Hata detayları
    echo "<h3>🔧 Hata Detayları:</h3>";
    echo "<ul>";
    echo "<li><strong>Hata Kodu:</strong> " . $e->getCode() . "</li>";
    echo "<li><strong>Hata Mesajı:</strong> " . $e->getMessage() . "</li>";
    echo "<li><strong>Dosya:</strong> " . $e->getFile() . "</li>";
    echo "<li><strong>Satır:</strong> " . $e->getLine() . "</li>";
    echo "</ul>";
    
    // Olası çözümler
    echo "<h3>💡 Olası Çözümler:</h3>";
    echo "<ul>";
    echo "<li>Database bilgilerini kontrol edin</li>";
    echo "<li>MySQL servisinin çalıştığını kontrol edin</li>";
    echo "<li>Kullanıcı yetkilerini kontrol edin</li>";
    echo "<li>Firewall ayarlarını kontrol edin</li>";
    echo "</ul>";
}

echo "<hr>";
echo "<p><em>Test tarihi: " . date('Y-m-d H:i:s') . "</em></p>";
?>
