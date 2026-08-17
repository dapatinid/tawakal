<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Journal extends Model
{
   use SoftDeletes;

    protected $fillable = [
        'code',
        'date',
        'pair_journal_id',
        'transfer_type',
        
        'user_alias',
        'user_id',
        'branch_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    /* ======================
     |  RELATIONS
     ====================== */

    public function payments(): MorphMany
    {
        return $this->morphMany(Payment::class, 'paymentable');
    }

    public function userCre(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function userUpd(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }    

    public function pair()
    {
        return $this->belongsTo(Journal::class, 'pair_journal_id');
    }


}
