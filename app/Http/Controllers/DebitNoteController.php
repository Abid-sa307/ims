<?php

namespace App\Http\Controllers;

use App\Models\DebitNote;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DebitNoteController extends Controller
{
    public function index()
    {
        $debitNotes = DebitNote::with('purchaseOrder.supplier')->latest()->get();
        return Inertia::render('Purchase/DebitNote', [
            'debitNotes' => $debitNotes
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'note_number' => 'required|string|unique:debit_notes',
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'amount' => 'required|numeric|min:0',
            'reason' => 'nullable|string'
        ]);

        DebitNote::create($validated);

        return redirect()->back()->with('success', 'Debit Note created successfully.');
    }
}
