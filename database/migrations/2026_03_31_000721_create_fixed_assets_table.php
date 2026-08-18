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
        Schema::create('fixed_assets', function (Blueprint $table) {
            $table->id();
            $table->string('asset_code', 50)->unique();
            $table->string('name');
            $table->text('notes')->nullable();
            $table->jsonb('images')->nullable();
            
            // ategori 
             $table->enum('category', ['bangunan', 'kendaraan', 'peralatan'])->default('peralatan');
            
            // Data Finansial
            $table->date('purchase_date');
            $table->decimal('sold_value', 18, 2)->default(0); 
            $table->decimal('purchase_cost', 18, 2); 
            $table->decimal('residual_value', 18, 2)->default(0);
            $table->integer('useful_life_months')->comment('Umur ekonomis dalam satuan bulan');
            
            // Tracking Penyusutan
            $table->decimal('accumulated_depreciation', 18, 2)->default(0);
            
            // Status Management
            $table->enum('status', ['active', 'sold', 'disposed', 'archived'])->default('active');

            $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->nullOnDelete();
            
            $table->timestamps();
            $table->softDeletes(); // Opsional: Agar data tidak benar-benar hilang saat di-delete
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fixed_assets');
    }
};
