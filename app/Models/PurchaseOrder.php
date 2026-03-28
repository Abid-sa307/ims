<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    protected $fillable = [
        'order_number', 'supplier_id', 'total_amount', 'status',
        'location_id', 'reference_bill_no', 'reference_challan_no',
        'po_date', 'exp_order_date', 'inv_date', 'discount_amount',
        'total_tax_amount', 'additional_charges', 'grand_total', 'remarks'
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }
}
