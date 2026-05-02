<?php

namespace App\Http\Controllers;

use App\Models\DebitNote;
use App\Models\DebitNoteItem;
use App\Models\PurchaseOrder;
use App\Models\Location;
use App\Models\Supplier;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DebitNoteController extends Controller
{
    public function index()
    {
        $debitNotes = DebitNote::with(['purchaseOrder', 'supplier', 'location'])->latest()->get();
        return Inertia::render('Purchase/DebitNote', [
            'debitNotes' => $debitNotes
        ]);
    }

    public function create()
    {
        return Inertia::render('Purchase/GenerateDebitNote', [
            'locations' => Location::where('location_type', '!=', 'Customer')->get(),
            'suppliers' => Supplier::all(),
            'purchaseOrders' => PurchaseOrder::with(['supplier', 'items.item'])->where('status', '!=', 'rejected')->get(),
            'items' => Item::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'debit_note_date' => 'required|date',
            'reference' => 'nullable|string',
            'description' => 'nullable|string',
            'total_amount_base' => 'required|numeric',
            'discount' => 'required|numeric',
            'total_taxable_amt' => 'required|numeric',
            'total_cess_amt' => 'required|numeric',
            'total_tax_amt' => 'required|numeric',
            'additional_charges' => 'required|numeric',
            'grand_total' => 'required|numeric',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.uom' => 'required|string',
            'items.*.unit_price' => 'required|numeric',
            'items.*.ordered_qty' => 'required|numeric',
            'items.*.already_returned_qty' => 'required|numeric',
            'items.*.return_qty' => 'required|numeric|min:0',
            'items.*.discount_percent' => 'required|numeric',
            'items.*.discount_amount' => 'required|numeric',
            'items.*.taxable_amount' => 'required|numeric',
            'items.*.cess_percent' => 'required|numeric',
            'items.*.cess_amount' => 'required|numeric',
            'items.*.sgst_percent' => 'required|numeric',
            'items.*.sgst_amount' => 'required|numeric',
            'items.*.cgst_percent' => 'required|numeric',
            'items.*.cgst_amount' => 'required|numeric',
            'items.*.service_charge_percent' => 'required|numeric',
            'items.*.service_charge_amount' => 'required|numeric',
            'items.*.tcs_percent' => 'required|numeric',
            'items.*.tcs_amount' => 'required|numeric',
            'items.*.vat_percent' => 'required|numeric',
            'items.*.vat_amount' => 'required|numeric',
            'items.*.surcharge_percent' => 'required|numeric',
            'items.*.surcharge_amount' => 'required|numeric',
            'items.*.catering_levy_percent' => 'required|numeric',
            'items.*.catering_levy_amount' => 'required|numeric',
            'items.*.total_amount' => 'required|numeric'
        ]);

        DB::beginTransaction();

        try {
            // Generate note number
            $noteNumber = 'DN-' . date('Ymd') . '-' . rand(1000, 9999);

            $debitNote = DebitNote::create(array_merge($validated, [
                'note_number' => $noteNumber,
                'amount' => $validated['grand_total'],
            ]));

            foreach ($validated['items'] as $itemData) {
                $debitNote->items()->create($itemData);
            }

            DB::commit();

            return redirect()->route('purchase.debit-note.index')->with('success', 'Debit Note generated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to generate Debit Note. ' . $e->getMessage()]);
        }
    }
}
