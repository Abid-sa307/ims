<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PriceListItem extends Model
{
    protected $fillable = [
        'price_list_id',
        'item_id',
        'selling_price',
        'tax_percent',
        'uom',
    ];

    public function priceList()
    {
        return $this->belongsTo(PriceList::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
