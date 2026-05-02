<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrderItem extends Model
{
    protected $fillable = [
        'purchase_order_id', 'item_id', 'item_remark', 'uom', 'qty', 'fat_value', 
        'last_price', 'current_price', 'mfg_date', 'expire_date', 'discount_percent', 
        'discount_amount', 'taxable_amount', 'received_qty', 'damaged_qty', 'missed_qty',
        'cess_percent', 'cess_amount', 'tax_percent', 'tax_amount', 
        'cgst_percent', 'cgst_amount', 'sgst_percent', 'sgst_amount', 
        'igst_percent', 'igst_amount', 'utgst_percent', 'utgst_amount',
        'service_charge_percent', 'service_charge_amount', 'tcs_percent', 'tcs_amount',
        'vat_percent', 'vat_amount', 'surcharge_percent', 'surcharge_amount',
        'catering_levy_percent', 'catering_levy_amount', 'total_amount'
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
