<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaxProfile extends Model
{
    protected $fillable = [
        'name',
        'total_percentage',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'total_percentage' => 'float',
    ];

    public function items()
    {
        return $this->hasMany(TaxProfileItem::class);
    }
}
