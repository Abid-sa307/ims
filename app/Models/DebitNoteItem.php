<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DebitNoteItem extends Model
{
    protected $fillable = [
        'debit_note_id',
        'item_id',
        'uom',
        'unit_price',
        'ordered_qty',
        'already_returned_qty',
        'return_qty',
        'discount_percent',
        'discount_amount',
        'taxable_amount',
        'cess_percent',
        'cess_amount',
        'sgst_percent',
        'sgst_amount',
        'cgst_percent',
        'cgst_amount',
        'service_charge_percent',
        'service_charge_amount',
        'tcs_percent',
        'tcs_amount',
        'vat_percent',
        'vat_amount',
        'surcharge_percent',
        'surcharge_amount',
        'catering_levy_percent',
        'catering_levy_amount',
        'total_amount'
    ];

    public function debitNote()
    {
        return $this->belongsTo(DebitNote::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
