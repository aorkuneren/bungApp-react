<?php
// Test Settings API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection details
$host = 'localhost';
$dbname = 'aorkunere13_bungapp';
$username = 'aorkunere13_bungapp';
$password = '5oEEoZAi&,Yi';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $method = $_SERVER['REQUEST_METHOD'];
    $path = $_SERVER['REQUEST_URI'];
    
    // Parse the path
    $pathParts = explode('/', trim($path, '/'));
    $endpoint = end($pathParts);
    
    switch ($method) {
        case 'GET':
            if ($endpoint === 'general') {
                $stmt = $pdo->query("SELECT `key`, `value` FROM settings WHERE `key` IN ('site_name', 'site_description', 'timezone')");
                $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
                
                echo json_encode([
                    'success' => true,
                    'data' => $settings
                ]);
            } elseif ($endpoint === 'notifications') {
                $stmt = $pdo->query("SELECT `key`, `value` FROM settings WHERE `key` IN ('email_notifications', 'sms_notifications', 'reservation_alerts', 'payment_alerts', 'system_alerts')");
                $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
                
                echo json_encode([
                    'success' => true,
                    'data' => $settings
                ]);
            } elseif ($endpoint === 'security') {
                $stmt = $pdo->query("SELECT `key`, `value` FROM settings WHERE `key` IN ('two_factor_auth', 'session_timeout', 'password_expiry', 'login_attempts')");
                $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
                
                echo json_encode([
                    'success' => true,
                    'data' => $settings
                ]);
            } elseif ($endpoint === 'reservations') {
                $stmt = $pdo->query("SELECT `key`, `value` FROM settings WHERE `key` IN ('advance_booking_days', 'cancellation_policy', 'deposit_required', 'deposit_percentage', 'max_occupancy', 'check_in_time', 'check_out_time')");
                $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
                
                echo json_encode([
                    'success' => true,
                    'data' => $settings
                ]);
            } elseif ($endpoint === 'payments') {
                $stmt = $pdo->query("SELECT `key`, `value` FROM settings WHERE `key` IN ('payment_methods', 'tax_rate', 'service_fee')");
                $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
                
                echo json_encode([
                    'success' => true,
                    'data' => $settings
                ]);
            } else {
                echo json_encode([
                    'success' => true,
                    'message' => 'Settings API is working!',
                    'method' => $method,
                    'endpoint' => $endpoint
                ]);
            }
            break;
            
        case 'PUT':
            $input = json_decode(file_get_contents('php://input'), true);
            
            if ($endpoint === 'general') {
                $settings = [
                    'site_name' => $input['siteName'] ?? '',
                    'site_description' => $input['siteDescription'] ?? '',
                    'timezone' => $input['timezone'] ?? ''
                ];
                
                foreach ($settings as $key => $value) {
                    $stmt = $pdo->prepare("UPDATE settings SET `value` = ? WHERE `key` = ?");
                    $stmt->execute([$value, $key]);
                }
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Genel ayarlar başarıyla güncellendi',
                    'data' => $settings
                ]);
            } elseif ($endpoint === 'notifications') {
                $settings = [
                    'email_notifications' => $input['emailNotifications'] ? '1' : '0',
                    'sms_notifications' => $input['smsNotifications'] ? '1' : '0',
                    'reservation_alerts' => $input['reservationAlerts'] ? '1' : '0',
                    'payment_alerts' => $input['paymentAlerts'] ? '1' : '0',
                    'system_alerts' => $input['systemAlerts'] ? '1' : '0'
                ];
                
                foreach ($settings as $key => $value) {
                    $stmt = $pdo->prepare("UPDATE settings SET `value` = ? WHERE `key` = ?");
                    $stmt->execute([$value, $key]);
                }
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Bildirim ayarları başarıyla güncellendi',
                    'data' => $settings
                ]);
            } elseif ($endpoint === 'security') {
                $settings = [
                    'two_factor_auth' => $input['twoFactorAuth'] ? '1' : '0',
                    'session_timeout' => $input['sessionTimeout'] ?? '30',
                    'password_expiry' => $input['passwordExpiry'] ?? '90',
                    'login_attempts' => $input['loginAttempts'] ?? '5'
                ];
                
                foreach ($settings as $key => $value) {
                    $stmt = $pdo->prepare("UPDATE settings SET `value` = ? WHERE `key` = ?");
                    $stmt->execute([$value, $key]);
                }
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Güvenlik ayarları başarıyla güncellendi',
                    'data' => $settings
                ]);
            } elseif ($endpoint === 'reservations') {
                $settings = [
                    'advance_booking_days' => $input['advanceBookingDays'] ?? '365',
                    'cancellation_policy' => $input['cancellationPolicy'] ?? '',
                    'deposit_required' => $input['depositRequired'] ? '1' : '0',
                    'deposit_percentage' => $input['depositPercentage'] ?? '20',
                    'max_occupancy' => $input['maxOccupancy'] ?? '6',
                    'check_in_time' => $input['checkInTime'] ?? '14:00',
                    'check_out_time' => $input['checkOutTime'] ?? '11:00'
                ];
                
                foreach ($settings as $key => $value) {
                    $stmt = $pdo->prepare("UPDATE settings SET `value` = ? WHERE `key` = ?");
                    $stmt->execute([$value, $key]);
                }
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Rezervasyon ayarları başarıyla güncellendi',
                    'data' => $settings
                ]);
            } elseif ($endpoint === 'payments') {
                $settings = [
                    'payment_methods' => json_encode($input['paymentMethods'] ?? []),
                    'tax_rate' => $input['taxRate'] ?? '18',
                    'service_fee' => $input['serviceFee'] ?? '0'
                ];
                
                foreach ($settings as $key => $value) {
                    $stmt = $pdo->prepare("UPDATE settings SET `value` = ? WHERE `key` = ?");
                    $stmt->execute([$value, $key]);
                }
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Ödeme ayarları başarıyla güncellendi',
                    'data' => $settings
                ]);
            } else {
                echo json_encode([
                    'success' => true,
                    'message' => 'Settings updated!',
                    'data' => $input
                ]);
            }
            break;
            
        default:
            echo json_encode([
                'success' => false,
                'message' => 'Method not allowed'
            ]);
            http_response_code(405);
    }
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
    http_response_code(500);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
    http_response_code(500);
}
?>
