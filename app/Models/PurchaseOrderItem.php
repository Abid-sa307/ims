<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrderItem extends Model
{
    protected $fillable = [
        'purchase_order_id', 'item_id', 'uom', 'qty', 'fat_value', 
        'last_price', 'current_price', 'expire_date', 'discount_percent', 
        'discount_amount', 'taxable_amount', 'cess_percent', 'cess_amount', 
        'tax_percent', 'tax_amount', 'total_amount'
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
