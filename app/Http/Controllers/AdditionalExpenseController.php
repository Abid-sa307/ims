<?php

namespace App\Http\Controllers;

use App\Models\AdditionalExpense;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdditionalExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = AdditionalExpense::with('location')->latest();

        if ($request->filled('search')) {
            $query->where('expense_name', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('Operations/AdditionalExpense', [
            'expenses' => $query->paginate(15)->withQueryString(),
            'locations' => Location::where('location_type', '!=', 'Customer')->get(),
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'expense_name' => 'required|string|max:255',
            'expense_date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'location_id' => 'required|exists:locations,id',
            'category' => 'nullable|string|max:255',
            'remarks' => 'nullable|string',
        ]);

        AdditionalExpense::create($validated);

        return redirect()->back()->with('success', 'Additional expense recorded successfully.');
    }

    public function update(Request $request, AdditionalExpense $additionalExpense)
    {
        $validated = $request->validate([
            'expense_name' => 'required|string|max:255',
            'expense_date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'location_id' => 'required|exists:locations,id',
            'category' => 'nullable|string|max:255',
            'remarks' => 'nullable|string',
        ]);

        $additionalExpense->update($validated);

        return redirect()->back()->with('success', 'Additional expense updated successfully.');
    }

    public function destroy(AdditionalExpense $additionalExpense)
    {
        $additionalExpense->delete();

        return redirect()->back()->with('success', 'Additional expense deleted successfully.');
    }
}
