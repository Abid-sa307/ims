<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemCategory;
use App\Models\ItemSubCategory;
use App\Models\ItemType;
use App\Models\Uom;
use App\Models\UomConversion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

use App\Imports\ItemImport;
use Maatwebsite\Excel\Facades\Excel;

class ItemController extends Controller
{
    public function index()
    {
        $items = Item::with(['category', 'subCategory', 'brand', 'itemType', 'baseUnit'])->latest()->get();
        
        return Inertia::render('Master/ItemMaster', [
            'items' => $items,
            'categories' => ItemCategory::all(),
            'subCategories' => ItemSubCategory::all(),
            'itemTypes' => ItemType::all(),
            'uoms' => Uom::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_name' => 'required|string|max:255',
            'item_category_id' => 'nullable|exists:item_categories,id',
            'item_sub_category_id' => 'nullable|exists:item_sub_categories,id',
            'item_type_id' => 'nullable|exists:item_types,id',
            'item_name_gujarati' => 'nullable|string|max:255',
            'equivalent_selling_item' => 'nullable|string|max:255',
            'safety_quantity' => 'nullable|numeric|min:0',
            'base_unit_id' => 'nullable|exists:uoms,id',
            'default_tax_id' => 'nullable|integer',
            'selling_item_as' => 'nullable|in:Goods,Service',
            'hsn_code' => 'nullable|string|max:50',
            'sac_code' => 'nullable|string|max:50',
            'htsn_code' => 'nullable|string|max:50',
            'fda_product_code' => 'nullable|string|max:50',
            'is_cess' => 'nullable|boolean',
            'cess_percentage' => 'nullable|numeric|min:0',
            'cess_description' => 'nullable|string',
            'price_type' => 'nullable|string|max:50',
            'standard_sale_price' => 'nullable|numeric|min:0',
            'standard_purchase_price' => 'nullable|numeric|min:0',
            'net_cost' => 'nullable|numeric|min:0',
            'shelf_life_days' => 'nullable|integer|min:0',
            'single_batch_quantity' => 'nullable|numeric|min:0',
            'item_barcode' => 'nullable|string|max:100',
            'item_sku' => 'nullable|string|max:100',
            'standard_weight_single_unit' => 'nullable|numeric|min:0',
            'weight_adjustment_gross_weight' => 'nullable|numeric|min:0',
            'pallet_size_export' => 'nullable|string|max:100',
            'is_manufacture' => 'nullable|boolean',
            'is_fat_item' => 'nullable|boolean',
            'is_packing_item' => 'nullable|boolean',
            'allow_multiple_entry_po' => 'nullable|boolean',
            'has_parent_item' => 'nullable|boolean',
            'remarks' => 'nullable|string',
            'ingredients' => 'nullable|string',
            'nutrition_information' => 'nullable|string',
            'description' => 'nullable|string',
            'item_tally_code' => 'nullable|string|max:100',
            'uom_conversions' => 'nullable|array',
            'uom_conversions.*.target_uom_id' => 'required|exists:uoms,id',
            'uom_conversions.*.uom_multiplier' => 'required|numeric',
            'uom_conversions.*.quantity_multiplier' => 'required|numeric',
            'uom_conversions.*.min_order_quantity' => 'required|numeric',
        ]);

        DB::transaction(function () use ($validated) {
            if (!empty($validated['base_unit_id'])) {
                $uom = Uom::find($validated['base_unit_id']);
                if ($uom) {
                    $validated['uom'] = $uom->name;
                }
            }
            $item = Item::create($validated);

            if (!empty($validated['uom_conversions'])) {
                foreach ($validated['uom_conversions'] as $conv) {
                    $item->uomConversions()->create([
                        'base_unit_id' => $validated['base_unit_id'],
                        'target_uom_id' => $conv['target_uom_id'],
                        'uom_multiplier' => $conv['uom_multiplier'],
                        'quantity_multiplier' => $conv['quantity_multiplier'],
                        'min_order_quantity' => $conv['min_order_quantity'],
                    ]);
                }
            }
        });

        return redirect()->back()->with('success', 'Item created successfully.');
    }

