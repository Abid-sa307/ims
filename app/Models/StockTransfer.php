<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockTransfer extends Model
{
    protected $fillable = [
        'date', 'from_location_id', 'to_location_id', 'from_warehouse_id', 'to_warehouse_id', 
        'transfer_type', 'requested_by_id', 'document_path', 'remarks'
    ];

    public function fromLocation() { return $this->belongsTo(Location::class, 'from_location_id'); }
    public function toLocation() { return $this->belongsTo(Location::class, 'to_location_id'); }
    public function fromWarehouse() { return $this->belongsTo(Warehouse::class, 'from_warehouse_id'); }
    public function toWarehouse() { return $this->belongsTo(Warehouse::class, 'to_warehouse_id'); }
    public function requestedBy() { return $this->belongsTo(User::class, 'requested_by_id'); }
    public function items() { return $this->hasMany(StockTransferItem::class); }
}
