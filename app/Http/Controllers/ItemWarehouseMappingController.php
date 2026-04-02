<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemCategory;
use App\Models\ItemWarehouseMapping;
use App\Models\Location;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemWarehouseMappingController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/ItemWarehouseMapping', [
            'mappings' => ItemWarehouseMapping::with(['location', 'warehouse', 'category', 'item'])->get(),
            'locations' => Location::all(),
            'warehouses' => Warehouse::all(),
            'categories' => ItemCategory::all(),
            'items' => Item::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'location_id' => 'required|exists:locations,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'item_category_id' => 'required|exists:item_categories,id',
            'item_id' => 'required|exists:items,id',
        ]);
        ItemWarehouseMapping::create($request->all());
        return redirect()->back();
    }

    public function update(Request $request, ItemWarehouseMapping $itemWarehouseMapping)
    {
        $request->validate([
            'location_id' => 'required|exists:locations,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'item_category_id' => 'required|exists:item_categories,id',
            'item_id' => 'required|exists:items,id',
        ]);
        $itemWarehouseMapping->update($request->all());
        return redirect()->back();
    }

    public function destroy(ItemWarehouseMapping $itemWarehouseMapping)
    {
        $itemWarehouseMapping->delete();
        return redirect()->back();
    }
}
