<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Imports\ItemImport;
use Maatwebsite\Excel\Facades\Excel;

class ItemController extends Controller
{
    public function index()
    {
        $items = Item::latest()->get();
        
        return Inertia::render('Master/ItemMaster', [
            'items' => $items
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_name' => 'required|string|max:255',
            'uom' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'tax_percent' => 'nullable|numeric|min:0',
            'cess_percent' => 'nullable|numeric|min:0',
            'description' => 'nullable|string'
        ]);

        Item::create($validated);

        return redirect()->back()->with('success', 'Item created successfully.');
    }

    public function update(Request $request, Item $item_master)
    {
        $validated = $request->validate([
            'item_name' => 'required|string|max:255',
            'uom' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'tax_percent' => 'nullable|numeric|min:0',
            'cess_percent' => 'nullable|numeric|min:0',
            'description' => 'nullable|string'
        ]);

        $item_master->update($validated);

        return redirect()->back()->with('success', 'Item updated successfully.');
    }

    public function destroy(Item $item_master)
    {
        $item_master->delete();

        return redirect()->back()->with('success', 'Item deleted successfully.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new ItemImport, $request->file('file'));

        return redirect()->back()->with('success', 'Items imported successfully.');
    }
}
