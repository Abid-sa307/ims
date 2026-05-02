<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'item_name', 'uom', 'price', 'tax_percent', 'cess_percent', 'description',
        'item_category_id', 'item_sub_category_id', 'brand_id', 'item_type_id',
        'item_name_gujarati', 'safety_quantity',
        'base_unit_id', 'default_tax_id', 'selling_item_as', 'hsn_code', 'sac_code',
        'htsn_code', 'fda_product_code', 'is_cess', 'cess_percentage', 'cess_description', 
        'price_type', 'standard_sale_price', 'standard_purchase_price', 'net_cost',
        'shelf_life_days', 'single_batch_quantity', 'item_barcode', 'item_sku',
        'standard_weight_single_unit', 'weight_adjustment_gross_weight',
        'pallet_size_export', 'is_manufacture', 'is_fat_item', 'is_packing_item',
        'allow_multiple_entry_po', 'has_parent_item', 'remarks', 'ingredients',
        'nutrition_information', 'item_tally_code'
    ];

    public function category()
    {
        return $this->belongsTo(ItemCategory::class, 'item_category_id');
    }

    public function subCategory()
    {
        return $this->belongsTo(ItemSubCategory::class, 'item_sub_category_id');
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function itemType()
    {
        return $this->belongsTo(ItemType::class, 'item_type_id');
    }

    public function baseUnit()
    {
        return $this->belongsTo(Uom::class, 'base_unit_id');
    }

    public function uomConversions()
    {
        return $this->hasMany(UomConversion::class);
    }

    public function itemWarehouseMappings()
    {
        return $this->hasMany(ItemWarehouseMapping::class);
    }

    public function taxProfile()
    {
        return $this->belongsTo(TaxProfile::class, 'default_tax_id');
    }
}
