<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = [
        'supplier_name', 'country', 'state', 'city', 'address', 'location',
        'location_id',
        'gst_number', 'pan', 'vat_number', 'lut_number', 'fda_registration_number',
        'contact_number', 'email', 'pincode', 'supplier_code_tally', 'contact_person_name',
        'logo', 'cut_off_from_time', 'cut_off_to_time', 'allow_modify_moq',
        'enable_order_level_tax', 'disable_rounding_off', 'reduce_qty_with_packaging_material',
        'enable_credit_limit', 'dispatch_only_prepaid_orders', 'enable_royalty_service'
    ];
    
    protected $casts = [
        'allow_modify_moq' => 'boolean',
        'enable_order_level_tax' => 'boolean',
        'disable_rounding_off' => 'boolean',
        'reduce_qty_with_packaging_material' => 'boolean',
        'enable_credit_limit' => 'boolean',
        'dispatch_only_prepaid_orders' => 'boolean',
        'enable_royalty_service' => 'boolean',
    ];
}
