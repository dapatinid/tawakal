<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;


class Branch extends Model
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
        'partner_id',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',     
        'is_open' => 'boolean',
    ];    

    public function user()
    {
        return $this->hasMany(User::class);
    }
    
    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }
    
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
