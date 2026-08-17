<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\{
    BelongsTo,
    HasMany,
    MorphTo
};

class Notification extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'branch_id',
        'actor_id',
        'audience',
        'type',
        'notifiable_type',
        'notifiable_id',
        'data',
        'created_at',
    ];

    protected $casts = [
        'data' => 'array',
        'created_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relations
    |--------------------------------------------------------------------------
    */

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public function reads(): HasMany
    {
        return $this->hasMany(NotificationRead::class);
    }

    public function notifiable(): MorphTo
    {
        return $this->morphTo();
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isReadBy(int $userId): bool
    {
        return $this->reads
            ->firstWhere('user_id', $userId)
            ?->read_at !== null;
    }
    
    public function scopeForUser(Builder $query, $user)
    {
        return $query->where(function ($q) use ($user) {
            
            // --- FILTER AUDIENCE ---
            $q->where(function ($sub) use ($user) {
                // CASE BARU: Jika audience berisi ID User (Angka)
                // Hanya bisa dilihat oleh user yang ID-nya cocok
                $sub->where('audience', $user->id)
                    
                    // ATAU CASE LAMA:
                    ->orWhere(function ($legacy) use ($user) {
                        // Hanya jalankan logika branch & admin jika audience BUKAN numerik
                        // (Agar notifikasi privat tidak bocor ke admin branch lain)
                        $legacy->where(function ($typeSub) use ($user) {
                            $typeSub->whereNull('audience') // Case 1 & 3: Publik
                                ->orWhere(function ($adminSub) use ($user) {
                                    $adminSub->where('audience', 'admin'); // Case 2 & 4: Admin Only
                                    if (!$user->is_admin) {
                                        $adminSub->whereRaw('1=0');
                                    }
                                });
                        })
                        // Gabungan Case Branch (Berlaku untuk Publik & Admin, tapi bukan Private ID)
                        ->where(function ($branchSub) use ($user) {
                            $branchSub->whereNull('branch_id')
                                ->orWhere('branch_id', $user->branch_id);
                        });
                    });
            });
        });
    }



}
