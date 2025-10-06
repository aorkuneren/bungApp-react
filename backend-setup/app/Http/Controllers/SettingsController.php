<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    /**
     * Get all settings
     */
    public function index(): JsonResponse
    {
        try {
            $settings = DB::table('settings')->get()->pluck('value', 'key');
            
            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ayarlar getirilemedi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get general settings
     */
    public function getGeneral(): JsonResponse
    {
        try {
            $settings = DB::table('settings')
                ->whereIn('key', ['site_name', 'site_description', 'timezone'])
                ->get()
                ->pluck('value', 'key');
            
            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Genel ayarlar getirilemedi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update general settings
     */
    public function updateGeneral(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'siteName' => 'required|string|max:255',
                'siteDescription' => 'required|string|max:500',
                'timezone' => 'required|string|max:50'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Geçersiz veri',
                    'errors' => $validator->errors()
                ], 422);
            }

            $settings = [
                'site_name' => $request->siteName,
                'site_description' => $request->siteDescription,
                'timezone' => $request->timezone
            ];

            foreach ($settings as $key => $value) {
                DB::table('settings')->updateOrInsert(
                    ['key' => $key],
                    ['value' => $value, 'updated_at' => now()]
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Genel ayarlar başarıyla güncellendi',
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Genel ayarlar güncellenemedi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get notification settings
     */
    public function getNotifications(): JsonResponse
    {
        try {
            $settings = DB::table('settings')
                ->whereIn('key', [
                    'email_notifications', 
                    'sms_notifications', 
                    'reservation_alerts', 
                    'payment_alerts', 
                    'system_alerts'
                ])
                ->get()
                ->pluck('value', 'key');
            
            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bildirim ayarları getirilemedi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update notification settings
     */
    public function updateNotifications(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'emailNotifications' => 'required|boolean',
                'smsNotifications' => 'required|boolean',
                'reservationAlerts' => 'required|boolean',
                'paymentAlerts' => 'required|boolean',
                'systemAlerts' => 'required|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Geçersiz veri',
                    'errors' => $validator->errors()
                ], 422);
            }

            $settings = [
                'email_notifications' => $request->emailNotifications ? '1' : '0',
                'sms_notifications' => $request->smsNotifications ? '1' : '0',
                'reservation_alerts' => $request->reservationAlerts ? '1' : '0',
                'payment_alerts' => $request->paymentAlerts ? '1' : '0',
                'system_alerts' => $request->systemAlerts ? '1' : '0'
            ];

            foreach ($settings as $key => $value) {
                DB::table('settings')->updateOrInsert(
                    ['key' => $key],
                    ['value' => $value, 'updated_at' => now()]
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Bildirim ayarları başarıyla güncellendi',
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bildirim ayarları güncellenemedi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get security settings
     */
    public function getSecurity(): JsonResponse
    {
        try {
            $settings = DB::table('settings')
                ->whereIn('key', [
                    'two_factor_auth', 
                    'session_timeout', 
                    'password_expiry', 
                    'login_attempts'
                ])
                ->get()
                ->pluck('value', 'key');
            
            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Güvenlik ayarları getirilemedi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update security settings
     */
    public function updateSecurity(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'twoFactorAuth' => 'required|boolean',
                'sessionTimeout' => 'required|integer|min:5|max:480',
                'passwordExpiry' => 'required|integer|min:30|max:365',
                'loginAttempts' => 'required|integer|min:3|max:10'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Geçersiz veri',
                    'errors' => $validator->errors()
                ], 422);
            }

            $settings = [
                'two_factor_auth' => $request->twoFactorAuth ? '1' : '0',
                'session_timeout' => $request->sessionTimeout,
                'password_expiry' => $request->passwordExpiry,
                'login_attempts' => $request->loginAttempts
            ];

            foreach ($settings as $key => $value) {
                DB::table('settings')->updateOrInsert(
                    ['key' => $key],
                    ['value' => $value, 'updated_at' => now()]
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Güvenlik ayarları başarıyla güncellendi',
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Güvenlik ayarları güncellenemedi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get reservation settings
     */
    public function getReservations(): JsonResponse
    {
        try {
            $settings = DB::table('settings')
                ->whereIn('key', [
                    'advance_booking_days', 
                    'cancellation_policy', 
                    'deposit_required', 
                    'deposit_percentage',
                    'max_occupancy',
                    'check_in_time',
                    'check_out_time'
                ])
                ->get()
                ->pluck('value', 'key');
            
            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Rezervasyon ayarları getirilemedi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update reservation settings
     */
    public function updateReservations(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'advanceBookingDays' => 'required|integer|min:1|max:365',
                'cancellationPolicy' => 'required|string|max:500',
                'depositRequired' => 'required|boolean',
                'depositPercentage' => 'required|integer|min:0|max:100',
                'maxOccupancy' => 'required|integer|min:1|max:20',
                'checkInTime' => 'required|string|max:10',
                'checkOutTime' => 'required|string|max:10'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Geçersiz veri',
                    'errors' => $validator->errors()
                ], 422);
            }

            $settings = [
                'advance_booking_days' => $request->advanceBookingDays,
                'cancellation_policy' => $request->cancellationPolicy,
                'deposit_required' => $request->depositRequired ? '1' : '0',
                'deposit_percentage' => $request->depositPercentage,
                'max_occupancy' => $request->maxOccupancy,
                'check_in_time' => $request->checkInTime,
                'check_out_time' => $request->checkOutTime
            ];

            foreach ($settings as $key => $value) {
                DB::table('settings')->updateOrInsert(
                    ['key' => $key],
                    ['value' => $value, 'updated_at' => now()]
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Rezervasyon ayarları başarıyla güncellendi',
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Rezervasyon ayarları güncellenemedi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment settings
     */
    public function getPayments(): JsonResponse
    {
        try {
            $settings = DB::table('settings')
                ->whereIn('key', [
                    'payment_methods', 
                    'tax_rate', 
                    'service_fee'
                ])
                ->get()
                ->pluck('value', 'key');
            
            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ödeme ayarları getirilemedi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update payment settings
     */
    public function updatePayments(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'paymentMethods' => 'required|array',
                'paymentMethods.*' => 'required|string|in:credit_card,bank_transfer,cash',
                'taxRate' => 'required|numeric|min:0|max:100',
                'serviceFee' => 'required|numeric|min:0|max:1000'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Geçersiz veri',
                    'errors' => $validator->errors()
                ], 422);
            }

            $settings = [
                'payment_methods' => json_encode($request->paymentMethods),
                'tax_rate' => $request->taxRate,
                'service_fee' => $request->serviceFee
            ];

            foreach ($settings as $key => $value) {
                DB::table('settings')->updateOrInsert(
                    ['key' => $key],
                    ['value' => $value, 'updated_at' => now()]
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Ödeme ayarları başarıyla güncellendi',
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ödeme ayarları güncellenemedi: ' . $e->getMessage()
            ], 500);
        }
    }
}