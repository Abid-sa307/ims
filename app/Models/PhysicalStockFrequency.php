<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PhysicalStockFrequency extends Model
{
    protected $fillable = [
        'location_id', 'warehouse_id', 'item_id', 'daily', 'weekly', 'monthly'
    ];

    public function location() { return $this->belongsTo(Location::class); }
    public function warehouse() { return $this->belongsTo(Warehouse::class); }
    public function item() { return $this->belongsTo(Item::class); }
}
