<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        DB::table('settings')->insert([
            // Genel Ayarlar
            ['key' => 'site_name', 'value' => 'Bungalov Yönetim Sistemi', 'description' => 'Site adı', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'site_description', 'value' => 'Profesyonel bungalov rezervasyon yönetimi', 'description' => 'Site açıklaması', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'timezone', 'value' => 'Europe/Istanbul', 'description' => 'Saat dilimi', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'language', 'value' => 'tr', 'description' => 'Dil (sabit)', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'currency', 'value' => 'TRY', 'description' => 'Para birimi (sabit)', 'created_at' => now(), 'updated_at' => now()],
            
            // Bildirim Ayarları
            ['key' => 'email_notifications', 'value' => '1', 'description' => 'Email bildirimleri', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'sms_notifications', 'value' => '0', 'description' => 'SMS bildirimleri', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'reservation_alerts', 'value' => '1', 'description' => 'Rezervasyon uyarıları', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'payment_alerts', 'value' => '1', 'description' => 'Ödeme uyarıları', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'system_alerts', 'value' => '1', 'description' => 'Sistem uyarıları', 'created_at' => now(), 'updated_at' => now()],
            
            // Güvenlik Ayarları
            ['key' => 'two_factor_auth', 'value' => '0', 'description' => 'İki faktörlü kimlik doğrulama', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'session_timeout', 'value' => '30', 'description' => 'Oturum zaman aşımı (dakika)', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'password_expiry', 'value' => '90', 'description' => 'Şifre süresi (gün)', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'login_attempts', 'value' => '5', 'description' => 'Giriş deneme sayısı', 'created_at' => now(), 'updated_at' => now()],
            
            // Rezervasyon Ayarları
            ['key' => 'advance_booking_days', 'value' => '365', 'description' => 'İleri rezervasyon günleri', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'cancellation_policy', 'value' => '24 saat öncesine kadar ücretsiz iptal', 'description' => 'İptal politikası', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'deposit_required', 'value' => '1', 'description' => 'Kapora gerekli', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'deposit_percentage', 'value' => '20', 'description' => 'Kapora yüzdesi', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'max_occupancy', 'value' => '6', 'description' => 'Maksimum kapasite', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'check_in_time', 'value' => '14:00', 'description' => 'Giriş saati', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'check_out_time', 'value' => '11:00', 'description' => 'Çıkış saati', 'created_at' => now(), 'updated_at' => now()],
            
            // Ödeme Ayarları
            ['key' => 'payment_methods', 'value' => '["credit_card","bank_transfer","cash"]', 'description' => 'Ödeme yöntemleri', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'tax_rate', 'value' => '18', 'description' => 'Vergi oranı (%)', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'service_fee', 'value' => '0', 'description' => 'Hizmet ücreti', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
