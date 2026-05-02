<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Location;
use App\Models\Supplier;
use App\Models\Item;
use App\Models\Warehouse;
use App\Models\ItemWarehouseMapping;
use App\Models\WastageEntry;
use App\Models\MissingEntry;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    public function create()
    {
        return Inertia::render('Purchase/GeneratePO', [
            'locations' => Location::where('location_type', 'HQ')->get(),
            'suppliers' => Supplier::all(),
            'items' => Item::with(['baseUnit', 'taxProfile'])->get(),
            'projects' => Project::where('status', true)->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'project_id' => 'nullable|exists:projects,id',
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
            'is_receive_now' => 'nullable|boolean',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.item_remark' => 'nullable|string|max:255',
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
                'project_id' => $validated['project_id'] ?? null,
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
                'status' => $request->is_receive_now ? 'received' : (($validated['is_auto_approved'] ?? false) ? 'approved' : 'pending'),
                'is_auto_approved' => $validated['is_auto_approved'] ?? false
            ]);

            foreach ($validated['items'] as $itemData) {
                $po->items()->create($itemData);
            }

            if ($request->is_receive_now) {
                $this->processStockUpdate($po);
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
        $query = PurchaseOrder::with(['supplier', 'location'])
            ->where('status', 'pending');

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

        return Inertia::render('Purchase/ApprovedPO', [
            'purchaseOrders' => $query->latest()->get(),
            'locations' => Location::where('location_type', 'HQ')->get(),
            'suppliers' => Supplier::all(),
            'filters' => $request->only(['date_from', 'date_to', 'location_id', 'supplier_id'])
        ]);
    }

    public function sendPOs(Request $request)
    {
        $query = PurchaseOrder::with(['supplier', 'location'])
            ->where('status', 'approved');

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

        return Inertia::render('Purchase/SendPO', [
            'purchaseOrders' => $query->latest()->get(),
            'locations' => Location::where('location_type', 'HQ')->get(),
            'suppliers' => Supplier::all(),
            'filters' => $request->only(['date_from', 'date_to', 'location_id', 'supplier_id'])
        ]);
    }

    public function transmitOrder(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load(['supplier', 'location', 'items.item.baseUnit', 'items.item.taxProfile']);
        return Inertia::render('Purchase/ReviewPO', [
            'purchaseOrder' => $purchaseOrder,
            'context' => 'transmit'
        ]);
    }

    public function send(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->update(['status' => 'sent']);
        return redirect()->route('purchase.received-po')
            ->with('success', 'Purchase Order sent successfully.');
    }

    public function reject(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->update(['status' => 'rejected']);
        return redirect()->route('purchase.approved-po')
            ->with('success', 'Purchase Order has been rejected.');
    }

    public function reviewOrder(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load(['supplier', 'location', 'items.item.baseUnit', 'items.item.taxProfile']);
        return Inertia::render('Purchase/ReviewPO', [
            'purchaseOrder' => $purchaseOrder,
        ]);
    }

    public function receivedPOs(Request $request)
    {
        $query = PurchaseOrder::with(['supplier', 'location'])
            ->where('status', 'sent');

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

        return Inertia::render('Purchase/ReceivedPO', [
            'purchaseOrders' => $query->latest()->get(),
            'locations' => Location::where('location_type', 'HQ')->get(),
            'suppliers' => Supplier::all(),
            'filters' => $request->only(['date_from', 'date_to', 'location_id', 'supplier_id'])
        ]);
    }

    public function receiveOrder(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load(['supplier', 'location', 'items.item.baseUnit']);
        
        return Inertia::render('Purchase/ReceiveOrder', [
            'purchaseOrder' => $purchaseOrder,
            'isFinalize' => $purchaseOrder->status === 'sent' && $purchaseOrder->ref_invoice_no !== null,
        ]);
    }

    public function processReceive(Request $request, PurchaseOrder $purchaseOrder)
    {
        $validated = $request->validate([
            'received_date' => 'required|date',
            'receive_remarks' => 'nullable|string',
            'dispatched_remarks' => 'nullable|string',
            'ref_invoice_date' => 'nullable|date',
            'ref_invoice_no' => 'nullable|string',
            'items' => 'required|array',
            'items.*.id' => 'required|exists:purchase_order_items,id',
            'items.*.received_qty' => 'required|numeric|min:0',
            'items.*.damaged_qty' => 'required|numeric|min:0',
            'items.*.missed_qty' => 'required|numeric|min:0',
            'items.*.mfg_date' => 'nullable|date',
            'items.*.expire_date' => 'nullable|date',
            'items.*.service_charge_percent' => 'nullable|numeric|min:0',
            'items.*.service_charge_amount' => 'nullable|numeric|min:0',
            'items.*.tcs_percent' => 'nullable|numeric|min:0',
            'items.*.tcs_amount' => 'nullable|numeric|min:0',
            'items.*.vat_percent' => 'nullable|numeric|min:0',
            'items.*.vat_amount' => 'nullable|numeric|min:0',
            'items.*.surcharge_percent' => 'nullable|numeric|min:0',
            'items.*.surcharge_amount' => 'nullable|numeric|min:0',
            'items.*.catering_levy_percent' => 'nullable|numeric|min:0',
            'items.*.catering_levy_amount' => 'nullable|numeric|min:0',
            'items.*.total_amount' => 'required|numeric|min:0',
            'grand_total' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            // Save receive details to DB but do NOT update stock yet (status stays 'sent')
            $purchaseOrder->update([
                'received_date' => $validated['received_date'],
                'receive_remarks' => $validated['receive_remarks'],
                'dispatched_remarks' => $validated['dispatched_remarks'],
                'ref_invoice_date' => $validated['ref_invoice_date'],
                'ref_invoice_no' => $validated['ref_invoice_no'],
                'grand_total' => $validated['grand_total'],
                'total_amount' => $validated['grand_total'],
            ]);

            foreach ($validated['items'] as $itemData) {
                $poItem = PurchaseOrderItem::findOrFail($itemData['id']);
                $poItem->update($itemData);
            }

            DB::commit();
            return redirect()->route('purchase.received-po')
                ->with('success', 'Receive details saved. Please finalize the receive to update stock.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to save receive details: ' . $e->getMessage()]);
        }
    }

    public function finalizeReceive(PurchaseOrder $purchaseOrder)
    {
        DB::beginTransaction();
        try {
            $purchaseOrder->update(['status' => 'received']);
            $this->processStockUpdate($purchaseOrder);
            DB::commit();
            return redirect()->route('purchase.summary')
                ->with('success', 'Purchase Order finalized. Stock has been updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to finalize receive: ' . $e->getMessage()]);
        }
    }

    public function receive(PurchaseOrder $purchaseOrder)
    {
        DB::transaction(function () use ($purchaseOrder) {
            $purchaseOrder->update(['status' => 'received']);
            $this->processStockUpdate($purchaseOrder);
        });

        return back()->with('success', 'Purchase Order marked as received and stock updated.');
    }

    private function processStockUpdate(PurchaseOrder $purchaseOrder)
    {
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
                    
                    $receivedQty = ($purchaseOrder->status === 'received' && $poItem->received_qty > 0) 
                        ? $poItem->received_qty 
                        : $poItem->qty;

                    $mapping->current_quantity += $receivedQty;
                    $mapping->save();

                    // Log wastage if damaged
                    if ($poItem->damaged_qty > 0) {
                        WastageEntry::create([
                            'date' => now()->toDateString(),
                            'location_id' => $purchaseOrder->location_id,
                            'warehouse_id' => $warehouse->id,
                            'item_category_id' => $item->item_category_id,
                            'item_id' => $poItem->item_id,
                            'uom_id' => $item->base_unit_id,
                            'wastage_quantity' => $poItem->damaged_qty,
                            'reason' => 'Damaged during Purchase Order reception (PO: ' . $purchaseOrder->order_number . ')',
                            'remarks' => $poItem->item_remark ?? 'Automatic entry from PO reception',
                        ]);

                        // Subtract damaged qty from stock (maintaining consistency with StockController wastage logic)
                        $mapping->decrement('current_quantity', $poItem->damaged_qty);
                    }

                    // Log missing if missed
                    if ($poItem->missed_qty > 0) {
                        MissingEntry::create([
                            'date' => now()->toDateString(),
                            'location_id' => $purchaseOrder->location_id,
                            'warehouse_id' => $warehouse->id,
                            'item_category_id' => $item->item_category_id,
                            'item_id' => $poItem->item_id,
                            'uom_id' => $item->base_unit_id,
                            'missing_quantity' => $poItem->missed_qty,
                            'reason' => 'Missed during Purchase Order reception (PO: ' . $purchaseOrder->order_number . ')',
                        ]);
                    }
                }
            }
        }
    }

    public function approve(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->update(['status' => 'approved']);
        return redirect()->route('purchase.send-po')->with('success', 'Purchase Order approved. Please transmit it to the supplier.');
    }

    public function autoApprovedPOs()
    {
        $autoApprovedPOs = PurchaseOrder::with('supplier')->where('is_auto_approved', true)->latest()->get();
        return Inertia::render('Purchase/AutoApprovedPO', [
            'purchaseOrders' => $autoApprovedPOs
        ]);
    }

    public function pendingReceiveOrders(Request $request)
    {
        $query = PurchaseOrder::with(['supplier', 'location'])
            ->where('status', 'sent');

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

        return Inertia::render('Purchase/PendingReceiveOrders', [
            'purchaseOrders' => $query->latest()->get(),
            'locations' => Location::where('location_type', 'HQ')->get(),
            'suppliers' => Supplier::all(),
            'filters' => $request->only(['date_from', 'date_to', 'location_id', 'supplier_id'])
        ]);
    }

    public function edit(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load('items.item.baseUnit');
        
        return Inertia::render('Purchase/EditPO', [
            'purchaseOrder' => $purchaseOrder,
            'locations' => Location::where('location_type', 'HQ')->get(),
            'suppliers' => Supplier::all(),
            'items' => Item::with(['baseUnit', 'taxProfile'])->get()
        ]);
    }

    public function update(Request $request, PurchaseOrder $purchaseOrder)
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
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.uom' => 'required|string',
            'items.*.qty' => 'required|numeric|min:0.001',
            'items.*.current_price' => 'required|numeric|min:0',
            'items.*.tax_percent' => 'required|numeric|min:0',
            'items.*.tax_amount' => 'required|numeric|min:0',
            'items.*.total_amount' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $purchaseOrder->update([
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
                'total_amount' => $validated['grand_total'],
                'remarks' => $validated['remarks'] ?? null,
            ]);

            // Simple item sync: delete and recreate
            $purchaseOrder->items()->delete();
            foreach ($validated['items'] as $itemData) {
                $purchaseOrder->items()->create($itemData);
            }

            DB::commit();
            return redirect()->route('purchase.summary')->with('success', 'Purchase Order updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update Purchase Order: ' . $e->getMessage()]);
        }
    }

    public function destroy(PurchaseOrder $purchaseOrder)
    {
        DB::beginTransaction();
        try {
            $purchaseOrder->items()->delete();
            $purchaseOrder->delete();
            DB::commit();
            return redirect()->route('purchase.summary')->with('success', 'Purchase Order deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to delete Purchase Order: ' . $e->getMessage()]);
        }
    }

    public function summary(Request $request)
    {
        $query = PurchaseOrder::with(['supplier', 'location', 'project'])->latest();

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
        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return Inertia::render('Purchase/Summary', [
            'purchaseOrders' => $query->paginate(15)->withQueryString(),
            'locations' => Location::where('location_type', 'HQ')->get(),
            'suppliers' => Supplier::all(),
            'projects' => Project::where('status', true)->get(),
            'filters' => $request->only(['search', 'date_from', 'date_to', 'location_id', 'supplier_id', 'project_id', 'status'])
        ]);
    }
}
