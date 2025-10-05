-- Admin Kullanıcısı Oluşturma
-- Bu script admin kullanıcısını oluşturur

USE aorkunere13_bungapp;

-- Admin kullanıcısını oluştur
INSERT INTO users (name, email, password, role, status, created_at, updated_at) 
VALUES (
    'Admin',
    'admin@aorkuneren.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'admin',
    'active',
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    password = VALUES(password),
    role = VALUES(role),
    status = VALUES(status),
    updated_at = NOW();

-- Admin kullanıcısının oluşturulduğunu kontrol et
SELECT 
    id,
    name,
    email,
    role,
    status,
    created_at
FROM users 
WHERE email = 'admin@aorkuneren.com';

-- Toplam kullanıcı sayısını göster
SELECT COUNT(*) as total_users FROM users;
