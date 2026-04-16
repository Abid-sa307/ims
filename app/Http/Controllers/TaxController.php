<?php

namespace App\Http\Controllers;

use App\Models\Tax;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaxController extends Controller
{
    public function index()
    {
        return Inertia::render('Config/TaxList', [
            'taxes' => Tax::orderBy('id', 'desc')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tax_name' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        Tax::create([
            'tax_name' => $validated['tax_name'],
            'is_active' => $validated['is_active'] ?? true,
            'tax_type' => 'intrastate', // Default
            'total_rate' => 0,          // Default
        ]);

        return redirect()->back()->with('success', 'Tax created successfully.');
    }

    public function update(Request $request, Tax $taxMaster)
    {
        $validated = $request->validate([
            'tax_name' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $taxMaster->update([
            'tax_name' => $validated['tax_name'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->back()->with('success', 'Tax updated successfully.');
    }

    public function destroy(Tax $taxMaster)
    {
        $taxMaster->delete();
        return redirect()->back()->with('success', 'Tax deleted successfully.');
    }
}
