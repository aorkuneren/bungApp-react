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
        Schema::create('bungalows', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('capacity');
            $table->decimal('price_per_night', 10, 2);
            $table->string('status')->default('active'); // active, inactive, maintenance, out_of_order
            $table->json('amenities')->nullable(); // WiFi, TV, Air Conditioner, etc.
            $table->string('image')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bungalows');
    }
};
