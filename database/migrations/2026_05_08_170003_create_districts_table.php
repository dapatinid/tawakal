<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('districts', function (Blueprint $table) {
            $table->id();
            $table->string('code', 6)->unique();
            $table->string('city_code', 4);
            $table->string('name');
            $table->timestamps();

            $table->foreign('city_code')->references('code')->on('cities');
        });
    }
};
