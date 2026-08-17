<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'q',
        'code',
        'status',
        'type',
        'notes',
        'payment_method',
        'sub_total',
        'discount',
        'charge',
        'tax',
        'grand_total',
        'paid_amount',
        'change_amount',
        'meta',
        'user_alias',
        'user_id',
        'created_by',
        'updated_by',
        'deleted_by',
        'branch_id',
        'date',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }
    public function items()
    {
        return $this->morphMany(OrderItem::class, 'itemable');
    }
    public function payments(): MorphMany
    {
        return $this->morphMany(Payment::class, 'paymentable');
    }
    public function returns()
    {
        return $this->morphMany(ReturnItem::class, 'returnable');
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