<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AdjustmentStock extends Model
{
    use SoftDeletes;

    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'code',
        'flag',
        'transfer_token',
        'status',
        'notes',
        'branch_id',
        'created_by',
        'updated_by',
        'deleted_by',
        'date',
    ];

    public function items()
    {
        return $this->morphMany(OrderItem::class, 'itemable');
    }

    public function payments()
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
}

