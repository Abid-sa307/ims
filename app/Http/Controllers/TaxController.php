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
            'taxes' => Tax::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Config/TaxMaster');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tax_name' => 'required|string|max:255',
            'tax_type' => 'required|in:intrastate,interstate,union_territory',
            'cgst_rate' => 'nullable|numeric|min:0|max:100',
            'sgst_rate' => 'nullable|numeric|min:0|max:100',
            'igst_rate' => 'nullable|numeric|min:0|max:100',
            'utgst_rate' => 'nullable|numeric|min:0|max:100',
        ]);

        $totalRate = ($validated['cgst_rate'] ?? 0) + 
                     ($validated['sgst_rate'] ?? 0) + 
                     ($validated['igst_rate'] ?? 0) + 
                     ($validated['utgst_rate'] ?? 0);

        Tax::create([
            'tax_name' => $validated['tax_name'],
            'tax_type' => $validated['tax_type'],
            'cgst_rate' => $validated['cgst_rate'] ?? 0,
            'sgst_rate' => $validated['sgst_rate'] ?? 0,
            'igst_rate' => $validated['igst_rate'] ?? 0,
            'utgst_rate' => $validated['utgst_rate'] ?? 0,
            'total_rate' => $totalRate,
        ]);

        return redirect()->back()->with('success', 'Tax created successfully.');
    }

    public function update(Request $request, Tax $tax)
    {
        $validated = $request->validate([
            'tax_name' => 'required|string|max:255',
            'tax_type' => 'required|in:intrastate,interstate,union_territory',
            'cgst_rate' => 'nullable|numeric|min:0|max:100',
            'sgst_rate' => 'nullable|numeric|min:0|max:100',
            'igst_rate' => 'nullable|numeric|min:0|max:100',
            'utgst_rate' => 'nullable|numeric|min:0|max:100',
        ]);

        $totalRate = ($validated['cgst_rate'] ?? 0) + 
                     ($validated['sgst_rate'] ?? 0) + 
                     ($validated['igst_rate'] ?? 0) + 
                     ($validated['utgst_rate'] ?? 0);

        $tax->update([
            'tax_name' => $validated['tax_name'],
            'tax_type' => $validated['tax_type'],
            'cgst_rate' => $validated['cgst_rate'] ?? 0,
            'sgst_rate' => $validated['sgst_rate'] ?? 0,
            'igst_rate' => $validated['igst_rate'] ?? 0,
            'utgst_rate' => $validated['utgst_rate'] ?? 0,
            'total_rate' => $totalRate,
        ]);

        return redirect()->back()->with('success', 'Tax updated successfully.');
    }

    public function destroy(Tax $tax)
    {
        $tax->delete();
        return redirect()->back()->with('success', 'Tax deleted successfully.');
    }
}
