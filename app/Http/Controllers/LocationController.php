<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    public function index()
    {
        $locations = Location::all();
        return Inertia::render('Master/LocationMaster', [
            'locations' => $locations
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'location_legal_name' => 'required|string|max:255',
        ]);

        $location = Location::create($request->all());

        // Auto-create a warehouse for this location if a name is provided
        if ($request->filled('default_warehouse_name')) {
            Warehouse::create([
                'location_id' => $location->id,
                'name' => $request->default_warehouse_name,
            ]);
        }

        return redirect()->route('location-master.index')->with('success', 'Location added successfully.');
    }

    public function update(Request $request, Location $location)
    {
        $request->validate([
            'location_legal_name' => 'required|string|max:255',
        ]);

        $oldWarehouseName = $location->default_warehouse_name;
        $location->update($request->all());

        // Sync warehouse: if name changed or no warehouse exists, create/update it
        if ($request->filled('default_warehouse_name')) {
            $warehouse = Warehouse::where('location_id', $location->id)->first();
            if ($warehouse) {
                $warehouse->update(['name' => $request->default_warehouse_name]);
            } else {
                Warehouse::create([
                    'location_id' => $location->id,
                    'name' => $request->default_warehouse_name,
                ]);
            }
        }

        return redirect()->route('location-master.index')->with('success', 'Location updated successfully.');
    }

    public function destroy(Location $location)
    {
        $location->delete();
        return redirect()->route('location-master.index')->with('success', 'Location deleted successfully.');
    }
}
