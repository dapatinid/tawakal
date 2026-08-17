<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccountBalance extends Model
{
    protected $fillable = [
        'branch_id',
        'akun',
        'balance',
    ];
}
