<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockSource extends Model
{
    protected $fillable = [
        'location_id',
        'item_id',
        'inward_warehouse_id',
        'outward_warehouse_id',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function inwardWarehouse()
    {
        return $this->belongsTo(Warehouse::class, 'inward_warehouse_id');
    }

    public function outwardWarehouse()
    {
        return $this->belongsTo(Warehouse::class, 'outward_warehouse_id');
    }
}
