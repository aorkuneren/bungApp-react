<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BungalowController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::get('/test', function () {
    return response()->json([
        'message' => 'BungApp API is working!',
        'timestamp' => now(),
        'version' => '1.0.0'
    ]);
});

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
    Route::get('bungalows/{id}/stats', [BungalowController::class, 'getStats']);
    Route::get('bungalows/{id}/reservations', [BungalowController::class, 'getReservations']);
    Route::get('bungalows/{id}/availability', [BungalowController::class, 'checkAvailability']);
    Route::get('bungalows/{id}/calendar', [BungalowController::class, 'getCalendar']);
    
    // Customers
    Route::apiResource('customers', CustomerController::class);
    Route::get('customers/search', [CustomerController::class, 'search']);
    Route::get('customers/{id}/stats', [CustomerController::class, 'getStats']);
    Route::get('customers/{id}/reservations', [CustomerController::class, 'getReservations']);
    Route::patch('customers/{id}/status', [CustomerController::class, 'updateStatus']);
    Route::get('customers/email/{email}', [CustomerController::class, 'getByEmail']);
    Route::get('customers/phone/{phone}', [CustomerController::class, 'getByPhone']);
    
    // Reservations
    Route::apiResource('reservations', ReservationController::class);
    Route::post('reservations/{id}/cancel', [ReservationController::class, 'cancel']);
    Route::post('reservations/{id}/postpone', [ReservationController::class, 'postpone']);
    Route::post('reservations/{id}/payment', [ReservationController::class, 'addPayment']);
    Route::get('reservations/{id}/payments', [ReservationController::class, 'getPayments']);
    Route::get('reservations/check-availability', [ReservationController::class, 'checkAvailability']);
    Route::post('reservations/calculate-price', [ReservationController::class, 'calculatePrice']);
    Route::get('reservations/today-checkins', [ReservationController::class, 'getTodayCheckIns']);
    Route::get('reservations/today-checkouts', [ReservationController::class, 'getTodayCheckOuts']);
    Route::get('reservations/upcoming', [ReservationController::class, 'getUpcoming']);
    Route::patch('reservations/{id}/status', [ReservationController::class, 'updateStatus']);
    Route::get('reservations/generate-code', [ReservationController::class, 'generateCode']);
    
    // Reports
    Route::prefix('reports')->group(function () {
        Route::get('dashboard', [ReportController::class, 'dashboard']);
        Route::get('revenue', [ReportController::class, 'revenue']);
        Route::get('occupancy', [ReportController::class, 'occupancy']);
        Route::get('customers', [ReportController::class, 'customers']);
        Route::get('bungalows', [ReportController::class, 'bungalows']);
        Route::get('monthly', [ReportController::class, 'monthly']);
        Route::get('yearly', [ReportController::class, 'yearly']);
        Route::get('reservation-status', [ReportController::class, 'reservationStatus']);
        Route::get('payment-status', [ReportController::class, 'paymentStatus']);
        Route::get('export/{type}', [ReportController::class, 'export']);
        Route::get('comparison/{type}', [ReportController::class, 'comparison']);
    });
    
    // Profile
    Route::prefix('profile')->group(function () {
        Route::put('update', [AuthController::class, 'updateProfile']);
        Route::post('password', [AuthController::class, 'changePassword']);
    });
    
    // Settings
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingsController::class, 'index']);
        Route::get('general', [SettingsController::class, 'getGeneral']);
        Route::put('general', [SettingsController::class, 'updateGeneral']);
        Route::get('notifications', [SettingsController::class, 'getNotifications']);
        Route::put('notifications', [SettingsController::class, 'updateNotifications']);
        Route::get('security', [SettingsController::class, 'getSecurity']);
        Route::put('security', [SettingsController::class, 'updateSecurity']);
        Route::get('reservations', [SettingsController::class, 'getReservations']);
        Route::put('reservations', [SettingsController::class, 'updateReservations']);
        Route::get('payments', [SettingsController::class, 'getPayments']);
        Route::put('payments', [SettingsController::class, 'updatePayments']);
    });
});
