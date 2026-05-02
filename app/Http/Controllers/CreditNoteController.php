<?php

namespace App\Http\Controllers;

use App\Models\CreditNote;
use App\Models\CreditNoteItem;
use App\Models\Customer;
use App\Models\Item;
use App\Models\Location;
use App\Models\Tax;
use App\Models\Uom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CreditNoteController extends Controller
{
    public function index(Request $request)
    {
        $query = CreditNote::with(['customer', 'location'])->latest();

        if ($request->filled('search')) {
            $query->where('credit_note_number', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('Sales/CreditNote', [
            'creditNotes' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Sales/CreateCreditNote', [
            'customers' => Location::where('location_type', 'Customer')->select('id', 'location_legal_name', 'customer_id', 'state')->get(),
            'items' => Item::with(['baseUnit', 'taxProfile'])->get(),
            'uoms' => Uom::all(),
            'taxes' => Tax::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'location_id' => 'required|exists:locations,id',
            'total_amount' => 'required|numeric|min:0',
            'tax_amount' => 'required|numeric|min:0',
            'grand_total' => 'required|numeric|min:0',
            'remarks' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.uom_id' => 'required|exists:uoms,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.tax_amount' => 'required|numeric|min:0',
            'items.*.total_amount' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $location = Location::find($validated['location_id']);
            
            $creditNote = CreditNote::create([
                'credit_note_number' => 'CN-' . date('Ymd') . '-' . str_pad(CreditNote::count() + 1, 4, '0', STR_PAD_LEFT),
                'date' => $validated['date'],
                'customer_id' => $location->customer_id ?? 1, // Fallback if not linked
                'location_id' => $validated['location_id'],
                'total_amount' => $validated['total_amount'],
                'tax_amount' => $validated['tax_amount'],
                'grand_total' => $validated['grand_total'],
                'remarks' => $validated['remarks'],
            ]);

            foreach ($validated['items'] as $item) {
                CreditNoteItem::create([
                    'credit_note_id' => $creditNote->id,
                    'item_id' => $item['item_id'],
                    'uom_id' => $item['uom_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'tax_amount' => $item['tax_amount'],
                    'total_amount' => $item['total_amount'],
                ]);
            }
        });

        return redirect()->route('sales.credit-note')->with('success', 'Credit Note created successfully.');
    }
}
