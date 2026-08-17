<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('villages', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10)->unique();
            $table->string('district_code', 6);
            $table->string('name');
            $table->timestamps();

            $table->foreign('district_code')->references('code')->on('districts');
        });
    }
};
