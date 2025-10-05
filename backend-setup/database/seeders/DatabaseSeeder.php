<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Bungalow;
use App\Models\Customer;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@aorkuneren.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'status' => 'active',
        ]);

        // Create sample bungalows
        $bungalows = [
            [
                'name' => 'Bungalov 1',
                'description' => 'Deniz manzaralı lüks bungalov',
                'capacity' => 4,
                'price_per_night' => 500.00,
                'status' => 'active',
                'amenities' => json_encode(['WiFi', 'TV', 'Air Conditioner', 'Mini Bar', 'Balcony']),
            ],
            [
                'name' => 'Bungalov 2',
                'description' => 'Bahçe manzaralı aile bungalovu',
                'capacity' => 6,
                'price_per_night' => 750.00,
                'status' => 'active',
                'amenities' => json_encode(['WiFi', 'TV', 'Air Conditioner', 'Kitchen', 'Garden']),
            ],
            [
                'name' => 'Bungalov 3',
                'description' => 'Orman manzaralı romantik bungalov',
                'capacity' => 2,
                'price_per_night' => 400.00,
                'status' => 'active',
                'amenities' => json_encode(['WiFi', 'TV', 'Air Conditioner', 'Jacuzzi', 'Fireplace']),
            ],
        ];

        foreach ($bungalows as $bungalow) {
            Bungalow::create($bungalow);
        }

        // Create sample customers
        $customers = [
            [
                'name' => 'Ahmet Yılmaz',
                'email' => 'ahmet@example.com',
                'phone' => '0532 123 45 67',
                'tc_no' => '12345678901',
                'birth_date' => '1985-05-15',
                'address' => 'İstanbul, Türkiye',
                'status' => 'active',
            ],
            [
                'name' => 'Ayşe Demir',
                'email' => 'ayse@example.com',
                'phone' => '0533 987 65 43',
                'tc_no' => '98765432109',
                'birth_date' => '1990-08-22',
                'address' => 'Ankara, Türkiye',
                'status' => 'active',
            ],
            [
                'name' => 'Mehmet Kaya',
                'email' => 'mehmet@example.com',
                'phone' => '0534 555 44 33',
                'tc_no' => '11223344556',
                'birth_date' => '1978-12-10',
                'address' => 'İzmir, Türkiye',
                'status' => 'vip',
            ],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}
