<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Location;
use App\Models\Supplier;
use App\Models\Item;
use App\Models\Warehouse;
use App\Models\ItemWarehouseMapping;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    public function create()
    {
        return Inertia::render('Purchase/GeneratePO', [
            'locations' => Location::all(),
            'suppliers' => Supplier::all(),
            'items' => Item::with('baseUnit')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'reference_bill_no' => 'nullable|string',
            'reference_challan_no' => 'nullable|string',
            'po_date' => 'required|date',
            'exp_order_date' => 'required|date',
            'inv_date' => 'required|date',
            'discount_amount' => 'required|numeric|min:0',
            'total_tax_amount' => 'required|numeric|min:0',
            'cgst_amount' => 'required|numeric|min:0',
            'sgst_amount' => 'required|numeric|min:0',
            'igst_amount' => 'required|numeric|min:0',
            'utgst_amount' => 'required|numeric|min:0',
            'additional_charges' => 'required|numeric|min:0',
            'grand_total' => 'required|numeric|min:0',
            'remarks' => 'nullable|string',
            'is_auto_approved' => 'nullable|boolean',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.uom' => 'required|string',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.fat_value' => 'nullable|string',
            'items.*.last_price' => 'required|numeric|min:0',
            'items.*.current_price' => 'required|numeric|min:0',
            'items.*.expire_date' => 'nullable|date',
            'items.*.discount_percent' => 'required|numeric|min:0',
            'items.*.discount_amount' => 'required|numeric|min:0',
            'items.*.taxable_amount' => 'required|numeric|min:0',
            'items.*.cess_percent' => 'required|numeric|min:0',
            'items.*.cess_amount' => 'required|numeric|min:0',
            'items.*.tax_percent' => 'required|numeric|min:0',
            'items.*.tax_amount' => 'required|numeric|min:0',
            'items.*.cgst_percent' => 'required|numeric|min:0',
            'items.*.cgst_amount' => 'required|numeric|min:0',
            'items.*.sgst_percent' => 'required|numeric|min:0',
            'items.*.sgst_amount' => 'required|numeric|min:0',
            'items.*.igst_percent' => 'required|numeric|min:0',
            'items.*.igst_amount' => 'required|numeric|min:0',
            'items.*.utgst_percent' => 'required|numeric|min:0',
            'items.*.utgst_amount' => 'required|numeric|min:0',
            'items.*.total_amount' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            // Generate a unique order number (simple format for now)
            $orderNumber = 'PO-' . date('Ymd') . '-' . rand(1000, 9999);

            $po = PurchaseOrder::create([
                'order_number' => $orderNumber,
                'supplier_id' => $validated['supplier_id'],
                'location_id' => $validated['location_id'],
                'reference_bill_no' => $validated['reference_bill_no'] ?? null,
                'reference_challan_no' => $validated['reference_challan_no'] ?? null,
                'po_date' => $validated['po_date'],
                'exp_order_date' => $validated['exp_order_date'],
                'inv_date' => $validated['inv_date'],
                'discount_amount' => $validated['discount_amount'],
                'total_tax_amount' => $validated['total_tax_amount'],
                'cgst_amount' => $validated['cgst_amount'],
                'sgst_amount' => $validated['sgst_amount'],
                'igst_amount' => $validated['igst_amount'],
                'utgst_amount' => $validated['utgst_amount'],
                'additional_charges' => $validated['additional_charges'],
                'grand_total' => $validated['grand_total'],
                'total_amount' => $validated['grand_total'], // Legacy column mapping
                'remarks' => $validated['remarks'] ?? null,
                'status' => ($validated['is_auto_approved'] ?? false) ? 'approved' : 'pending',
                'is_auto_approved' => $validated['is_auto_approved'] ?? false
            ]);

            foreach ($validated['items'] as $itemData) {
                $po->items()->create($itemData);
            }

            DB::commit();

            return redirect()->route('purchase.summary')->with('success', 'Purchase Order generated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('PO Generation Failed: ' . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->all()
            ]);
            return back()->withErrors(['error' => 'Failed to generate Purchase Order. ' . $e->getMessage()]);
        }
    }

    public function approvedPOs(Request $request)
    {
        $query = PurchaseOrder::with('supplier')
            ->whereIn('status', ['pending', 'approved']);

        if ($request->filled('date_from')) {
            $query->whereDate('po_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('po_date', '<=', $request->date_to);
        }

        return Inertia::render('Purchase/ApprovedPO', [
            'purchaseOrders' => $query->latest()->get(),
            'filters' => $request->only(['date_from', 'date_to'])
        ]);
    }

    public function sendPOs(Request $request)
    {
        $query = PurchaseOrder::with('supplier')
            ->whereIn('status', ['approved', 'sent']);

        if ($request->filled('date_from')) {
            $query->whereDate('po_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('po_date', '<=', $request->date_to);
        }

        return Inertia::render('Purchase/SendPO', [
            'purchaseOrders' => $query->latest()->get(),
            'filters' => $request->only(['date_from', 'date_to'])
        ]);
    }

    public function send(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->update(['status' => 'sent']);
        return back()->with('success', 'Purchase Order sent to supplier.');
    }

    public function receivedPOs(Request $request)
    {
        $query = PurchaseOrder::with('supplier')
            ->whereIn('status', ['sent', 'received']);

        if ($request->filled('date_from')) {
            $query->whereDate('po_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('po_date', '<=', $request->date_to);
        }

        return Inertia::render('Purchase/ReceivedPO', [
            'purchaseOrders' => $query->latest()->get(),
            'filters' => $request->only(['date_from', 'date_to'])
        ]);
    }

    public function receive(PurchaseOrder $purchaseOrder)
    {
        DB::transaction(function () use ($purchaseOrder) {
            $purchaseOrder->update(['status' => 'received']);

            // Find first warehouse at this location to update stock
            $warehouse = Warehouse::where('location_id', $purchaseOrder->location_id)->first();
            
            if ($warehouse) {
                // Load items if not already loaded
                $purchaseOrder->load('items.item');

                foreach ($purchaseOrder->items as $poItem) {
                    $item = $poItem->item;
                    if ($item) {
                        $mapping = ItemWarehouseMapping::firstOrNew([
                            'location_id' => $purchaseOrder->location_id,
                            'warehouse_id' => $warehouse->id,
                            'item_id' => $poItem->item_id,
                        ]);
                        
                        // If branding new, ensure category is set
                        if (!$mapping->exists) {
                            $mapping->item_category_id = $item->item_category_id;
                            $mapping->current_quantity = 0;
                        }
                        
                        $mapping->current_quantity += $poItem->qty;
                        $mapping->save();
                    }
                }
            }
        });

        return back()->with('success', 'Purchase Order marked as received and stock updated.');
    }

    public function approve(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->update(['status' => 'approved']);
        return back()->with('success', 'Purchase Order approved successfully.');
    }

    public function autoApprovedPOs()
    {
        $autoApprovedPOs = PurchaseOrder::with('supplier')->where('is_auto_approved', true)->latest()->get();
        return Inertia::render('Purchase/AutoApprovedPO', [
            'purchaseOrders' => $autoApprovedPOs
        ]);
    }

    public function summary(Request $request)
    {
        $query = PurchaseOrder::with(['supplier', 'location'])->latest();

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('order_number', 'like', '%' . $request->search . '%')
                  ->orWhereHas('supplier', function($sq) use ($request) {
                      $sq->where('supplier_name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('po_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('po_date', '<=', $request->date_to);
        }
        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }
        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return Inertia::render('Purchase/Summary', [
            'purchaseOrders' => $query->paginate(15)->withQueryString(),
            'locations' => Location::all(),
            'suppliers' => Supplier::all(),
            'filters' => $request->only(['search', 'date_from', 'date_to', 'location_id', 'supplier_id', 'status'])
        ]);
    }
}
