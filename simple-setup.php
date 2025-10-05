<?php
// Basit Database Setup Script
// Bu script database tablolarını oluşturur ve admin kullanıcısını ekler

// Database bilgileri
$host = 'localhost';
$dbname = 'aorkunere13_bungapp';
$username = 'aorkunere13_bungapp';
$password = '5oEEoZAi&,Yi';

echo "<h2>🚀 Basit Database Setup</h2>";
echo "<hr>";

try {
    // PDO bağlantısı oluştur
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
    
    echo "<p style='color: green;'>✅ Database bağlantısı başarılı!</p>";
    
    // 1. Users Tablosu
    echo "<h3>📋 Users tablosu oluşturuluyor...</h3>";
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        email_verified_at TIMESTAMP NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        status VARCHAR(50) DEFAULT 'active',
        remember_token VARCHAR(100) NULL,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    $pdo->exec($sql);
    echo "<p style='color: green;'>✅ Users tablosu oluşturuldu!</p>";
    
    // 2. Bungalows Tablosu
    echo "<h3>📋 Bungalows tablosu oluşturuluyor...</h3>";
    $sql = "CREATE TABLE IF NOT EXISTS bungalows (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        capacity INT NOT NULL,
        price_per_night DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        amenities JSON NULL,
        image VARCHAR(255) NULL,
        notes TEXT NULL,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    $pdo->exec($sql);
    echo "<p style='color: green;'>✅ Bungalows tablosu oluşturuldu!</p>";
    
    // 3. Customers Tablosu
    echo "<h3>📋 Customers tablosu oluşturuluyor...</h3>";
    $sql = "CREATE TABLE IF NOT EXISTS customers (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        tc_no VARCHAR(11) NULL,
        birth_date DATE NULL,
        address TEXT NULL,
        status VARCHAR(50) DEFAULT 'active',
        notes TEXT NULL,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    $pdo->exec($sql);
    echo "<p style='color: green;'>✅ Customers tablosu oluşturuldu!</p>";
    
    // 4. Reservations Tablosu
    echo "<h3>📋 Reservations tablosu oluşturuluyor...</h3>";
    $sql = "CREATE TABLE IF NOT EXISTS reservations (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        reservation_code VARCHAR(50) UNIQUE NOT NULL,
        bungalow_id BIGINT UNSIGNED NOT NULL,
        customer_id BIGINT UNSIGNED NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        guest_count INT NOT NULL DEFAULT 1,
        total_amount DECIMAL(10,2) NOT NULL,
        paid_amount DECIMAL(10,2) DEFAULT 0.00,
        status VARCHAR(50) DEFAULT 'pending',
        payment_status VARCHAR(50) DEFAULT 'pending',
        notes TEXT NULL,
        cancellation_reason TEXT NULL,
        cancelled_at TIMESTAMP NULL,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (bungalow_id) REFERENCES bungalows(id) ON DELETE CASCADE,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    $pdo->exec($sql);
    echo "<p style='color: green;'>✅ Reservations tablosu oluşturuldu!</p>";
    
    // 5. Payments Tablosu
    echo "<h3>📋 Payments tablosu oluşturuluyor...</h3>";
    $sql = "CREATE TABLE IF NOT EXISTS payments (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        reservation_id BIGINT UNSIGNED NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'cash',
        status VARCHAR(50) DEFAULT 'completed',
        notes TEXT NULL,
        reference_number VARCHAR(100) NULL,
        payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    $pdo->exec($sql);
    echo "<p style='color: green;'>✅ Payments tablosu oluşturuldu!</p>";
    
    // 6. Personal Access Tokens Tablosu
    echo "<h3>📋 Personal Access Tokens tablosu oluşturuluyor...</h3>";
    $sql = "CREATE TABLE IF NOT EXISTS personal_access_tokens (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        tokenable_type VARCHAR(255) NOT NULL,
        tokenable_id BIGINT UNSIGNED NOT NULL,
        name VARCHAR(255) NOT NULL,
        token VARCHAR(64) UNIQUE NOT NULL,
        abilities TEXT NULL,
        last_used_at TIMESTAMP NULL,
        expires_at TIMESTAMP NULL,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    $pdo->exec($sql);
    echo "<p style='color: green;'>✅ Personal Access Tokens tablosu oluşturuldu!</p>";
    
    // Admin kullanıcısını oluştur
    echo "<h3>👤 Admin kullanıcısı oluşturuluyor...</h3>";
    $sql = "INSERT INTO users (name, email, password, role, status, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE 
            name = VALUES(name),
            password = VALUES(password),
            role = VALUES(role),
            status = VALUES(status),
            updated_at = NOW()";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'Admin',
        'admin@aorkuneren.com',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
        'admin',
        'active'
    ]);
    echo "<p style='color: green;'>✅ Admin kullanıcısı oluşturuldu!</p>";
    
    // Admin kullanıcısını kontrol et
    $stmt = $pdo->prepare("SELECT id, name, email, role, status FROM users WHERE email = ?");
    $stmt->execute(['admin@aorkuneren.com']);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        echo "<h3>👤 Admin Kullanıcı Bilgileri:</h3>";
        echo "<ul>";
        echo "<li><strong>ID:</strong> " . $admin['id'] . "</li>";
        echo "<li><strong>Name:</strong> " . $admin['name'] . "</li>";
        echo "<li><strong>Email:</strong> " . $admin['email'] . "</li>";
        echo "<li><strong>Role:</strong> " . $admin['role'] . "</li>";
        echo "<li><strong>Status:</strong> " . $admin['status'] . "</li>";
        echo "</ul>";
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
