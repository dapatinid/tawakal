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
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('created_oleh')->nullable();
            $table->unsignedBigInteger('updated_oleh')->nullable();
            $table->unsignedBigInteger('deleted_oleh')->nullable();
            $table->unsignedBigInteger('branch_id')->nullable();
            
            $table->foreign('created_oleh')->references('id')->on('users');
            $table->foreign('updated_oleh')->references('id')->on('users');
            $table->foreign('deleted_oleh')->references('id')->on('users');
            $table->foreign('branch_id')->references('id')->on('branches');
        });
        Schema::table('branches', function (Blueprint $table) {
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('partner_id')->nullable();
            
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('updated_by')->references('id')->on('users');
            $table->foreign('partner_id')->references('id')->on('partners');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
