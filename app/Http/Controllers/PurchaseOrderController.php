<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Location;
use App\Models\Supplier;
use App\Models\Item;
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
            'items' => Item::all()
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
            'additional_charges' => 'required|numeric|min:0',
            'grand_total' => 'required|numeric|min:0',
            'remarks' => 'nullable|string',
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
                'additional_charges' => $validated['additional_charges'],
                'grand_total' => $validated['grand_total'],
                'total_amount' => $validated['grand_total'], // Legacy column mapping
                'remarks' => $validated['remarks'] ?? null,
                'status' => 'pending'
            ]);

            foreach ($validated['items'] as $itemData) {
                $po->items()->create($itemData);
            }

            DB::commit();

            return redirect()->route('purchase.approved-po')->with('success', 'Purchase Order generated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to generate Purchase Order. ' . $e->getMessage()]);
        }
    }

    public function approvedPOs()
    {
        $approvedPOs = PurchaseOrder::with('supplier')->where('status', 'approved')->latest()->get();
        return Inertia::render('Purchase/ApprovedPO', [
            'purchaseOrders' => $approvedPOs
        ]);
    }
}
