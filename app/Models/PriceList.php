<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PriceList extends Model
{
    protected $fillable = [
        'price_list_name',
        'price_list_type',
        'seller_id',
        'applied_on',
        'buyer_id',
        'item_category_id',
        'discount_percent',
        'default_markup_percent',
        'period_start',
        'period_end',
    ];

    public function items()
    {
        return $this->hasMany(PriceListItem::class);
    }
    
    public function seller()
    {
        return $this->belongsTo(Location::class, 'seller_id');
    }

    public function buyer()
    {
        return $this->belongsTo(Location::class, 'buyer_id');
    }
}
