<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PhysicalStockEntry extends Model
{
    protected $fillable = [
        'date', 'location_id', 'warehouse_id', 'item_id', 'physical_stock', 'remark'
    ];

    public function location() { return $this->belongsTo(Location::class); }
    public function warehouse() { return $this->belongsTo(Warehouse::class); }
    public function item() { return $this->belongsTo(Item::class); }
}
