<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('sku');
            $table->string('barcode')->nullable();
            $table->string('hscode')->nullable();
            $table->string('slug')->unique();

            $table->string('name');
            $table->string('group')->nullable();
            $table->string('variant')->nullable();
            $table->string('unit_name')->nullable();
            $table->text('contain')->nullable();
            $table->longText('description')->nullable();

            $table->jsonb('images')->nullable();
            $table->text('embed_videos')->nullable();
                        
            $table->decimal('cost', 12, 0)->default(0);
            $table->decimal('price', 12, 0)->default(0);
            $table->decimal('strikethroughprice', 12, 0)->default(0);
            $table->decimal('poin', 12, 0)->default(0);
            $table->string('rating')->default(0);
            $table->integer('low_stock_alert')->default(0);
            $table->integer('overstock_alert')->default(0);
            $table->integer('stock')->default(0);
            $table->decimal('weight', 10, 3)->default(0);

            $table->boolean('is_active')->default(true);
            $table->boolean('is_public')->default(true);
            $table->boolean('in_stock')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_promo')->default(false);

            $table->foreignId('brand_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('updated_by')->references('id')->on('users');
            $table->foreign('deleted_by')->references('id')->on('users');

            $table->index(['branch_id', 'stock']);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};


