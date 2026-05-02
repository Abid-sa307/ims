<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MissingEntry extends Model
{
    protected $fillable = [
        'date',
        'location_id',
        'warehouse_id',
        'item_category_id',
        'item_id',
        'uom_id',
        'missing_quantity',
        'reason',
        'remarks',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function itemCategory()
    {
        return $this->belongsTo(ItemCategory::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function uom()
    {
        return $this->belongsTo(Uom::class, 'uom_id');
    }
}
