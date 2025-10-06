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
