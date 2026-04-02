<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DebitNote extends Model
{
    protected $fillable = [
        'note_number', 
        'purchase_order_id', 
        'location_id', 
        'supplier_id', 
        'debit_note_date', 
        'reference', 
        'description', 
        'total_amount_base', 
        'discount', 
        'total_taxable_amt', 
        'total_cess_amt', 
        'total_tax_amt', 
        'additional_charges', 
        'grand_total',
        'reason'
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
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
        return $this->hasMany(DebitNoteItem::class);
    }
}
