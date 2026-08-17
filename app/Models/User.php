<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use App\Models\Province;
use App\Models\City;
use App\Models\District;
use App\Models\Village;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, TwoFactorAuthenticatable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'avatar',
        'cover',
        'name',
        'username',
        'email',
        'email_verified_at',
        'password',
        'is_active',
        'class',
        'is_admin',
        'level',

        'phone',
        'street_address',
        'village',
        'district',
        'city',
        'state',
        'zip_code',
        'rute',
        
        'created_oleh',
        'updated_oleh',
        'deleted_oleh',
        'branch_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',     
        'is_admin' => 'boolean',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function branch() {
        return $this->belongsTo(Branch::class);
    }
    
    public function notificationReads()
    {
        return $this->hasMany(NotificationRead::class);
    }

    public function province()
    {
        return $this->belongsTo(
            Province::class,
            'state',     // kolom di users
            'code'       // kolom di provinces
        );
    }
    public function cityRelation()
    {
        return $this->belongsTo(
            City::class,
            'city',
            'code'
        );
    }
    public function districtRelation()
    {
        return $this->belongsTo(
            District::class,
            'district',
            'code'
        );
    }
    public function villageRelation()
    {
        return $this->belongsTo(
            Village::class,
            'village',
            'code'
        );
    }    


    public function canAccessControlPanel(): bool
    {
        return $this->is_admin && !is_null($this->level);
    }

    public function isSuperAdmin(): bool
    {
        return $this->is_admin && $this->level === 'Super Admin';
    }



    public function isProfileComplete(): bool
    {
        return
            !empty($this->name) &&
            !empty($this->username) &&
            !empty($this->phone) &&
            !empty($this->email) &&
            !empty($this->state) &&
            !empty($this->city) &&
            !empty($this->district) &&
            !empty($this->village) &&
            !empty($this->street_address);
    }


}
