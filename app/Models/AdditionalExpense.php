<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdditionalExpense extends Model
{
    protected $fillable = [
        'expense_name',
        'expense_date',
        'amount',
        'location_id',
        'category',
        'remarks',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
