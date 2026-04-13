<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Supplier;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    public function index()
    {
        return Inertia::render('Master/LocationMaster', [
            'locations' => Location::all(),
            'suppliers' => Supplier::select('id', 'supplier_name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'location_legal_name' => 'required|string|max:255',
        ]);

        // Always use the location name as the warehouse name
        $input = $request->all();
        $input['default_warehouse_name'] = $request->location_legal_name;

        $location = Location::create($input);

        // Auto-create a Warehouse linked to this location
        Warehouse::create([
            'location_id' => $location->id,
            'name'        => $location->location_legal_name,
        ]);

        // Auto-create a Supplier entry mirroring this location
        Supplier::create([
            'supplier_name'        => $location->location_legal_name,
            'contact_number'       => $location->contact_number,
            'email'                => $location->email,
            'country'              => $location->country,
            'state'                => $location->state,
            'city'                 => $location->city,
            'address'              => $location->address,
            'pincode'              => $location->pincode,
            'gst_number'           => $location->gst_no,
            'pan'                  => $location->pan_no,
            'contact_person_name'  => $location->contact_person_name,
        ]);

        return redirect()->route('location-master.index')
            ->with('success', 'Location, warehouse and supplier created successfully.');
    }

    public function update(Request $request, Location $location)
    {
        $request->validate([
            'location_legal_name' => 'required|string|max:255',
        ]);

        $input = $request->all();
        $input['default_warehouse_name'] = $request->location_legal_name;

        $location->update($input);

        // Sync warehouse name to match location name
        $warehouse = Warehouse::where('location_id', $location->id)->first();
        if ($warehouse) {
            $warehouse->update(['name' => $location->location_legal_name]);
        } else {
            Warehouse::create([
                'location_id' => $location->id,
                'name'        => $location->location_legal_name,
            ]);
        }

        return redirect()->route('location-master.index')
            ->with('success', 'Location updated successfully.');
    }

    public function destroy(Location $location)
    {
        $location->delete();
        return redirect()->route('location-master.index')
            ->with('success', 'Location deleted successfully.');
    }
}
