<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReturnItem extends Model
{

    use SoftDeletes;
    protected $fillable = [
        'product_id',
        'name',
        'cost',
        'quantity_plus',
        'price',
        'quantity_mins',
        'subtotal',        
        'totalcost',        
        'totalweight',        
        'status',        
        'user_id',
        'created_by',
        'updated_by',
        'deleted_by',
        'branch_id',
        'date',
        'notes',
    ];

    public function returnable(): MorphTo
    {
        return $this->morphTo();
    }
    
    public function product()
    {
        return $this->belongsTo(Product::class);
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
