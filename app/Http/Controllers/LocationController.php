<?php

namespace App\Http\Controllers;

use App\Models\Location;
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
        $validated = $request->validate([
            'location_legal_name' => 'required|string|max:255',
        ]);

        Location::create($request->all());

        return redirect()->route('location-master.index')->with('success', 'Location added successfully.');
    }

    public function update(Request $request, Location $location)
    {
        $validated = $request->validate([
            'location_legal_name' => 'required|string|max:255',
        ]);

        $location->update($request->all());

        return redirect()->route('location-master.index')->with('success', 'Location updated successfully.');
    }

    public function destroy(Location $location)
    {
        $location->delete();
        return redirect()->route('location-master.index')->with('success', 'Location deleted successfully.');
    }
}
