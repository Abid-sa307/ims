<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemCategory;
use App\Models\ItemSupplierProfile;
use App\Models\Location;
use App\Models\Supplier;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemSupplierMappingController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/ItemSupplierMapping', [
            'profiles' => ItemSupplierProfile::with(['location', 'warehouse', 'supplier', 'category', 'item'])->get(),
            'locations' => Location::all(),
            'warehouses' => Warehouse::all(),
            'suppliers' => Supplier::all(),
            'categories' => ItemCategory::all(),
            'items' => Item::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'profile_name' => 'required|string|max:255',
            'location_id' => 'required|exists:locations,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'item_category_id' => 'required|exists:item_categories,id',
            'item_id' => 'required|exists:items,id',
        ]);
        ItemSupplierProfile::create($request->all());
        return redirect()->back();
    }

    public function update(Request $request, ItemSupplierProfile $itemSupplierMapping)
    {
        $request->validate([
            'profile_name' => 'required|string|max:255',
            'location_id' => 'required|exists:locations,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'item_category_id' => 'required|exists:item_categories,id',
            'item_id' => 'required|exists:items,id',
        ]);
        $itemSupplierMapping->update($request->all());
        return redirect()->back();
    }

    public function destroy(ItemSupplierProfile $itemSupplierMapping)
    {
        $itemSupplierMapping->delete();
        return redirect()->back();
    }
}