    public function update(Request $request, Item $item_master)
    {
        $validated = $request->validate([
            'item_name' => 'required|string|max:255|unique:items,item_name,' . $item_master->id,
            'item_category_id' => 'required|integer|exists:item_categories,id',
            'item_sub_category_id' => 'nullable|exists:item_sub_categories,id',
            'item_type_id' => 'nullable|exists:item_types,id',
            'item_name_gujarati' => 'nullable|string|max:255',
            'equivalent_selling_item' => 'nullable|string|max:255',
            'safety_quantity' => 'nullable|numeric|min:0',
            'base_unit_id' => 'nullable|exists:uoms,id',
            'default_tax_id' => 'nullable|integer',
            'selling_item_as' => 'nullable|in:Goods,Service',
            'hsn_code' => 'nullable|string|max:50',
            'sac_code' => 'nullable|string|max:50',
            'htsn_code' => 'nullable|string|max:50',
            'fda_product_code' => 'nullable|string|max:50',
            'is_cess' => 'nullable|boolean',
            'cess_percentage' => 'nullable|numeric|min:0',
            'cess_description' => 'nullable|string',
            'price_type' => 'nullable|string|max:50',
            'standard_sale_price' => 'nullable|numeric|min:0',
            'standard_purchase_price' => 'nullable|numeric|min:0',
            'net_cost' => 'nullable|numeric|min:0',
            'shelf_life_days' => 'nullable|integer|min:0',
            'single_batch_quantity' => 'nullable|numeric|min:0',
            'item_barcode' => 'nullable|string|max:100',
            'item_sku' => 'nullable|string|max:100',
            'standard_weight_single_unit' => 'nullable|numeric|min:0',
            'weight_adjustment_gross_weight' => 'nullable|numeric|min:0',
            'pallet_size_export' => 'nullable|string|max:100',
            'is_manufacture' => 'nullable|boolean',
            'is_fat_item' => 'nullable|boolean',
            'is_packing_item' => 'nullable|boolean',
            'allow_multiple_entry_po' => 'nullable|boolean',
            'has_parent_item' => 'nullable|boolean',
            'remarks' => 'nullable|string',
            'ingredients' => 'nullable|string',
            'nutrition_information' => 'nullable|string',
            'description' => 'nullable|string',
            'item_tally_code' => 'nullable|string|max:100',
            'uom_conversions' => 'nullable|array',
            'uom_conversions.*.target_uom_id' => 'required|exists:uoms,id',
            'uom_conversions.*.uom_multiplier' => 'required|numeric',
            'uom_conversions.*.quantity_multiplier' => 'required|numeric',
            'uom_conversions.*.min_order_quantity' => 'required|numeric',
        ]);

        DB::transaction(function () use ($validated, $item_master) {
            if (!empty($validated['base_unit_id'])) {
                $uom = Uom::find($validated['base_unit_id']);
                if ($uom) {
                    $validated['uom'] = $uom->name;
                }
            }
            $item_master->update($validated);

            $item_master->uomConversions()->delete();
            if (!empty($validated['uom_conversions'])) {
                foreach ($validated['uom_conversions'] as $conv) {
                    $item_master->uomConversions()->create([
                        'base_unit_id' => $validated['base_unit_id'],
                        'target_uom_id' => $conv['target_uom_id'],
                        'uom_multiplier' => $conv['uom_multiplier'],
                        'quantity_multiplier' => $conv['quantity_multiplier'],
                        'min_order_quantity' => $conv['min_order_quantity'],
                    ]);
                }
            }
        });

        return redirect()->back()->with('success', 'Item updated successfully.');
    }

    public function destroy(Item $item_master)
    {
        $item_master->delete();

        return redirect()->back()->with('success', 'Item deleted successfully.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new ItemImport, $request->file('file'));

        return redirect()->back()->with('success', 'Items imported successfully.');
    }
}
