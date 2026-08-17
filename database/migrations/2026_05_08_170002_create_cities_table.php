<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cities', function (Blueprint $table) {
            $table->id();
            $table->string('code', 4)->unique();
            $table->string('province_code', 2);
            $table->string('name');
            $table->timestamps();

            $table->foreign('province_code')->references('code')->on('provinces');
        });
    }
};
