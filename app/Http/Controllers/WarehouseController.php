<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/WarehouseMaster', [
            'warehouses' => Warehouse::with('location')->get(),
            'locations' => Location::where('location_type', '!=', 'Customer')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:warehouses,name',
            'location_id' => 'required|exists:locations,id',
        ]);
        Warehouse::create($request->all());
        return redirect()->back();
    }

    public function update(Request $request, Warehouse $warehouse)
    {
        $request->validate([
            'location_id' => 'required|exists:locations,id',
            'name' => 'required|string|max:255'
        ]);
        $warehouse->update($request->all());
        return redirect()->back();
    }

    public function destroy(Warehouse $warehouse)
    {
        $warehouse->delete();
        return redirect()->back();
    }
}
