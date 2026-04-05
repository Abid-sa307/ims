<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockAdjustment extends Model
{
    protected $fillable = [
        'date', 'location_id', 'warehouse_id', 'item_id', 'current_stock', 'adjust_quantity', 'new_quantity', 'remarks'
    ];

    public function location() { return $this->belongsTo(Location::class); }
    public function warehouse() { return $this->belongsTo(Warehouse::class); }
    public function item() { return $this->belongsTo(Item::class); }
}
