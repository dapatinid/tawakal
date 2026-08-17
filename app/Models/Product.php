<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'name',
        'group',
        'variant',
        'unit_name',
        'contain',

        'description',
        'images',
        'embed_videos',
        
        'sku',
        'barcode',
        'hscode',
        'slug',
        
        'category_id',
        'brand_id',
        
        'cost',
        'price',
        'strikethroughprice',
        'poin',
        'rating',
        'weight',
        'panjang',
        'lebar',
        'tinggi',
        'kg_per_meter',
        'cost_per_kg',
        'low_stock_alert',
        'overstock_alert',
        'stock',

        'queue_act',
        'act_log',

        'is_active',
        'is_public',
        'in_stock',
        'is_featured',
        'is_promo',
        
        'branch_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'images' => 'array',
        'is_active' => 'boolean',
        'is_public' => 'boolean',
        'in_stock' => 'boolean',
        'is_featured' => 'boolean',
        'is_promo' => 'boolean',        
        'queue_act' => 'boolean',
        'act_log' => 'array',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
    public function payments(): MorphMany
    {
        return $this->morphMany(Payment::class, 'paymentable');
    }    
    public function items()
    {
        return $this->morphMany(OrderItem::class, 'itemable');
    }    
}