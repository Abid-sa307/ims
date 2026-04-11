<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditNoteItem extends Model
{
    protected $fillable = [
        'credit_note_id',
        'item_id',
        'uom_id',
        'quantity',
        'unit_price',
        'tax_amount',
        'total_amount',
    ];

    public function creditNote()
    {
        return $this->belongsTo(CreditNote::class);
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
