<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    protected $fillable = [
        'order_number', 'supplier_id', 'location_id', 'project_id', 'total_amount', 'status',
        'reference_bill_no', 'reference_challan_no',
        'po_date', 'exp_order_date', 'inv_date', 'discount_amount',
        'total_tax_amount', 'cgst_amount', 'sgst_amount', 'igst_amount', 'utgst_amount',
        'additional_charges', 'grand_total', 'remarks', 'is_auto_approved'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

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
