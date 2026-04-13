<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Location;
use App\Models\Supplier;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SupplierController extends Controller
{
    public function index()
    {
        // Eager-load a "location" relationship if it exists, otherwise raw
        $suppliers = Supplier::latest()->get();
        return Inertia::render('Master/SupplierMaster', [
            'suppliers' => $suppliers,
            'locations' => Location::select('id', 'location_legal_name', 'location_type')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'supplier_name' => 'required|string|max:255',
            'country'       => 'required|string',
            'state'         => 'required|string',
            'city'          => 'required|string',
            'contact_number'=> 'required|string',
        ]);

        $data = $request->all();

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('suppliers', 'public');
        }

        Supplier::create($data);

        return redirect()->back()->with('success', 'Supplier created successfully.');
    }

    public function update(Request $request, $id)
    {
        $supplier = Supplier::findOrFail($id);
        $request->validate([
            'supplier_name' => 'required|string|max:255',
            'country'       => 'required|string',
            'state'         => 'required|string',
            'city'          => 'required|string',
            'contact_number'=> 'required|string',
        ]);

        $data = $request->all();

        if ($request->hasFile('logo')) {
            if ($supplier->logo) {
                Storage::disk('public')->delete($supplier->logo);
            }
            $data['logo'] = $request->file('logo')->store('suppliers', 'public');
        }

        $supplier->update($data);

        return redirect()->back()->with('success', 'Supplier updated successfully.');
    }

    public function destroy($id)
    {
        $supplier = Supplier::findOrFail($id);
        if ($supplier->logo) {
            Storage::disk('public')->delete($supplier->logo);
        }
        $supplier->delete();
        return redirect()->back()->with('success', 'Supplier deleted successfully.');
    }
}
