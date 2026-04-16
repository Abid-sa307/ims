<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tax extends Model
{
    protected $fillable = [
        'tax_name',
        'is_active',
        'tax_type',
        'cgst_rate',
        'sgst_rate',
        'igst_rate',
        'utgst_rate',
        'total_rate',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
