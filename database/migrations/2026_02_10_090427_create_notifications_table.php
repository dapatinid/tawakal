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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            // scope
            $table->foreignId('branch_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();

            // siapa yang melakukan aksi
            $table->foreignId('actor_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // admin atau customer    
            $table->string('audience')->nullable(); 

            // tipe event
            $table->string('type'); 
            // ex: order_item.updated, order_item.deleted

            // polymorphic target (opsional tapi future-proof)
            $table->string('notifiable_type')->nullable();
            $table->unsignedBigInteger('notifiable_id')->nullable();

            // payload
            $table->jsonb('data');

            $table->timestamp('created_at')->useCurrent();

            // index penting
            $table->index(['branch_id', 'created_at']);
            $table->index(['notifiable_type', 'notifiable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
