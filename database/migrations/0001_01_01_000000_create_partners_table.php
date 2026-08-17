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
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('logo')->nullable();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('phone')->default(0);
            $table->text('street_address')->nullable();
            $table->text('type')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_open')->default(true);
            $table->boolean('is_active')->default(true);  
            $table->datetime('registered')->nullable();
            $table->datetime('expires_on')->nullable();          
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};
