<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class FixedAsset extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];

    /**
     * Casting data agar otomatis dikonversi ke tipe data yang sesuai.
     */
    protected $casts = [
        'images' => 'array',
        'purchase_date' => 'date',
        'sold_value' => 'decimal:2',
        'purchase_cost' => 'decimal:2',
        'residual_value' => 'decimal:2',
        'accumulated_depreciation' => 'decimal:2',
        'useful_life_months' => 'integer',
    ];

    /**
     * Accessor: Nilai Buku (Book Value)
     * Ini akan otomatis tersedia di JSON sebagai 'book_value'
     */
    protected $appends = ['book_value', 'monthly_depreciation_cost'];

    protected function bookValue(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->purchase_cost - $this->accumulated_depreciation,
        );
    }

    /**
     * Accessor: Biaya Penyusutan per Bulan
     */
    protected function monthlyDepreciationCost(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->useful_life_months <= 0) return 0;
                return ($this->purchase_cost - $this->residual_value) / $this->useful_life_months;
            }
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function destroyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }

    public function payments(): MorphMany
    {
        return $this->morphMany(Payment::class, 'paymentable');
    }    
}