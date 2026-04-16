<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaxProfileItem extends Model
{
    protected $fillable = [
        'tax_profile_id',
        'tax_name',
        'percentage',
        'applicable_on',
    ];

    protected $casts = [
        'percentage' => 'float',
    ];

    public function taxProfile()
    {
        return $this->belongsTo(TaxProfile::class);
    }
}
