<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemCategory;
use App\Models\Location;
use App\Models\StockSource;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockSourceController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/StockSourceSelection', [
            'locations' => Location::all(),
            'categories' => ItemCategory::all(),
            'items' => Item::all(),
            'warehouses' => Warehouse::all(),
        ]);
    }

    public function loadMatrix(Request $request)
    {
        $request->validate([
            'location_id' => 'required|exists:locations,id',
            'item_category_id' => 'nullable|exists:item_categories,id',
            'item_id' => 'nullable|exists:items,id',
        ]);

        $query = Item::query();

        if ($request->filled('item_id')) {
            $query->where('id', $request->item_id);
        } elseif ($request->filled('item_category_id')) {
            $query->where('item_category_id', $request->item_category_id);
        }

        $items = $query->select('id', 'item_name')->get();

        // Get existing bindings for these items at the given location
        $itemIds = $items->pluck('id');
        $existingSources = StockSource::where('location_id', $request->location_id)
            ->whereIn('item_id', $itemIds)
            ->get()
            ->keyBy('item_id');

        $matrix = $items->map(function ($item) use ($existingSources) {
            $existing = $existingSources->get($item->id);
            return [
                'item_id' => $item->id,
                'item_name' => $item->item_name,
                'inward_warehouse_id' => $existing ? $existing->inward_warehouse_id : '',
                'outward_warehouse_id' => $existing ? $existing->outward_warehouse_id : '',
            ];
        });

        return response()->json(['matrix' => $matrix]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'location_id' => 'required|exists:locations,id',
            'mappings' => 'required|array',
            'mappings.*.item_id' => 'required|exists:items,id',
            'mappings.*.inward_warehouse_id' => 'nullable|exists:warehouses,id',
            'mappings.*.outward_warehouse_id' => 'nullable|exists:warehouses,id',
        ]);

        $locationId = $request->location_id;

        foreach ($request->mappings as $mapping) {
            // upsert based on location_id and item_id
            StockSource::updateOrCreate(
                [
                    'location_id' => $locationId,
                    'item_id' => $mapping['item_id'],
                ],
                [
                    'inward_warehouse_id' => $mapping['inward_warehouse_id'] ?: null,
                    'outward_warehouse_id' => $mapping['outward_warehouse_id'] ?: null,
                ]
            );
        }

        return redirect()->back()->with('success', 'Stock sources mapped successfully.');
    }
}
