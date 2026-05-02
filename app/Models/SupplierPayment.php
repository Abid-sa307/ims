<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupplierPayment extends Model
{
    protected $fillable = [
        'payment_number',
        'payment_date',
        'supplier_id',
        'purchase_order_id',
        'location_id',
        'amount',
        'payment_method',
        'reference_number',
        'ref_invoice_no',
        'invoice_no',
        'notes',
        'status',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
