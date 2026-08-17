<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Partner extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'logo',
        'name',
        'slug',
        'image',
        'phone',
        'street_address',
        'type',
        'is_open',
        'is_active',
        'registered',
        'expires_on',
    ];

    protected $casts = [
        'is_active' => 'boolean',     
        'is_open' => 'boolean',
    ];        

    public function branches() {
        return $this->hasMany(Branch::class);
    }

}
