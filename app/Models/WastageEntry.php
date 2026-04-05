<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WastageEntry extends Model
{
    protected $fillable = [
        'date', 'location_id', 'warehouse_id', 'item_category_id', 'item_id', 'uom_id', 'wastage_quantity', 'reason', 'remarks'
    ];

    public function location() { return $this->belongsTo(Location::class); }
    public function warehouse() { return $this->belongsTo(Warehouse::class); }
    public function item() { return $this->belongsTo(Item::class); }
    public function category() { return $this->belongsTo(ItemCategory::class, 'item_category_id'); }
    public function uom() { return $this->belongsTo(Uom::class); }
}
