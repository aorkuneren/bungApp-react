<?php
// Database Setup Script
// Bu script database tablolarını oluşturur ve admin kullanıcısını ekler

// Database bilgileri
$host = 'localhost';
$dbname = 'aorkunere13_bungapp';
$username = 'aorkunere13_bungapp';
$password = '5oEEoZAi&,Yi';

echo "<h2>🚀 Database Setup</h2>";
echo "<hr>";

try {
    // PDO bağlantısı oluştur
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
    
    echo "<p style='color: green;'>✅ Database bağlantısı başarılı!</p>";
    
    // SQL dosyasını oku ve çalıştır
    echo "<h3>📋 Tablolar oluşturuluyor...</h3>";
    
    $sql = file_get_contents('create-tables.sql');
    if ($sql === false) {
        throw new Exception("create-tables.sql dosyası okunamadı!");
    }
    
    // SQL komutlarını ayır ve çalıştır
    $statements = explode(';', $sql);
    $created_tables = [];
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement) && !preg_match('/^(USE|SELECT)/i', $statement)) {
            try {
                $stmt = $pdo->prepare($statement);
                $stmt->execute();
                $stmt->closeCursor(); // Cursor'ı kapat
                
                if (preg_match('/CREATE TABLE.*?`?(\w+)`?/i', $statement, $matches)) {
                    $created_tables[] = $matches[1];
                }
            } catch (PDOException $e) {
                if (strpos($e->getMessage(), 'already exists') === false) {
                    echo "<p style='color: orange;'>⚠️ Uyarı: " . $e->getMessage() . "</p>";
                }
            }
        }
    }
    
    echo "<p style='color: green;'>✅ Tablolar oluşturuldu!</p>";
    echo "<ul>";
    foreach ($created_tables as $table) {
        echo "<li>$table</li>";
    }
    echo "</ul>";
    
    // Admin kullanıcısını oluştur
    echo "<h3>👤 Admin kullanıcısı oluşturuluyor...</h3>";
    
    $admin_sql = file_get_contents('insert-admin.sql');
    if ($admin_sql === false) {
        throw new Exception("insert-admin.sql dosyası okunamadı!");
    }
    
    $admin_statements = explode(';', $admin_sql);
    foreach ($admin_statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement) && !preg_match('/^(USE|SELECT)/i', $statement)) {
            try {
                $stmt = $pdo->prepare($statement);
                $stmt->execute();
                $stmt->closeCursor(); // Cursor'ı kapat
            } catch (PDOException $e) {
                echo "<p style='color: orange;'>⚠️ Uyarı: " . $e->getMessage() . "</p>";
            }
        }
    }
    
    // Admin kullanıcısını kontrol et
    $stmt = $pdo->prepare("SELECT id, name, email, role, status FROM users WHERE email = ?");
    $stmt->execute(['admin@aorkuneren.com']);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        echo "<p style='color: green;'>✅ Admin kullanıcısı oluşturuldu!</p>";
        echo "<ul>";
        echo "<li><strong>ID:</strong> " . $admin['id'] . "</li>";
        echo "<li><strong>Name:</strong> " . $admin['name'] . "</li>";
        echo "<li><strong>Email:</strong> " . $admin['email'] . "</li>";
        echo "<li><strong>Role:</strong> " . $admin['role'] . "</li>";
        echo "<li><strong>Status:</strong> " . $admin['status'] . "</li>";
        echo "</ul>";
    } else {
        echo "<p style='color: red;'>❌ Admin kullanıcısı oluşturulamadı!</p>";
    }
    
    // Tablo sayısını göster
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "<p><strong>Toplam Tablo Sayısı:</strong> " . count($tables) . "</p>";
    
    // Kullanıcı sayısını göster
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $user_count = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p><strong>Toplam Kullanıcı Sayısı:</strong> " . $user_count['count'] . "</p>";
    
    echo "<hr>";
    echo "<h3>🎉 Database Setup Tamamlandı!</h3>";
    echo "<p><strong>Giriş Bilgileri:</strong></p>";
    echo "<ul>";
    echo "<li><strong>Email:</strong> admin@aorkuneren.com</li>";
    echo "<li><strong>Password:</strong> password</li>";
    echo "</ul>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Hata: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<p><em>Setup tarihi: " . date('Y-m-d H:i:s') . "</em></p>";
?>
