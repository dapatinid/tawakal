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
        Schema::create('return_items', function (Blueprint $table) {
            $table->id();
            $table->integer('returnable_id');
            $table->string('returnable_type');

            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('name');
            
            $table->decimal('cost',12,2)->default(0);
            $table->integer('quantity_plus')->default(0);
            $table->decimal('price',12,2)->default(0);
            $table->integer('quantity_mins')->default(0);
            $table->decimal('subtotal',12,2)->default(0);
            
            $table->decimal('totalcost',12,2)->default(0);
            $table->decimal('totalweight',12,2)->default(0);
            
            $table->string('status')->default('new');
            $table->text('notes')->nullable();
            $table->decimal('poin', 12, 0)->default(0);
    
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->unsignedBigInteger('branch_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('updated_by')->references('id')->on('users');
            $table->foreign('deleted_by')->references('id')->on('users');
            $table->foreign('branch_id')->references('id')->on('branches');
            $table->datetime('date')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('return_items');
    }
};
