<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemCategory;
use App\Models\ItemSubCategory;
use App\Models\ItemWarehouseMapping;
use App\Models\Location;
use App\Models\Warehouse;
use App\Models\Uom;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\WastageEntry;
use App\Models\StockTransfer;
use App\Models\StockTransferItem;
use App\Models\StockAdjustment;
use App\Models\PhysicalStockFrequency;
use App\Models\PhysicalStockEntry;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    public function currentStock(Request $request)
    {
        $query = ItemWarehouseMapping::with(['location', 'warehouse', 'category', 'item.subCategory', 'item.baseUnit']);

        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }
        if ($request->filled('warehouse_id')) {
            $query->where('warehouse_id', $request->warehouse_id);
        }
        if ($request->filled('item_category_id')) {
            $query->where('item_category_id', $request->item_category_id);
        }
        if ($request->filled('item_id')) {
            $query->where('item_id', $request->item_id);
        }
        
        // Filter by Item Sub Category (requires joining or deep filtering)
        if ($request->filled('item_sub_category_id')) {
            $query->whereHas('item', function($q) use ($request) {
                $q->where('item_sub_category_id', $request->item_sub_category_id);
            });
        }

        // Filter by UOM
        if ($request->filled('uom_id')) {
            $query->whereHas('item', function($q) use ($request) {
                $q->where('base_unit_id', $request->uom_id);
            });
        }

        $stockData = $query->get();

        return Inertia::render('Stock/CurrentStock', [
            'stockData' => $stockData,
            'locations' => Location::all(),
            'warehouses' => Warehouse::all(),
            'categories' => ItemCategory::all(),
            'subCategories' => ItemSubCategory::all(),
            'items' => Item::all(),
            'uoms' => Uom::all(),
            'filters' => $request->only(['location_id', 'warehouse_id', 'item_category_id', 'item_sub_category_id', 'item_id', 'uom_id'])
        ]);
    }

    public function wastageEntry()
    {
        return Inertia::render('Stock/WastageEntry', [
            'locations' => Location::all(),
            'warehouses' => Warehouse::all(),
            'categories' => ItemCategory::all(),
            'items' => Item::with('baseUnit')->get(),
            'uoms' => Uom::all(),
        ]);
    }

    public function storeWastageEntry(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'location_id' => 'required|exists:locations,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'items' => 'required|array|min:1',
            'items.*.item_category_id' => 'required|exists:item_categories,id',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.uom_id' => 'required|exists:uoms,id',
            'items.*.wastage_quantity' => 'required|numeric|min:0.01',
            'items.*.reason' => 'nullable|string',
            'items.*.remarks' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['items'] as $itemData) {
                // Create wastage record
                WastageEntry::create([
                    'date' => $validated['date'],
                    'location_id' => $validated['location_id'],
                    'warehouse_id' => $validated['warehouse_id'],
                    'item_category_id' => $itemData['item_category_id'],
                    'item_id' => $itemData['item_id'],
                    'uom_id' => $itemData['uom_id'],
                    'wastage_quantity' => $itemData['wastage_quantity'],
                    'reason' => $itemData['reason'] ?? null,
                    'remarks' => $itemData['remarks'] ?? null,
                ]);

                // Update stock
                $mapping = ItemWarehouseMapping::where([
                    'location_id' => $validated['location_id'],
                    'warehouse_id' => $validated['warehouse_id'],
                    'item_id' => $itemData['item_id'],
                ])->first();

                if ($mapping) {
                    $mapping->decrement('current_quantity', $itemData['wastage_quantity']);
                }
            }
        });

        return redirect()->back()->with('success', 'Wastage entries recorded successfully.');
    }

    public function stockTransfer()
    {
        return Inertia::render('Stock/StockTransfer', [
            'locations' => Location::all(),
            'warehouses' => Warehouse::all(),
            'categories' => ItemCategory::all(),
            'items' => Item::with(['baseUnit', 'itemWarehouseMappings'])->get(),
            'users' => User::all(),
        ]);
    }

    public function storeStockTransfer(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'from_location_id' => 'required|exists:locations,id',
            'to_location_id' => 'required|exists:locations,id',
            'from_warehouse_id' => 'required|exists:warehouses,id',
            'to_warehouse_id' => 'required|exists:warehouses,id',
            'transfer_type' => 'required|string',
            'requested_by_id' => 'required|exists:users,id',
            'remarks' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $documentPath = null;
            if ($request->hasFile('document')) {
                $documentPath = $request->file('document')->store('stock_transfers', 'public');
            }

            $transfer = StockTransfer::create([
                'date' => $validated['date'],
                'from_location_id' => $validated['from_location_id'],
                'to_location_id' => $validated['to_location_id'],
                'from_warehouse_id' => $validated['from_warehouse_id'],
                'to_warehouse_id' => $validated['to_warehouse_id'],
                'transfer_type' => $validated['transfer_type'],
                'requested_by_id' => $validated['requested_by_id'],
                'document_path' => $documentPath,
                'remarks' => $validated['remarks'],
            ]);

            foreach ($validated['items'] as $itemData) {
                StockTransferItem::create([
                    'stock_transfer_id' => $transfer->id,
                    'item_id' => $itemData['item_id'],
                    'quantity' => $itemData['quantity'],
                ]);

                // 1. Decrement From Source
                $sourceMapping = ItemWarehouseMapping::where([
                    'location_id' => $validated['from_location_id'],
                    'warehouse_id' => $validated['from_warehouse_id'],
                    'item_id' => $itemData['item_id'],
                ])->first();

                if ($sourceMapping) {
                    $sourceMapping->decrement('current_quantity', $itemData['quantity']);
                }

                // 2. Increment At Destination
                $destMapping = ItemWarehouseMapping::firstOrCreate([
                    'location_id' => $validated['to_location_id'],
                    'warehouse_id' => $validated['to_warehouse_id'],
                    'item_id' => $itemData['item_id'],
                ], [
                    'current_quantity' => 0,
                    'item_category_id' => Item::find($itemData['item_id'])->item_category_id,
                ]);

                $destMapping->increment('current_quantity', $itemData['quantity']);
            }
        });

        return redirect()->back()->with('success', 'Stock transfer processed successfully.');
    }

    public function stockTransferReport(Request $request)
    {
        $query = StockTransferItem::with([
            'transfer.fromLocation', 
            'transfer.toLocation', 
            'transfer.fromWarehouse', 
            'transfer.toWarehouse', 
            'item.category'
        ]);

        if ($request->filled('date_from')) {
            $query->whereHas('transfer', function($q) use ($request) {
                $q->where('date', '>=', $request->date_from);
            });
        }
        if ($request->filled('date_to')) {
            $query->whereHas('transfer', function($q) use ($request) {
                $q->where('date', '<=', $request->date_to);
            });
        }
        if ($request->filled('from_location_id')) {
            $query->whereHas('transfer', function($q) use ($request) {
                $q->where('from_location_id', $request->from_location_id);
            });
        }
        if ($request->filled('to_location_id')) {
            $query->whereHas('transfer', function($q) use ($request) {
                $q->where('to_location_id', $request->to_location_id);
            });
        }
        if ($request->filled('from_warehouse_id')) {
            $query->whereHas('transfer', function($q) use ($request) {
                $q->where('from_warehouse_id', $request->from_warehouse_id);
            });
        }
        if ($request->filled('to_warehouse_id')) {
            $query->whereHas('transfer', function($q) use ($request) {
                $q->where('to_warehouse_id', $request->to_warehouse_id);
            });
        }
        if ($request->filled('item_category_id')) {
            $query->whereHas('item', function($q) use ($request) {
                $q->where('item_category_id', $request->item_category_id);
            });
        }
        if ($request->filled('item_id')) {
            $query->where('item_id', $request->item_id);
        }

        $reportData = $query->get();

        return Inertia::render('Stock/StockTransferReport', [
            'reportData' => $reportData,
            'locations' => Location::all(),
            'warehouses' => Warehouse::all(),
            'categories' => ItemCategory::all(),
            'items' => Item::all(),
            'filters' => $request->all(),
        ]);
    }

    public function stockAdjustment()
    {
        return Inertia::render('Stock/StockAdjustment', [
            'locations' => Location::all(),
            'warehouses' => Warehouse::all(),
            'categories' => ItemCategory::all(),
            'items' => Item::with(['baseUnit', 'itemWarehouseMappings'])->get(),
        ]);
    }

    public function storeStockAdjustment(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'location_id' => 'required|exists:locations,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'remarks' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.current_stock' => 'required|numeric',
            'items.*.adjust_quantity' => 'required|numeric',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['items'] as $itemData) {
                $newQty = $itemData['current_stock'] + $itemData['adjust_quantity'];

                StockAdjustment::create([
                    'date' => $validated['date'],
                    'location_id' => $validated['location_id'],
                    'warehouse_id' => $validated['warehouse_id'],
                    'item_id' => $itemData['item_id'],
                    'current_stock' => $itemData['current_stock'],
                    'adjust_quantity' => $itemData['adjust_quantity'],
                    'new_quantity' => $newQty,
                    'remarks' => $validated['remarks'],
                ]);

                $mapping = ItemWarehouseMapping::updateOrCreate([
                    'location_id' => $validated['location_id'],
                    'warehouse_id' => $validated['warehouse_id'],
                    'item_id' => $itemData['item_id'],
                ], [
                    'current_quantity' => $newQty,
                    'item_category_id' => Item::find($itemData['item_id'])->item_category_id,
                ]);
            }
        });

        return redirect()->back()->with('success', 'Stock adjustments processed successfully.');
    }

    public function physicalStockFrequency()
    {
        return Inertia::render('Stock/PhysicalStockFrequency', [
            'locations' => Location::all(),
            'warehouses' => Warehouse::all(),
            'categories' => ItemCategory::all(),
            'items' => Item::with(['itemWarehouseMappings', 'baseUnit'])->get(),
            'frequencies' => PhysicalStockFrequency::all(),
        ]);
    }

    public function storePhysicalStockFrequency(Request $request)
    {
        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'items' => 'required|array',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.daily' => 'required|boolean',
            'items.*.weekly' => 'required|boolean',
            'items.*.monthly' => 'required|boolean',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['items'] as $itemData) {
                PhysicalStockFrequency::updateOrCreate([
                    'location_id' => $validated['location_id'],
                    'warehouse_id' => $validated['warehouse_id'],
                    'item_id' => $itemData['item_id'],
                ], [
                    'daily' => $itemData['daily'],
                    'weekly' => $itemData['weekly'],
                    'monthly' => $itemData['monthly'],
                ]);
            }
        });

        return redirect()->back()->with('success', 'Physical stock frequencies updated.');
    }

    public function physicalStockEntryReport()
    {
        return Inertia::render('Stock/PhysicalStockEntryReport', [
            'locations' => Location::all(),
            'warehouses' => Warehouse::all(),
            'items' => Item::with('baseUnit')->get(),
        ]);
    }

    public function storePhysicalStockEntryReport(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'location_id' => 'required|exists:locations,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.physical_stock' => 'required|numeric',
            'items.*.remark' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['items'] as $itemData) {
                PhysicalStockEntry::create([
                    'date' => $validated['date'],
                    'location_id' => $validated['location_id'],
                    'warehouse_id' => $validated['warehouse_id'],
                    'item_id' => $itemData['item_id'],
                    'physical_stock' => $itemData['physical_stock'],
                    'remark' => $itemData['remark'],
                ]);
            }
        });

        return redirect()->back()->with('success', 'Physical stock entries recorded.');
    }
}
