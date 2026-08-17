<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->integer('q');
            $table->string('code')->nullable();
            $table->string('type')->nullable()->default('self pickup');
            $table->string('status')->default('new');
            $table->text('notes')->nullable();
            $table->string('flag')->default('Penjualan');
            $table->jsonb('meta')->nullable();

            $table->string('payment_method')->default('cash');
            $table->decimal('sub_total', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('charge', 12, 2)->default(0);
            $table->decimal('tax', 12, 2)->default(0);
            $table->decimal('grand_total', 12, 2)->default(0);
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->decimal('change_amount', 12, 2)->default(0);
            
            $table->string('user_alias')->nullable();
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

            $table->index(['branch_id', 'date'], 'idx_orders_branch_date');
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->integer('itemable_id');
            $table->string('itemable_type');

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

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->integer('paymentable_id');
            $table->string('paymentable_type');
            
            $table->string('image')->nullable();
            $table->text('notes')->nullable();

            $table->string('mutation_type')->nullable();
            $table->string('debit_akun')->nullable();
            $table->string('kredit_akun')->nullable();

            $table->string('payment_method')->nullable();
            $table->string('currency')->nullable()->default('IDR');
            $table->decimal('nominal_plus', 12, 0)->default(0);
            $table->decimal('nominal_mins', 12, 0)->default(0);
            $table->decimal('nominal', 12, 0)->default(0);
            $table->string('rekening')->nullable();

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

    public function down()
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};