<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'image',
        'notes',
        'mutation_type',
        'debit_akun',
        'kredit_akun',
        'currency',
        'payment_method',
        'nominal_plus',
        'nominal_mins',
        'nominal',
        'rekening',
        'user_id',
        'created_by',
        'updated_by',
        'deleted_by',
        'branch_id',
        'date',
        'target_branch_id',
    ];

    protected $casts = [
        'date_payment' => 'datetime', // or 'date' if only date is needed
    ];

    public function paymentable(): MorphTo
    {
        return $this->morphTo();
    }
    public function journal()
    {
        return $this->belongsTo(Journal::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
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

    public function targetBranch()
    {
        return $this->belongsTo(Branch::class, 'target_branch_id');
    }

}
