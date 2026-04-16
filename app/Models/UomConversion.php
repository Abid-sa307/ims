<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UomConversion extends Model
{
    protected $fillable = [
        'item_id', 'base_unit_id', 'target_uom_id', 'is_default',
        'uom_multiplier', 'quantity_multiplier', 'min_order_quantity'
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function baseUnit()
    {
        return $this->belongsTo(Uom::class, 'base_unit_id');
    }

    public function targetUom()
    {
        return $this->belongsTo(Uom::class, 'target_uom_id');
    }
}
