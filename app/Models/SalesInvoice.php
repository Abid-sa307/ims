<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesInvoice extends Model
{
    protected $fillable = [
        'invoice_number',
        'invoice_date',
        'customer_id',
        'location_id',
        'total_amount',
        'tax_amount',
        'discount_amount',
        'total_tax_amount',
        'cgst_amount',
        'sgst_amount',
        'igst_amount',
        'utgst_amount',
        'additional_charges',
        'grand_total',
        'status',
        'remarks',
        'is_auto_approved',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function items()
    {
        return $this->hasMany(SalesInvoiceItem::class);
    }
}
