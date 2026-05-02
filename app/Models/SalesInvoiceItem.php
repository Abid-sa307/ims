<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesInvoiceItem extends Model
{
    protected $fillable = [
        'sales_invoice_id',
        'item_id',
        'uom_id',
        'quantity',
        'unit_price',
        'discount_percent',
        'discount_amount',
        'taxable_amount',
        'cess_percent',
        'cess_amount',
        'tax_percent',
        'cgst_percent',
        'cgst_amount',
        'sgst_percent',
        'sgst_amount',
        'igst_percent',
        'igst_amount',
        'utgst_percent',
        'utgst_amount',
        'tax_amount',
        'total_amount',
    ];

    public function invoice()
    {
        return $this->belongsTo(SalesInvoice::class, 'sales_invoice_id');
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function uom()
    {
        return $this->belongsTo(Uom::class);
    }
}
