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
        Schema::table('products', function (Blueprint $table) {
            // Menggunakan tipe data decimal yang umum untuk ukuran dan harga
            $table->decimal('panjang', 10, 2)->default(0)->after('weight');
            $table->decimal('lebar', 10, 2)->default(0)->after('panjang');
            $table->decimal('tinggi', 10, 2)->default(0)->after('lebar');
            $table->decimal('kg_per_meter', 10, 3)->default(0)->after('tinggi');
            $table->decimal('cost_per_kg', 12, 0)->default(0)->after('kg_per_meter');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['panjang', 'lebar', 'tinggi', 'cost_per_kg']);
        });
    }
};
