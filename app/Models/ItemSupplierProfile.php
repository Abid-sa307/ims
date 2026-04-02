<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemSupplierProfile extends Model
{
    protected $fillable = ['profile_name', 'location_id', 'warehouse_id', 'supplier_id', 'item_category_id', 'item_id'];

    public function location() { return $this->belongsTo(Location::class); }
    public function warehouse() { return $this->belongsTo(Warehouse::class); }
    public function supplier() { return $this->belongsTo(Supplier::class); }
    public function category() { return $this->belongsTo(ItemCategory::class, 'item_category_id'); }
    public function item() { return $this->belongsTo(Item::class); }
}
